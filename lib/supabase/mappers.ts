import { Marketplace, McpServer, Plugin, Skill } from "@/lib/types";

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
  comment_count: number;
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
  summary: string | null;
  repo: string;
  repo_slug: string;
  path: string;
  license: string | null;
  stars: number | null;
  installs: number;
  install_command: string;
  discovered_at: string | null;
  last_updated: string | null;
  vote_count: number;
  comment_count: number;
  created_at: string;
}

export interface McpServerRow {
  slug: string;
  name: string;
  display_name: string;
  description: string;
  source_repo: string;
  source: string;
  user_name: string;
  collection: string;
  tags: string[];
  url: string | null;
  stars: number | null;
  last_updated: string | null;
  summary: string | null;
  vote_count: number;
  comment_count: number;
  created_at: string;
}

export function mapMcpServerRow(row: McpServerRow): McpServer {
  return {
    slug: row.slug,
    name: row.name,
    displayName: row.display_name,
    description: row.description,
    sourceRepo: row.source_repo,
    source: row.source,
    userName: row.user_name,
    collection: row.collection,
    tags: row.tags,
    url: row.url || undefined,
    stars: row.stars || undefined,
    lastUpdated: row.last_updated || undefined,
    summary: row.summary || undefined,
    voteCount: row.vote_count,
    commentCount: row.comment_count,
    createdAt: row.created_at || undefined,
  };
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
    commentCount: row.comment_count,
    createdAt: row.created_at || undefined,
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
    summary: row.summary || undefined,
    repo: row.repo,
    repoSlug: row.repo_slug,
    path: row.path,
    license: row.license || undefined,
    stars: row.stars || undefined,
    installs: row.installs,
    installCommand: row.install_command,
    discoveredAt: row.discovered_at || undefined,
    lastUpdated: row.last_updated || undefined,
    voteCount: row.vote_count,
    commentCount: row.comment_count,
    createdAt: row.created_at || undefined,
  };
}

