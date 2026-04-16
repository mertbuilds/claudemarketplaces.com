import { MetadataRoute } from "next";
import { getAllMarketplaces } from "@/lib/data/marketplaces";
import { getAllSkills } from "@/lib/data/skills";
import { getAllMcpServers } from "@/lib/data/mcp-servers";
import { SKILL_CATEGORIES } from "@/lib/data/skill-categories";
import { MARKETPLACE_CATEGORIES } from "@/lib/data/marketplace-categories";
import { MCP_CATEGORIES } from "@/lib/data/mcp-categories";

export const revalidate = 86400; // 1 day ISR

const BASE_URL = "https://claudemarketplaces.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [marketplaces, skills, mcpServers] = await Promise.all([
    getAllMarketplaces(),
    getAllSkills(),
    getAllMcpServers(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1.0, lastModified: new Date() },
    { url: `${BASE_URL}/skills`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${BASE_URL}/mcp`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${BASE_URL}/marketplaces`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${BASE_URL}/learn`, changeFrequency: "weekly", priority: 0.8, lastModified: new Date() },
    { url: `${BASE_URL}/about`, changeFrequency: "weekly", priority: 0.5, lastModified: new Date() },
    { url: `${BASE_URL}/feedback`, changeFrequency: "weekly", priority: 0.5, lastModified: new Date() },
    { url: `${BASE_URL}/advertise`, changeFrequency: "weekly", priority: 0.5, lastModified: new Date() },
    { url: `${BASE_URL}/privacy`, changeFrequency: "weekly", priority: 0.5, lastModified: new Date() },
  ];

  const pluginPages: MetadataRoute.Sitemap = marketplaces.map((m) => ({
    url: `${BASE_URL}/plugins/${m.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    ...(m.lastUpdated && { lastModified: new Date(m.lastUpdated) }),
  }));

  // Only include skill/mcp detail pages that have original signal on this site.
  // Original signal = editorial summary, votes, or comments. The rest are
  // noindexed in generateMetadata. Listing them here would send Google
  // contradictory signals (sitemap says "index" while meta says "don't").
  const skillPages: MetadataRoute.Sitemap = skills
    .filter((s) => !!s.summary || s.voteCount + s.commentCount > 0)
    .map((s) => ({
      url: `${BASE_URL}/skills/${s.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(s.lastUpdated && { lastModified: new Date(s.lastUpdated) }),
    }));

  const mcpPages: MetadataRoute.Sitemap = mcpServers
    .filter((s) => !!s.summary || s.voteCount + s.commentCount > 0)
    .map((s) => ({
      url: `${BASE_URL}/mcp/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(s.lastUpdated && { lastModified: new Date(s.lastUpdated) }),
    }));

  const categoryPages: MetadataRoute.Sitemap = SKILL_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/skills/category/${cat.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    lastModified: new Date(),
  }));

  const marketplaceCategoryPages: MetadataRoute.Sitemap = MARKETPLACE_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/marketplaces/category/${cat.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    lastModified: new Date(),
  }));

  const mcpCategoryPages: MetadataRoute.Sitemap = MCP_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/mcp/category/${cat.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    lastModified: new Date(),
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...marketplaceCategoryPages,
    ...mcpCategoryPages,
    ...pluginPages,
    ...skillPages,
    ...mcpPages,
  ];
}
