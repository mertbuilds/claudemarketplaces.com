#!/usr/bin/env bun
/**
 * Deduplicate marketplaces by resolving GitHub repo renames/redirects,
 * remove deleted repos, update stars, then seed to Supabase.
 *
 * Usage:
 *   bun run scripts/dedup-and-sync.ts                # Full run
 *   bun run scripts/dedup-and-sync.ts --dry-run      # Preview without writing
 *   bun run scripts/dedup-and-sync.ts --no-seed      # Dedup JSON only, skip Supabase
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Marketplace, Plugin } from "../lib/types";

// --- Config ---
const CONCURRENCY = 30;
const DATA_DIR = join(process.cwd(), "lib", "data");
const CACHE_FILE = join(process.cwd(), "scripts", ".dedup-cache.json");
const DRY_RUN = process.argv.includes("--dry-run");
const NO_SEED = process.argv.includes("--no-seed");
const NO_CACHE = process.argv.includes("--no-cache");

// --- Colors ---
const c = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(msg: string, color = c.reset) {
  console.log(`${color}${msg}${c.reset}`);
}

// --- GitHub API ---
const GITHUB_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  log("ERROR: Set GH_TOKEN or GITHUB_TOKEN env var", c.red);
  process.exit(1);
}

interface RepoCheck {
  canonical: string | null;
  stars: number;
  exists: boolean;
  description: string;
  updatedAt: string;
}

async function checkRepo(repo: string, retries = 0): Promise<RepoCheck> {
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    redirect: "follow",
  });

  if (res.status === 404 || res.status === 451) {
    return { canonical: null, stars: 0, exists: false, description: "", updatedAt: "" };
  }

  if ((res.status === 403 || res.status === 429) && retries < 2) {
    // Rate limited — use x-ratelimit-reset header for accurate wait
    const resetEpoch = parseInt(res.headers.get("x-ratelimit-reset") || "0", 10);
    const waitSecs = resetEpoch > 0
      ? Math.max(resetEpoch - Math.floor(Date.now() / 1000), 1) + 2
      : 60;
    log(`\n  Rate limited, waiting ${waitSecs}s until reset...`, c.yellow);
    await new Promise((r) => setTimeout(r, waitSecs * 1000));
    return checkRepo(repo, retries + 1);
  }

  if (!res.ok) {
    log(`  Unexpected ${res.status} for ${repo}`, c.yellow);
    return { canonical: repo, stars: 0, exists: true, description: "", updatedAt: "" };
  }

  const data = await res.json();
  return {
    canonical: data.full_name,
    stars: data.stargazers_count ?? 0,
    exists: true,
    description: data.description ?? "",
    updatedAt: data.updated_at ?? "",
  };
}

// --- Batch processor ---
async function processBatch<T, R>(
  items: T[],
  fn: (item: T, idx: number) => Promise<R>,
  concurrency: number,
  label: string
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let completed = 0;

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((item, j) => fn(item, i + j))
    );
    for (let j = 0; j < batchResults.length; j++) {
      results[i + j] = batchResults[j];
    }
    completed += batch.length;

    // Progress every batch
    const pct = ((completed / items.length) * 100).toFixed(0);
    process.stdout.write(
      `\r  ${c.gray}${label}: ${completed}/${items.length} (${pct}%)${c.reset}`
    );
  }
  process.stdout.write("\n");
  return results;
}

function repoToSlug(repo: string): string {
  return repo.replace(/\//g, "-").toLowerCase();
}

// --- Main ---
async function main() {
  const startTime = Date.now();

  log("\n" + "=".repeat(60), c.cyan);
  log("  Dedup Marketplaces & Sync to Supabase", c.bright);
  log("=".repeat(60), c.cyan);

  if (DRY_RUN) log("\n  DRY RUN — no files will be written\n", c.yellow);

  // 1. Read JSON data
  log("\n[1/5] Reading local JSON data...", c.cyan);
  const marketplaces: Marketplace[] = JSON.parse(
    readFileSync(join(DATA_DIR, "marketplaces.json"), "utf-8")
  );
  const plugins: Plugin[] = JSON.parse(
    readFileSync(join(DATA_DIR, "plugins.json"), "utf-8")
  );
  log(`  ${marketplaces.length} marketplaces, ${plugins.length} plugins`, c.gray);

  // 2. Check all repos against GitHub API (with cache)
  log("\n[2/5] Checking repos against GitHub API...", c.cyan);

  // Load cache
  let cache: Record<string, RepoCheck> = {};
  if (!NO_CACHE && existsSync(CACHE_FILE)) {
    cache = JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
    log(`  Loaded cache: ${Object.keys(cache).length} entries`, c.gray);
  }

  // Split into cached vs uncached
  const uncached = marketplaces.filter((m) => !cache[m.repo]);
  const cached = marketplaces.filter((m) => cache[m.repo]);
  log(`  Cached: ${cached.length}, Need API: ${uncached.length}`, c.gray);

  // Check uncached repos
  if (uncached.length > 0) {
    await processBatch(
      uncached,
      async (m) => {
        const result = await checkRepo(m.repo);
        cache[m.repo] = result;
        return result;
      },
      CONCURRENCY,
      "GitHub API"
    );

    // Save cache after API calls
    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    log(`  Cache saved: ${Object.keys(cache).length} entries`, c.gray);
  }

  // Build checks from cache
  const checks = marketplaces.map((m) => ({
    marketplace: m,
    check: cache[m.repo],
  }));

  // Print rate limit status
  const rlRes = await fetch("https://api.github.com/rate_limit", {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
  });
  const rl = await rlRes.json();
  log(
    `  Rate limit: ${rl.resources.core.remaining}/${rl.resources.core.limit} remaining`,
    c.gray
  );

  // 3. Deduplicate
  log("\n[3/5] Deduplicating...", c.cyan);

  const deleted: string[] = [];
  const byCanonical = new Map<
    string,
    Array<{ marketplace: Marketplace; check: RepoCheck }>
  >();

  for (const entry of checks) {
    if (!entry.check.exists) {
      deleted.push(entry.marketplace.repo);
      continue;
    }

    const key = entry.check.canonical!.toLowerCase();
    if (!byCanonical.has(key)) {
      byCanonical.set(key, []);
    }
    byCanonical.get(key)!.push(entry);
  }

  // Build deduped list + slug mapping
  const deduplicated: Marketplace[] = [];
  const slugMapping = new Map<string, string>(); // old slug → new slug
  const removedSlugs = new Set<string>();
  let mergeCount = 0;

  for (const [, entries] of byCanonical) {
    // Sort by stars desc → pick the one with most stars
    entries.sort((a, b) => b.check.stars - a.check.stars);
    const best = entries[0];
    const canonicalRepo = best.check.canonical!;
    const newSlug = repoToSlug(canonicalRepo);

    deduplicated.push({
      ...best.marketplace,
      repo: canonicalRepo,
      slug: newSlug,
      stars: best.check.stars,
      starsFetchedAt: new Date().toISOString(),
      description: best.check.description || best.marketplace.description,
    });

    // Map all old slugs to the canonical one
    for (const entry of entries) {
      const oldSlug = entry.marketplace.slug;
      if (oldSlug !== newSlug) {
        slugMapping.set(oldSlug, newSlug);
        removedSlugs.add(oldSlug);
        mergeCount++;
      }
    }
  }

  // Sort by stars descending
  deduplicated.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));

  // Track deleted marketplace slugs
  for (const repo of deleted) {
    removedSlugs.add(repoToSlug(repo));
  }

  log(`  Deleted repos (404): ${deleted.length}`, c.red);
  log(`  Duplicates merged: ${mergeCount}`, c.yellow);
  log(`  Final marketplaces: ${deduplicated.length}`, c.green);

  // Print merged repos for visibility
  if (mergeCount > 0) {
    log("\n  Merged repos:", c.yellow);
    for (const [oldSlug, newSlug] of slugMapping) {
      log(`    ${oldSlug} → ${newSlug}`, c.gray);
    }
  }

  // 4. Update plugins
  log("\n[4/5] Updating plugins...", c.cyan);

  const validSlugs = new Set(deduplicated.map((m) => m.slug));
  const updatedPlugins: Plugin[] = [];
  let remappedCount = 0;
  let removedPluginCount = 0;

  for (const p of plugins) {
    // Remap if slug changed
    const newSlug = slugMapping.get(p.marketplace);
    const effectiveSlug = newSlug ?? p.marketplace;

    if (validSlugs.has(effectiveSlug)) {
      if (newSlug) remappedCount++;
      updatedPlugins.push({
        ...p,
        marketplace: effectiveSlug,
      });
    } else {
      removedPluginCount++;
    }
  }

  log(`  Plugins remapped: ${remappedCount}`, c.yellow);
  log(`  Plugins removed (orphaned): ${removedPluginCount}`, c.red);
  log(`  Final plugins: ${updatedPlugins.length}`, c.green);

  // 5. Write results
  log("\n[5/5] Writing results...", c.cyan);

  if (DRY_RUN) {
    log("  Skipping writes (dry run)", c.yellow);
  } else {
    writeFileSync(
      join(DATA_DIR, "marketplaces.json"),
      JSON.stringify(deduplicated, null, 2)
    );
    log(`  Wrote marketplaces.json (${deduplicated.length} entries)`, c.green);

    writeFileSync(
      join(DATA_DIR, "plugins.json"),
      JSON.stringify(updatedPlugins, null, 2)
    );
    log(`  Wrote plugins.json (${updatedPlugins.length} entries)`, c.green);
  }

  // Seed to Supabase
  if (!DRY_RUN && !NO_SEED) {
    log("\n  Seeding to Supabase...", c.cyan);
    log("  Run: bun run seed", c.gray);
  }

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log("\n" + "=".repeat(60), c.cyan);
  log(`  Done in ${elapsed}s`, c.green);
  log(
    `  ${marketplaces.length} → ${deduplicated.length} marketplaces (-${marketplaces.length - deduplicated.length})`,
    c.bright
  );
  log(
    `  ${plugins.length} → ${updatedPlugins.length} plugins (-${plugins.length - updatedPlugins.length})`,
    c.bright
  );
  log("=".repeat(60), c.cyan);
}

main().catch((err) => {
  log(`\nFATAL: ${err.message ?? err}`, c.red);
  process.exit(1);
});
