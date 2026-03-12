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

export interface Skill {
  id: string;
  name: string;
  description: string;
  repo: string;
  repoSlug: string;
  path: string;
  license?: string;
  stars?: number;
  installCommand: string;
  discoveredAt?: string;
  lastUpdated?: string;
  voteCount: number;
}

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

export interface Vote {
  id: string;
  userId: string;
  itemType: 'marketplace' | 'plugin' | 'skill' | 'skill_repo';
  itemId: string;
  value: 1 | -1;
  createdAt: string;
  updatedAt: string;
}
