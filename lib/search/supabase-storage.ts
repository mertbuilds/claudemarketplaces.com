import { createAdminClient } from "@/lib/supabase/admin";
import { Marketplace, Plugin, Skill, SkillRepo } from "@/lib/types";
import { repoToSlug } from "@/lib/utils/slug";

// --- Upsert functions ---

export async function upsertMarketplaces(marketplaces: Marketplace[]) {
  const admin = createAdminClient();
  const rows = marketplaces.map((m) => ({
    repo: m.repo,
    slug: repoToSlug(m.repo),
    description: m.description,
    plugin_count: m.pluginCount,
    categories: m.categories,
    plugin_keywords: m.pluginKeywords ?? null,
    discovered_at: m.discoveredAt ?? new Date().toISOString(),
    last_updated: m.lastUpdated ?? new Date().toISOString(),
    source: m.source ?? "auto",
    stars: m.stars ?? null,
    stars_fetched_at: m.starsFetchedAt ?? null,
    vote_count: m.voteCount ?? 0,
  }));

  const { error } = await admin
    .from("marketplaces")
    .upsert(rows, { onConflict: "repo" });

  if (error) throw new Error(`upsertMarketplaces failed: ${error.message}`);
}

export async function upsertPlugins(plugins: Plugin[]) {
  const admin = createAdminClient();
  const rows = plugins.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    version: p.version ?? null,
    author_name: p.author?.name ?? null,
    author_email: p.author?.email ?? null,
    author_url: p.author?.url ?? null,
    homepage: p.homepage ?? null,
    repository: p.repository ?? null,
    source: p.source,
    marketplace: p.marketplace,
    marketplace_url: p.marketplaceUrl,
    category: p.category,
    license: p.license ?? null,
    keywords: p.keywords ?? [],
    commands: p.commands ?? [],
    agents: p.agents ?? [],
    hooks: p.hooks ?? [],
    mcp_servers: p.mcpServers ?? [],
    install_command: p.installCommand,
    vote_count: p.voteCount ?? 0,
  }));

  // Supabase has a max payload size; batch in chunks of 500
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const { error } = await admin
      .from("plugins")
      .upsert(chunk, { onConflict: "id" });

    if (error) throw new Error(`upsertPlugins failed: ${error.message}`);
  }
}

export async function upsertSkills(skills: Skill[]) {
  const admin = createAdminClient();
  const rows = skills.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    repo: s.repo,
    repo_slug: repoToSlug(s.repo),
    path: s.path,
    license: s.license ?? null,
    stars: s.stars ?? null,
    install_command: s.installCommand,
    discovered_at: s.discoveredAt ?? new Date().toISOString(),
    last_updated: s.lastUpdated ?? new Date().toISOString(),
    vote_count: s.voteCount ?? 0,
  }));

  const { error } = await admin
    .from("skills")
    .upsert(rows, { onConflict: "id" });

  if (error) throw new Error(`upsertSkills failed: ${error.message}`);
}

export async function upsertSkillRepos(repos: SkillRepo[]) {
  const admin = createAdminClient();
  const rows = repos.map((r) => ({
    repo: r.repo,
    slug: repoToSlug(r.repo),
    description: r.description,
    skill_count: r.skillCount,
    stars: r.stars ?? null,
    stars_fetched_at: r.starsFetchedAt ?? null,
    discovered_at: r.discoveredAt ?? new Date().toISOString(),
    last_updated: r.lastUpdated ?? new Date().toISOString(),
    source: r.source ?? "auto",
  }));

  const { error } = await admin
    .from("skill_repos")
    .upsert(rows, { onConflict: "repo" });

  if (error) throw new Error(`upsertSkillRepos failed: ${error.message}`);
}

// --- Delete functions ---

export async function deleteMarketplaces(repos: string[]) {
  if (repos.length === 0) return;
  const admin = createAdminClient();
  const { error } = await admin
    .from("marketplaces")
    .delete()
    .in("repo", repos);

  if (error) throw new Error(`deleteMarketplaces failed: ${error.message}`);
}

export async function deletePlugins(ids: string[]) {
  if (ids.length === 0) return;
  const admin = createAdminClient();
  const { error } = await admin.from("plugins").delete().in("id", ids);

  if (error) throw new Error(`deletePlugins failed: ${error.message}`);
}

export async function deleteSkills(ids: string[]) {
  if (ids.length === 0) return;
  const admin = createAdminClient();
  const { error } = await admin.from("skills").delete().in("id", ids);

  if (error) throw new Error(`deleteSkills failed: ${error.message}`);
}

export async function deleteSkillRepos(repos: string[]) {
  if (repos.length === 0) return;
  const admin = createAdminClient();
  const { error } = await admin
    .from("skill_repos")
    .delete()
    .in("repo", repos);

  if (error) throw new Error(`deleteSkillRepos failed: ${error.message}`);
}

// --- Merge functions ---

export async function mergeMarketplaces(
  discovered: Marketplace[],
  allDiscoveredRepos: Set<string>
): Promise<{ added: number; updated: number; removed: number; total: number }> {
  const admin = createAdminClient();

  // Get existing repos
  const { data: existing } = await admin
    .from("marketplaces")
    .select("repo");
  const existingSet = new Set((existing || []).map((r) => r.repo));

  // Count
  let added = 0;
  let updated = 0;
  for (const m of discovered) {
    if (existingSet.has(m.repo)) {
      updated++;
    } else {
      added++;
    }
  }

  // Upsert all discovered
  if (discovered.length > 0) {
    await upsertMarketplaces(discovered);
  }

  // Determine removals: repos we searched for but didn't find valid
  const discoveredRepoSet = new Set(discovered.map((m) => m.repo));
  const toRemove = [...allDiscoveredRepos].filter(
    (repo) => !discoveredRepoSet.has(repo) && existingSet.has(repo)
  );
  const removed = toRemove.length;

  if (toRemove.length > 0) {
    await deleteMarketplaces(toRemove);
  }

  const total = existingSet.size + added - removed;

  return { added, updated, removed, total };
}

export async function mergeSkills(
  discovered: Skill[],
  allDiscoveredIds: Set<string>
): Promise<{ added: number; updated: number; removed: number; total: number }> {
  const admin = createAdminClient();

  const { data: existing } = await admin.from("skills").select("id");
  const existingSet = new Set((existing || []).map((r) => r.id));

  let added = 0;
  let updated = 0;
  for (const s of discovered) {
    if (existingSet.has(s.id)) {
      updated++;
    } else {
      added++;
    }
  }

  if (discovered.length > 0) {
    await upsertSkills(discovered);
  }

  const discoveredIdSet = new Set(discovered.map((s) => s.id));
  const toRemove = [...allDiscoveredIds].filter(
    (id) => !discoveredIdSet.has(id) && existingSet.has(id)
  );
  const removed = toRemove.length;

  if (toRemove.length > 0) {
    await deleteSkills(toRemove);
  }

  const total = existingSet.size + added - removed;

  return { added, updated, removed, total };
}

export async function mergeSkillRepos(
  discovered: SkillRepo[],
  allDiscoveredRepos: Set<string>
): Promise<{ added: number; updated: number; removed: number; total: number }> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("skill_repos")
    .select("repo");
  const existingSet = new Set((existing || []).map((r) => r.repo));

  let added = 0;
  let updated = 0;
  for (const r of discovered) {
    if (existingSet.has(r.repo)) {
      updated++;
    } else {
      added++;
    }
  }

  if (discovered.length > 0) {
    await upsertSkillRepos(discovered);
  }

  const discoveredRepoSet = new Set(discovered.map((r) => r.repo));
  const toRemove = [...allDiscoveredRepos].filter(
    (repo) => !discoveredRepoSet.has(repo) && existingSet.has(repo)
  );
  const removed = toRemove.length;

  if (toRemove.length > 0) {
    await deleteSkillRepos(toRemove);
  }

  const total = existingSet.size + added - removed;

  return { added, updated, removed, total };
}
