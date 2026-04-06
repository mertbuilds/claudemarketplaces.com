#!/usr/bin/env bun
/**
 * Seed Supabase tables from local JSON data files
 *
 * Usage:
 *   bun run scripts/seed-supabase.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { createAdminClient } from "../lib/supabase/admin";
import type { Plugin, Marketplace, Skill, SkillRepo } from "../lib/types";

// ANSI color codes
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
function logStep(step: number, total: number, msg: string) {
  log(`\n${c.bright}[${step}/${total}]${c.reset} ${c.cyan}${msg}${c.reset}`);
}
function logOk(msg: string) { log(`  OK ${msg}`, c.green); }
function logErr(msg: string) { log(`  ERR ${msg}`, c.red); }
function logInfo(msg: string) { log(`  ${msg}`, c.gray); }

function readJson<T>(filename: string): T {
  const filepath = join(process.cwd(), "lib", "data", filename);
  return JSON.parse(readFileSync(filepath, "utf-8")) as T;
}

async function main() {
  const startTime = Date.now();

  log("".padEnd(60, "="), c.cyan);
  log("  Seed Supabase from local JSON data", c.bright);
  log("".padEnd(60, "="), c.cyan);

  // Validate env
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logErr("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createAdminClient();

  // Step 1: Read JSON files
  logStep(1, 4, "Reading local JSON data...");
  const marketplaces = readJson<Marketplace[]>("marketplaces.json");
  const plugins = readJson<Plugin[]>("plugins.json");
  const skills = readJson<Skill[]>("skills.json");
  const skillRepos = readJson<SkillRepo[]>("skill-repos.json");
  logInfo(`${marketplaces.length} marketplaces, ${plugins.length} plugins, ${skills.length} skills, ${skillRepos.length} skill repos`);

  // Step 2: Delete stale data, then upsert marketplaces (plugins FK dependency)
  logStep(2, 5, "Cleaning stale data & upserting marketplaces...");

  // Get existing repos/slugs from Supabase
  const { data: existingMarketplaces } = await supabase
    .from("marketplaces")
    .select("repo, slug");
  const existingRepos = new Set((existingMarketplaces || []).map((m) => m.repo));
  const existingSlugs = new Set((existingMarketplaces || []).map((m) => m.slug));

  const localRepos = new Set(marketplaces.map((m) => m.repo));
  const localSlugs = new Set(marketplaces.map((m) => m.slug));
  const localPluginIds = new Set(plugins.map((p) => p.id));

  // Delete plugins that reference marketplaces we're about to remove
  const staleSlugs = [...existingSlugs].filter((s) => !localSlugs.has(s));
  if (staleSlugs.length > 0) {
    // Delete in batches to avoid query size limits
    for (let i = 0; i < staleSlugs.length; i += 100) {
      const batch = staleSlugs.slice(i, i + 100);
      const { error: dpErr } = await supabase
        .from("plugins")
        .delete()
        .in("marketplace", batch);
      if (dpErr) logErr(`Delete plugins batch failed: ${dpErr.message}`);
    }
    logInfo(`Deleted plugins for ${staleSlugs.length} stale marketplace slugs`);
  }

  // Also delete plugins not in local JSON
  const { data: existingPlugins } = await supabase
    .from("plugins")
    .select("id");
  const stalePluginIds = (existingPlugins || [])
    .map((p) => p.id)
    .filter((id) => !localPluginIds.has(id));
  if (stalePluginIds.length > 0) {
    for (let i = 0; i < stalePluginIds.length; i += 100) {
      const batch = stalePluginIds.slice(i, i + 100);
      const { error: dpErr } = await supabase
        .from("plugins")
        .delete()
        .in("id", batch);
      if (dpErr) logErr(`Delete stale plugins failed: ${dpErr.message}`);
    }
    logInfo(`Deleted ${stalePluginIds.length} stale plugins`);
  }

  // Delete stale marketplaces
  const staleRepos = [...existingRepos].filter((r) => !localRepos.has(r));
  if (staleRepos.length > 0) {
    for (let i = 0; i < staleRepos.length; i += 100) {
      const batch = staleRepos.slice(i, i + 100);
      const { error: dmErr } = await supabase
        .from("marketplaces")
        .delete()
        .in("repo", batch);
      if (dmErr) logErr(`Delete marketplaces batch failed: ${dmErr.message}`);
    }
    logInfo(`Deleted ${staleRepos.length} stale marketplaces`);
  }

  // Upsert marketplaces
  const marketplaceRows = marketplaces.map((m) => ({
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

  // Batch upsert to avoid payload size limits
  for (let i = 0; i < marketplaceRows.length; i += 500) {
    const batch = marketplaceRows.slice(i, i + 500);
    const { error: mErr } = await supabase
      .from("marketplaces")
      .upsert(batch, { onConflict: "repo" });
    if (mErr) {
      logErr(`Marketplaces batch ${i} failed: ${mErr.message}`);
      process.exit(1);
    }
  }
  logOk(`${marketplaceRows.length} marketplaces upserted`);

  // Step 3: Upsert plugins, skills, skill_repos
  logStep(3, 5, "Upserting plugins, skills, skill_repos...");

  const pluginRows = plugins.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    version: p.version ?? null,
    author_name: p.author?.name ?? null,
    author_email: p.author?.email ?? null,
    author_url: p.author?.url ?? null,
    homepage: p.homepage ?? null,
    repository: p.repository ?? null,
    source: p.source,
    marketplace: p.marketplace,
    marketplace_url: p.marketplaceUrl,
    category: p.category ?? "",
    license: p.license ?? null,
    keywords: p.keywords ?? [],
    commands: p.commands ?? [],
    agents: p.agents ?? [],
    hooks: p.hooks ?? [],
    mcp_servers: p.mcpServers ?? [],
    install_command: p.installCommand,
  }));

  const skillRows = skills.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description ?? "",
    repo: s.repo,
    repo_slug: s.repoSlug,
    path: s.path,
    license: s.license ?? null,
    stars: s.stars ?? null,
    install_command: s.installCommand,
    discovered_at: s.discoveredAt ?? null,
    last_updated: s.lastUpdated ?? null,
  }));

  const skillRepoRows = skillRepos.map((sr) => ({
    repo: sr.repo,
    slug: sr.slug,
    description: sr.description ?? "",
    skill_count: sr.skillCount ?? 0,
    stars: sr.stars ?? null,
    stars_fetched_at: sr.starsFetchedAt ?? null,
    discovered_at: sr.discoveredAt ?? null,
    last_updated: sr.lastUpdated ?? null,
    source: sr.source ?? null,
  }));

  // Batch upsert plugins
  for (let i = 0; i < pluginRows.length; i += 500) {
    const batch = pluginRows.slice(i, i + 500);
    const { error } = await supabase
      .from("plugins")
      .upsert(batch, { onConflict: "id" });
    if (error) {
      logErr(`Plugins batch ${i} failed: ${error.message}`);
      process.exit(1);
    }
  }
  logOk(`${pluginRows.length} plugins upserted`);

  const skillResult = await supabase
    .from("skills")
    .upsert(skillRows, { onConflict: "id" });

  if (skillResult.error) {
    logErr(`Skills failed: ${skillResult.error.message}`);
    process.exit(1);
  }
  logOk(`${skillRows.length} skills upserted`);

  // skill_repos table was dropped in prod — skip if not present
  const skillRepoResult = await supabase
    .from("skill_repos")
    .upsert(skillRepoRows, { onConflict: "repo" });

  if (skillRepoResult.error) {
    if (skillRepoResult.error.message.includes("schema cache")) {
      logInfo(`Skipping skill_repos (table not in prod)`);
    } else {
      logErr(`Skill repos failed: ${skillRepoResult.error.message}`);
      process.exit(1);
    }
  } else {
    logOk(`${skillRepoRows.length} skill repos upserted`);
  }

  // Done
  logStep(5, 5, "Complete!");
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log(`\n  Seeded in ${elapsed}s`, c.green);
}

main().catch((err) => {
  logErr(err.message ?? err);
  process.exit(1);
});
