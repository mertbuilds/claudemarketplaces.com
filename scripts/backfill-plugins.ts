#!/usr/bin/env bun
/**
 * Backfill plugins for marketplaces whose `plugins` rows are missing or under-populated.
 *
 * Discovery (`scripts/search.ts`) leaves marketplace rows with stored `plugin_count` set,
 * but the corresponding rows in the `plugins` table can be missing — either never persisted
 * or wiped at some point. This script finds every marketplace where the actual plugin row
 * count is less than the stored `plugin_count`, re-fetches its `marketplace.json` from
 * GitHub, and upserts the plugins.
 *
 * Reuses primitives from `lib/search/*` — no new GitHub or Supabase helpers.
 *
 * Usage:
 *   bun run scripts/backfill-plugins.ts                          # Process all underpopulated
 *   bun run scripts/backfill-plugins.ts --limit 10               # Process top 10 by stars
 *   bun run scripts/backfill-plugins.ts --marketplace owner-repo # Single marketplace
 *   bun run scripts/backfill-plugins.ts --dry-run                # Preview, no writes
 *   bun run scripts/backfill-plugins.ts --verbose                # Show per-marketplace details
 *
 * IMPORTANT: defaults to whatever Supabase credentials are in the loaded env. To target
 * prod, run with `bun --env-file=.env.prod run scripts/backfill-plugins.ts` or via the
 * `backfill` npm script.
 */

import { createAdminClient } from "../lib/supabase/admin";
import { fetchMarketplaceFile } from "../lib/search/github-search";
import {
  extractPluginsFromMarketplace,
  aggregatePluginKeywords,
} from "../lib/search/plugin-extractor";
import { upsertPlugins } from "../lib/search/supabase-storage";
import { batchExecute, withRetry } from "../lib/search/rate-limit";
import type { Marketplace, Plugin } from "../lib/types";

interface CliArgs {
  limit?: number;
  marketplace?: string;
  dryRun: boolean;
  verbose: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = { dryRun: false, verbose: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--limit" && i + 1 < args.length) {
      result.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === "--marketplace" && i + 1 < args.length) {
      result.marketplace = args[i + 1];
      i++;
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg === "--verbose" || arg === "-v") {
      result.verbose = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
Usage: bun run scripts/backfill-plugins.ts [options]

Options:
  --limit N             Process only the first N underpopulated marketplaces (sorted by stars desc)
  --marketplace SLUG    Target a single marketplace by slug (e.g. "anthropics-claude-code")
  --dry-run             Run discovery + extraction but skip writes
  --verbose, -v         Show per-marketplace details
  --help, -h            Show this help message
`);
      process.exit(0);
    }
  }

  return result;
}

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}
function logStep(step: number | string, message: string) {
  log(`\n${colors.bright}[${step}]${colors.reset} ${colors.cyan}${message}${colors.reset}`);
}
function logSuccess(message: string) { log(`  ✅ ${message}`, colors.green); }
function logWarning(message: string) { log(`  ⚠️  ${message}`, colors.yellow); }
function logError(message: string)   { log(`  ❌ ${message}`, colors.red); }
function logInfo(message: string)    { log(`  ${message}`, colors.gray); }

interface MarketplaceRow {
  repo: string;
  slug: string;
  description: string;
  plugin_count: number;
  categories: string[] | null;
  plugin_keywords: string[] | null;
  discovered_at: string | null;
  last_updated: string | null;
  source: string | null;
  stars: number | null;
  stars_fetched_at: string | null;
}

async function fetchAllPaginated<T>(
  table: string,
  columns: string,
): Promise<T[]> {
  const admin = createAdminClient();
  const all: T[] = [];
  const pageSize = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await admin
      .from(table)
      .select(columns)
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Failed paginating ${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...(data as unknown as T[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

interface BackfillTarget {
  row: MarketplaceRow;
  storedCount: number;
  actualCount: number;
}

async function findUnderpopulated(): Promise<BackfillTarget[]> {
  const marketplaces = await fetchAllPaginated<MarketplaceRow>(
    "marketplaces",
    "repo,slug,description,plugin_count,categories,plugin_keywords,discovered_at,last_updated,source,stars,stars_fetched_at",
  );
  const pluginRows = await fetchAllPaginated<{ marketplace: string }>(
    "plugins",
    "marketplace",
  );

  const actualCounts: Record<string, number> = {};
  for (const p of pluginRows) {
    actualCounts[p.marketplace] = (actualCounts[p.marketplace] ?? 0) + 1;
  }

  const targets: BackfillTarget[] = [];
  for (const row of marketplaces) {
    const stored = row.plugin_count ?? 0;
    const actual = actualCounts[row.slug] ?? 0;
    if (actual < stored) {
      targets.push({ row, storedCount: stored, actualCount: actual });
    }
  }

  // Sort by stars desc so the most impactful backfills happen first.
  targets.sort((a, b) => (b.row.stars ?? 0) - (a.row.stars ?? 0));
  return targets;
}

function rowToMarketplace(row: MarketplaceRow): Marketplace {
  return {
    repo: row.repo,
    slug: row.slug,
    description: row.description,
    pluginCount: row.plugin_count,
    categories: row.categories ?? [],
    pluginKeywords: row.plugin_keywords ?? undefined,
    discoveredAt: row.discovered_at ?? undefined,
    lastUpdated: row.last_updated ?? undefined,
    source: (row.source as "manual" | "auto" | undefined) ?? undefined,
    stars: row.stars ?? undefined,
    starsFetchedAt: row.stars_fetched_at ?? undefined,
    voteCount: 0,
    commentCount: 0,
  };
}

function deriveCategories(plugins: Plugin[]): string[] {
  const set = new Set<string>();
  for (const p of plugins) {
    if (p.category) set.add(p.category.toLowerCase());
  }
  if (set.size === 0) set.add("community");
  return [...set];
}

interface BackfillResult {
  repo: string;
  slug: string;
  status: "success" | "fetch_failed" | "validation_failed";
  pluginsFound: number;
  storedCount: number;
  error?: string;
}

async function backfillOne(
  target: BackfillTarget,
  args: CliArgs,
): Promise<BackfillResult> {
  const { row } = target;
  const marketplace = rowToMarketplace(row);

  // Step 1: fetch marketplace.json with retry
  let jsonContent: string;
  try {
    jsonContent = await withRetry(
      () => fetchMarketplaceFile(row.repo, "main", args.verbose),
      { label: `fetch ${row.repo}` },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      repo: row.repo,
      slug: row.slug,
      status: "fetch_failed",
      pluginsFound: 0,
      storedCount: target.storedCount,
      error: msg,
    };
  }

  // Step 2: extract + validate plugins (returns [] on parse/schema failure)
  const plugins = extractPluginsFromMarketplace(marketplace, jsonContent);
  if (plugins.length === 0) {
    return {
      repo: row.repo,
      slug: row.slug,
      status: "validation_failed",
      pluginsFound: 0,
      storedCount: target.storedCount,
      error: "extractPluginsFromMarketplace returned empty (invalid JSON or schema)",
    };
  }

  // Step 3: derive categories + keywords
  const categories = deriveCategories(plugins);
  const pluginKeywords = aggregatePluginKeywords(plugins);

  if (args.verbose) {
    logInfo(
      `${row.repo}: ${plugins.length} plugins (stored=${target.storedCount}, actual was ${target.actualCount}) — categories=${categories.join(",")}`,
    );
  }

  // Step 4: write (unless dry-run)
  if (!args.dryRun) {
    await upsertPlugins(plugins);

    const admin = createAdminClient();
    const { error: updateErr } = await admin
      .from("marketplaces")
      .update({
        plugin_count: plugins.length,
        plugin_keywords: pluginKeywords,
        categories,
        last_updated: new Date().toISOString(),
      })
      .eq("repo", row.repo);
    if (updateErr) {
      return {
        repo: row.repo,
        slug: row.slug,
        status: "validation_failed",
        pluginsFound: plugins.length,
        storedCount: target.storedCount,
        error: `marketplace row update failed: ${updateErr.message}`,
      };
    }
  }

  return {
    repo: row.repo,
    slug: row.slug,
    status: "success",
    pluginsFound: plugins.length,
    storedCount: target.storedCount,
  };
}

async function run() {
  const args = parseArgs();
  const startTime = Date.now();

  log("━".repeat(60), colors.cyan);
  log("  Claude Marketplaces — Plugin Backfill", colors.bright);
  log("━".repeat(60), colors.cyan);

  if (args.dryRun) logWarning("DRY RUN — no data will be written");
  if (args.limit) logWarning(`Limit: ${args.limit}`);
  if (args.marketplace) logWarning(`Targeting single marketplace: ${args.marketplace}`);
  if (args.verbose) logInfo("Verbose logging enabled");
  logInfo(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(unset)"}`);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logError("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
    process.exit(1);
  }
  if (!process.env.GITHUB_TOKEN) {
    logError("Missing GITHUB_TOKEN in env");
    process.exit(1);
  }

  try {
    logStep(1, "Reconciling marketplaces vs plugins…");
    let targets = await findUnderpopulated();
    logSuccess(`Found ${targets.length} underpopulated marketplaces`);

    if (args.marketplace) {
      targets = targets.filter((t) => t.row.slug === args.marketplace);
      logInfo(`Filtered to ${targets.length} matching slug "${args.marketplace}"`);
    }
    if (args.limit) {
      targets = targets.slice(0, args.limit);
      logInfo(`Processing first ${targets.length} (sorted by stars desc)`);
    }

    if (targets.length === 0) {
      logSuccess("Nothing to backfill. Exiting.");
      return;
    }

    if (args.verbose) {
      logInfo("Top 10 targets:");
      targets.slice(0, 10).forEach((t, i) => {
        logInfo(
          `  ${i + 1}. ${t.row.repo} — stored=${t.storedCount}, actual=${t.actualCount}, stars=${t.row.stars ?? "?"}`,
        );
      });
    }

    logStep(2, `Backfilling ${targets.length} marketplaces (concurrency=3)…`);
    const settled = await batchExecute(
      targets,
      (target) => backfillOne(target, args),
      { concurrency: 3, delayMs: 500 },
    );

    const results: BackfillResult[] = [];
    settled.forEach((s, i) => {
      if (s.status === "fulfilled") {
        results.push(s.value);
      } else {
        results.push({
          repo: targets[i].row.repo,
          slug: targets[i].row.slug,
          status: "fetch_failed",
          pluginsFound: 0,
          storedCount: targets[i].storedCount,
          error: s.reason instanceof Error ? s.reason.message : String(s.reason),
        });
      }
    });

    const succeeded = results.filter((r) => r.status === "success");
    const fetchFailed = results.filter((r) => r.status === "fetch_failed");
    const validationFailed = results.filter((r) => r.status === "validation_failed");
    const totalPluginsAdded = succeeded.reduce((sum, r) => sum + r.pluginsFound, 0);

    logStep(3, "Summary");
    logSuccess(`Succeeded:           ${succeeded.length}`);
    logWarning(`Fetch failed:        ${fetchFailed.length}`);
    logWarning(`Validation failed:   ${validationFailed.length}`);
    logSuccess(`Total plugins added: ${totalPluginsAdded}`);

    if (fetchFailed.length > 0) {
      log("\nFetch failures (log + skip):", colors.yellow);
      fetchFailed.forEach((r) =>
        console.error(`  - ${r.repo}: ${r.error ?? "unknown"}`),
      );
    }
    if (validationFailed.length > 0) {
      log("\nValidation failures (log + skip):", colors.yellow);
      validationFailed.forEach((r) =>
        console.error(`  - ${r.repo}: ${r.error ?? "unknown"}`),
      );
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log("\n" + "━".repeat(60), colors.cyan);
    log(`  Done in ${duration}s${args.dryRun ? " (DRY RUN)" : ""}`, colors.bright);
    log("━".repeat(60) + "\n", colors.cyan);
  } catch (error) {
    logError(`Backfill failed: ${error instanceof Error ? error.message : String(error)}`);
    if (args.verbose && error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

run();
