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

  // Step 2: Upsert marketplaces first (plugins FK dependency)
  logStep(2, 4, "Upserting marketplaces...");
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

  const { error: mErr } = await supabase
    .from("marketplaces")
    .upsert(marketplaceRows, { onConflict: "repo" });

  if (mErr) {
    logErr(`Marketplaces failed: ${mErr.message}`);
    process.exit(1);
  }
  logOk(`${marketplaceRows.length} marketplaces upserted`);

  // Step 3: Upsert plugins, skills, skill_repos in parallel
  logStep(3, 4, "Upserting plugins, skills, skill_repos in parallel...");

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

  const [pluginResult, skillResult, skillRepoResult] = await Promise.all([
    supabase.from("plugins").upsert(pluginRows, { onConflict: "id" }),
    supabase.from("skills").upsert(skillRows, { onConflict: "id" }),
    supabase.from("skill_repos").upsert(skillRepoRows, { onConflict: "repo" }),
  ]);

  let hasError = false;

  if (pluginResult.error) {
    logErr(`Plugins failed: ${pluginResult.error.message}`);
    hasError = true;
  } else {
    logOk(`${pluginRows.length} plugins upserted`);
  }

  if (skillResult.error) {
    logErr(`Skills failed: ${skillResult.error.message}`);
    hasError = true;
  } else {
    logOk(`${skillRows.length} skills upserted`);
  }

  if (skillRepoResult.error) {
    logErr(`Skill repos failed: ${skillRepoResult.error.message}`);
    hasError = true;
  } else {
    logOk(`${skillRepoRows.length} skill repos upserted`);
  }

  if (hasError) {
    process.exit(1);
  }

  // Done
  logStep(4, 4, "Complete!");
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log(`\n  Seeded in ${elapsed}s`, c.green);
}

main().catch((err) => {
  logErr(err.message ?? err);
  process.exit(1);
});
