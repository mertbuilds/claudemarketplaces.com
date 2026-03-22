export interface Plugin {
  id: string;
  name: string;
  description: string;
  version?: string;
  author?: {
    name: string;
    email?: string;
    url?: string;
  };
  homepage?: string;
  repository?: string;
  source: string;
  marketplace: string;
  marketplaceUrl: string;
  category: string;
  license?: string;
  keywords?: string[];
  commands?: string[];
  agents?: string[];
  hooks?: string[];
  mcpServers?: string[];
  installCommand: string;
  voteCount: number;
}

export interface Marketplace {
  repo: string;
  slug: string;
  description: string;
  pluginCount: number;
  categories: string[];
  pluginKeywords?: string[];
  discoveredAt?: string;
  lastUpdated?: string;
  source?: 'manual' | 'auto';
  stars?: number;
  starsFetchedAt?: string;
  voteCount: number;
}

export interface Author {
  name: string;
  image: string;
}

export interface Video {
  url: string; // YouTube embed URL
  title: string;
  description: string;
  author: Author;
}

export interface Article {
  url: string; // X post/article URL
  title: string;
  description: string;
  image?: string; // Preview image URL
  author: Author;
  date: string; // ISO date string
}

export interface LearnLink {
  url: string;
  title: string;
  description: string;
  source: string; // e.g. "Anthropic", "GitHub"
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  repo: string;
  repoSlug: string;
  path: string;
  license?: string;
  stars?: number;
  installs: number;
  installCommand: string;
  discoveredAt?: string;
  lastUpdated?: string;
  voteCount: number;
}


/** @deprecated - skill_repos table removed, kept for legacy script compatibility */
export interface SkillRepo {
  repo: string;
  slug: string;
  description: string;
  skillCount: number;
  stars?: number;
  starsFetchedAt?: string;
  discoveredAt?: string;
  lastUpdated?: string;
  source?: 'manual' | 'auto';
  voteCount: number;
}

export interface McpServer {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  sourceRepo: string;
  source: string;
  userName: string;
  collection: string;
  tags: string[];
  url?: string;
  stars?: number;
  lastUpdated?: string;
  voteCount: number;
}

export interface Vote {
  id: string;
  userId: string;
  itemType: 'marketplace' | 'plugin' | 'skill' | 'mcp_server';
  itemId: string;
  value: 1 | -1;
  createdAt: string;
  updatedAt: string;
}
