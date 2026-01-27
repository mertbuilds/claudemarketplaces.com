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
  id: string;              // "owner-repo/skill-name"
  name: string;            // from SKILL.md frontmatter
  description: string;     // from SKILL.md frontmatter
  repo: string;            // "owner/repo"
  repoSlug: string;        // "owner-repo"
  path: string;            // "skills/pdf" or ".claude/skills/pdf"
  license?: string;
  stars?: number;
  installCommand: string;  // "claude skill add owner/repo:skill-name"
  discoveredAt?: string;
  lastUpdated?: string;
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
}
