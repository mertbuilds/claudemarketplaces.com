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
}

export interface Marketplace {
  repo: string;
  slug: string;
  description: string;
  pluginCount: number;
  categories: string[];
  pluginKeywords?: string[]; // Aggregated keywords from all plugins for searchability
  discoveredAt?: string;
  lastUpdated?: string;
  source?: 'manual' | 'auto';
  stars?: number;
  starsFetchedAt?: string;
}
