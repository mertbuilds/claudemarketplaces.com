#!/usr/bin/env bun
/**
 * Seed local Supabase from marketplaces.json, skills-only.json, and mcp-only.json
 *
 * Usage: bun run scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";

// Load .env.local only if env vars aren't already set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const envFile = Bun.file(`${import.meta.dir}/../.env.local`);
  if (await envFile.exists()) {
    const text = await envFile.text();
    for (const line of text.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match && !process.env[match[1].trim()]) {
        process.env[match[1].trim()] = match[2].trim();
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BATCH_SIZE = 500;
const dataDir = `${import.meta.dir}/../lib/data`;

async function main() {
  const t0 = Date.now();
  console.log("=== Seed Supabase ===\n");

  // 1. Upsert mode — no deletes, vote_count preserved
  console.log("[1/6] Upserting data (vote counts preserved)...");

  // 2. Seed marketplaces
  console.log("\n[2/6] Reading marketplace data...");
  const allMarketplaces: any[] = await Bun.file(`${dataDir}/marketplaces.json`).json();
  console.log(`  ${allMarketplaces.length} marketplaces found`);

  console.log("[3/6] Upserting marketplaces...");
  const marketplaceRows = allMarketplaces.map((m) => ({
    repo: m.repo,
    slug: m.slug,
    description: m.description ?? "",
    plugin_count: m.pluginCount ?? 0,
    categories: m.categories ?? [],
    plugin_keywords: m.pluginKeywords ?? [],
    discovered_at: m.discoveredAt ?? null,
    last_updated: m.lastUpdated ?? null,
    source: m.source ?? null,
    stars: m.stars ?? null,
    stars_fetched_at: m.starsFetchedAt ?? null,
  }));

  for (let i = 0; i < marketplaceRows.length; i += BATCH_SIZE) {
    const batch = marketplaceRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("marketplaces")
      .upsert(batch, { onConflict: "repo" });
    if (error) throw new Error(`Marketplaces upsert: ${error.message}`);
  }
  console.log(`  ${marketplaceRows.length} marketplaces upserted`);

  // 3. Seed plugins (all plugins now have valid marketplace refs)
  console.log("\n[4/6] Reading plugins.json...");
  const pluginsRaw: any[] = await Bun.file(`${dataDir}/plugins.json`).json();
  const pluginRows = pluginsRaw.map((p) => ({
      id: p.id ?? "",
      name: p.name ?? "",
      description: p.description ?? "",
      version: p.version ?? null,
      author_name: p.author?.name ?? null,
      author_email: p.author?.email ?? null,
      author_url: p.author?.url ?? null,
      homepage: p.homepage ?? null,
      repository: p.repository ?? null,
      source: p.source ?? "",
      marketplace: p.marketplace,
      marketplace_url: p.marketplaceUrl ?? "",
      category: p.category ?? "",
      license: p.license ?? null,
      keywords: p.keywords ?? [],
      commands: p.commands ?? [],
      agents: p.agents ?? [],
      hooks: p.hooks ?? [],
      mcp_servers: p.mcpServers ?? [],
      install_command: p.installCommand ?? "",
    }));
  console.log(`  ${pluginRows.length} plugins found`);

  let pluginsInserted = 0;
  let pluginsErrors = 0;
  for (let i = 0; i < pluginRows.length; i += BATCH_SIZE) {
    const batch = pluginRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("plugins")
      .upsert(batch, { onConflict: "id" });
    if (error) {
      console.error(`  Batch ${i}-${i + batch.length} failed: ${error.message}`);
      pluginsErrors++;
    } else {
      pluginsInserted += batch.length;
    }
  }
  console.log(`  ${pluginsInserted} plugins upserted${pluginsErrors ? `, ${pluginsErrors} batches failed` : ""}`);

  // 4. Seed skills (prefer crawled data, fallback to skills-only.json)
  const crawledPath = `${dataDir}/skills-crawled.json`;
  const fallbackPath = `${dataDir}/skills-only.json`;
  const hasCrawled = await Bun.file(crawledPath).exists();
  const skillsSource = hasCrawled ? crawledPath : fallbackPath;
  console.log(`\n[5/6] Reading ${hasCrawled ? "skills-crawled.json" : "skills-only.json"}...`);

  const skillsFile: { crawledAt: string; total: number; skills: any[] } =
    await Bun.file(skillsSource).json();
  const skillsRaw = skillsFile.skills;

  // If using fallback, also try to load crawled data for installs/stars merge
  let crawledMap: Map<string, { installs: number; stars: number }> | null = null;
  if (!hasCrawled) {
    // no merge needed
  } else {
    // crawled data might lack descriptions — load old data for descriptions
    const hasOld = await Bun.file(fallbackPath).exists();
    if (hasOld) {
      const oldFile: { skills: any[] } = await Bun.file(fallbackPath).json();
      crawledMap = new Map();
      for (const s of oldFile.skills) {
        if (s.slug && s.description) {
          crawledMap.set(s.slug, { installs: 0, stars: 0 });
        }
      }
      // Merge descriptions from old data into crawled skills
      const descMap = new Map(oldFile.skills.map((s: any) => [s.slug, s.description ?? ""]));
      for (const s of skillsRaw) {
        if (!s.description && descMap.has(s.slug)) {
          s.description = descMap.get(s.slug);
        }
      }
    }
  }

  console.log(`  ${skillsRaw.length} skills found`);

  const skillRows = skillsRaw.map((s: any) => {
    const slug: string = s.slug ?? "";
    const sourceRepo: string = s.sourceRepo ?? "";
    const repoSlug = sourceRepo.replace(/\//g, "-");
    const path = sourceRepo ? slug.slice(sourceRepo.length + 1) : slug;

    return {
      id: slug,
      name: s.name ?? "",
      description: s.description ?? "",
      repo: sourceRepo,
      repo_slug: repoSlug,
      path,
      license: null,
      stars: s.stars ?? null,
      installs: s.installs ?? 0,
      install_command: `npx skills add https://github.com/${sourceRepo} --skill ${s.name ?? ""}`,
      discovered_at: null,
      last_updated: s.lastmod ?? null,
    };
  });

  // Batch insert skills in chunks
  let inserted = 0;
  let errors = 0;
  for (let i = 0; i < skillRows.length; i += BATCH_SIZE) {
    const batch = skillRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("skills")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`  Batch ${i}-${i + batch.length} failed: ${error.message}`);
      errors++;
    } else {
      inserted += batch.length;
    }

    // Log every 5K
    if ((i + BATCH_SIZE) % 5000 === 0 || i + BATCH_SIZE >= skillRows.length) {
      console.log(`  Progress: ${Math.min(i + BATCH_SIZE, skillRows.length)}/${skillRows.length}`);
    }
  }

  console.log(`  ${inserted} skills upserted${errors ? `, ${errors} batches failed` : ""}`);

  // 5. Seed MCP servers (prefer crawled data, fallback to mcp-only.json)
  const mcpCrawledPath = `${dataDir}/mcp-crawled.json`;
  const mcpFallbackPath = `${dataDir}/mcp-only.json`;
  const hasMcpCrawled = await Bun.file(mcpCrawledPath).exists();
  const mcpSource = hasMcpCrawled ? mcpCrawledPath : mcpFallbackPath;
  console.log(`\n[6/6] Reading ${hasMcpCrawled ? "mcp-crawled.json" : "mcp-only.json"}...`);
  const mcpFile: { crawledAt: string; total: number; servers: any[] } =
    await Bun.file(mcpSource).json();
  const mcpRaw = mcpFile.servers;
  console.log(`  ${mcpRaw.length} MCP servers found`);

  const mcpRows = mcpRaw.map((s: any) => ({
    slug: s.slug ?? "",
    name: s.name ?? "",
    display_name: s.displayName ?? "",
    description: s.description ?? "",
    source_repo: s.sourceRepo ?? "",
    source: s.source ?? "",
    user_name: s.user ?? "",
    collection: s.collection ?? "",
    tags: s.tags ?? [],
    url: s.url ?? null,
    stars: s.stars ?? null,
    last_updated: s.lastmod ?? null,
  }));

  let mcpInserted = 0;
  let mcpErrors = 0;
  for (let i = 0; i < mcpRows.length; i += BATCH_SIZE) {
    const batch = mcpRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("mcp_servers")
      .upsert(batch, { onConflict: "slug" });

    if (error) {
      console.error(`  Batch ${i}-${i + batch.length} failed: ${error.message}`);
      mcpErrors++;
    } else {
      mcpInserted += batch.length;
    }

    if ((i + BATCH_SIZE) % 5000 === 0 || i + BATCH_SIZE >= mcpRows.length) {
      console.log(`  Progress: ${Math.min(i + BATCH_SIZE, mcpRows.length)}/${mcpRows.length}`);
    }
  }

  console.log(`  ${mcpInserted} MCP servers upserted${mcpErrors ? `, ${mcpErrors} batches failed` : ""}`);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
