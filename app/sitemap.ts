import { MetadataRoute } from "next";
import { getAllMarketplaces } from "@/lib/data/marketplaces";
import { getAllSkills } from "@/lib/data/skills";
import { getAllMcpServers } from "@/lib/data/mcp-servers";
import { SKILL_CATEGORIES } from "@/lib/data/skill-categories";

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

  // Only include skill/mcp detail pages that have original signal (votes or
  // comments) on this site. The rest are noindexed in their generateMetadata
  // because the body is mirrored from upstream. Listing them here would send
  // Google contradictory signals (sitemap says "index" while meta says "don't").
  const skillPages: MetadataRoute.Sitemap = skills
    .filter((s) => s.voteCount + s.commentCount > 0)
    .map((s) => ({
      url: `${BASE_URL}/skills/${s.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(s.lastUpdated && { lastModified: new Date(s.lastUpdated) }),
    }));

  const mcpPages: MetadataRoute.Sitemap = mcpServers
    .filter((s) => s.voteCount + s.commentCount > 0)
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

  return [
    ...staticPages,
    ...categoryPages,
    ...pluginPages,
    ...skillPages,
    ...mcpPages,
  ];
}
