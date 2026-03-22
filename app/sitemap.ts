import { MetadataRoute } from "next";
import { getAllMarketplaces } from "@/lib/data/marketplaces";
import { getAllSkillRepos, getAllSkills } from "@/lib/data/skills";

const BASE_URL = "https://claudemarketplaces.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [marketplaces, skillRepos, skills] = await Promise.all([
    getAllMarketplaces(),
    getAllSkillRepos(),
    getAllSkills(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/skills`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/mcp`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/learn`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/feedback`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/advertise`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const pluginPages: MetadataRoute.Sitemap = marketplaces.map((m) => ({
    url: `${BASE_URL}/plugins/${m.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    ...(m.lastUpdated && { lastModified: new Date(m.lastUpdated) }),
  }));

  const skillRepoPages: MetadataRoute.Sitemap = skillRepos.map((r) => ({
    url: `${BASE_URL}/skills/${r.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    ...(r.lastUpdated && { lastModified: new Date(r.lastUpdated) }),
  }));

  const skillPages: MetadataRoute.Sitemap = skills.map((s) => ({
    url: `${BASE_URL}/skills/${s.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    ...(s.lastUpdated && { lastModified: new Date(s.lastUpdated) }),
  }));

  return [
    ...staticPages,
    ...pluginPages,
    ...skillRepoPages,
    ...skillPages,
  ];
}
