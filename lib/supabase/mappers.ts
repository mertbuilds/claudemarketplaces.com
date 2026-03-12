import { Marketplace, Plugin, Skill, SkillRepo } from "@/lib/types";

export interface MarketplaceRow {
  repo: string;
  slug: string;
  description: string;
  plugin_count: number;
  categories: string[];
  plugin_keywords: string[];
  discovered_at: string | null;
  last_updated: string | null;
  source: string | null;
  stars: number | null;
  stars_fetched_at: string | null;
  vote_count: number;
  created_at: string;
}

export interface PluginRow {
  id: string;
  name: string;
  description: string;
  version: string | null;
  author_name: string | null;
  author_email: string | null;
  author_url: string | null;
  homepage: string | null;
  repository: string | null;
  source: string;
  marketplace: string;
  marketplace_url: string;
  category: string;
  license: string | null;
  keywords: string[];
  commands: string[];
  agents: string[];
  hooks: string[];
  mcp_servers: string[];
  install_command: string;
  vote_count: number;
  created_at: string;
}

export interface SkillRow {
  id: string;
  name: string;
  description: string;
  repo: string;
  repo_slug: string;
  path: string;
  license: string | null;
  stars: number | null;
  install_command: string;
  discovered_at: string | null;
  last_updated: string | null;
  vote_count: number;
  created_at: string;
}

export interface SkillRepoRow {
  repo: string;
  slug: string;
  description: string;
  skill_count: number;
  stars: number | null;
  stars_fetched_at: string | null;
  discovered_at: string | null;
  last_updated: string | null;
  source: string | null;
  vote_count: number;
  created_at: string;
}

export function mapMarketplaceRow(row: MarketplaceRow): Marketplace {
  return {
    repo: row.repo,
    slug: row.slug,
    description: row.description,
    pluginCount: row.plugin_count,
    categories: row.categories,
    pluginKeywords: row.plugin_keywords || undefined,
    discoveredAt: row.discovered_at || undefined,
    lastUpdated: row.last_updated || undefined,
    source: (row.source as "manual" | "auto") || undefined,
    stars: row.stars || undefined,
    starsFetchedAt: row.stars_fetched_at || undefined,
    voteCount: row.vote_count,
  };
}

export function mapPluginRow(row: PluginRow): Plugin {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    version: row.version || undefined,
    author: row.author_name
      ? {
          name: row.author_name,
          email: row.author_email || undefined,
          url: row.author_url || undefined,
        }
      : undefined,
    homepage: row.homepage || undefined,
    repository: row.repository || undefined,
    source: row.source,
    marketplace: row.marketplace,
    marketplaceUrl: row.marketplace_url,
    category: row.category,
    license: row.license || undefined,
    keywords: row.keywords || undefined,
    commands: row.commands || undefined,
    agents: row.agents || undefined,
    hooks: row.hooks || undefined,
    mcpServers: row.mcp_servers || undefined,
    installCommand: row.install_command,
    voteCount: row.vote_count,
  };
}

export function mapSkillRow(row: SkillRow): Skill {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    repo: row.repo,
    repoSlug: row.repo_slug,
    path: row.path,
    license: row.license || undefined,
    stars: row.stars || undefined,
    installCommand: row.install_command,
    discoveredAt: row.discovered_at || undefined,
    lastUpdated: row.last_updated || undefined,
    voteCount: row.vote_count,
  };
}

export function mapSkillRepoRow(row: SkillRepoRow): SkillRepo {
  return {
    repo: row.repo,
    slug: row.slug,
    description: row.description,
    skillCount: row.skill_count,
    stars: row.stars || undefined,
    starsFetchedAt: row.stars_fetched_at || undefined,
    discoveredAt: row.discovered_at || undefined,
    lastUpdated: row.last_updated || undefined,
    source: (row.source as "manual" | "auto") || undefined,
    voteCount: row.vote_count,
  };
}
