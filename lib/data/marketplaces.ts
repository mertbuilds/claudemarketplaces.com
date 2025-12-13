import type { Marketplace } from "@/lib/types";
import { readMarketplaces } from "@/lib/search/storage";
import { repoToSlug } from "@/lib/utils/slug";

/**
 * Fetch all marketplaces with slugs computed
 * Optionally filter out marketplaces with 0 plugins
 */
export async function getAllMarketplaces(options?: {
  includeEmpty?: boolean;
}): Promise<Marketplace[]> {
  const { includeEmpty = true } = options || {};

  try {
    const marketplaces = await readMarketplaces();

    // Add slug to each marketplace
    const withSlugs = marketplaces.map(m => ({
      ...m,
      slug: repoToSlug(m.repo),
    }));

    // Filter empty marketplaces if requested
    if (!includeEmpty) {
      return withSlugs.filter(m => m.pluginCount > 0);
    }

    return withSlugs;
  } catch (error) {
    console.error("Error fetching marketplaces:", error);
    return [];
  }
}

/**
 * Get a single marketplace by slug
 */
export async function getMarketplaceBySlug(slug: string): Promise<Marketplace | null> {
  const marketplaces = await getAllMarketplaces();
  return marketplaces.find(m => m.slug === slug) || null;
}

export async function getMarketplacesByCategory(
  category: string
): Promise<Marketplace[]> {
  const marketplaces = await getAllMarketplaces();
  return marketplaces.filter((m) => m.categories.includes(category));
}

export async function getCategories(): Promise<Array<{ label: string; slug: string; count: number }>> {
  const marketplaces = await getAllMarketplaces();
  
  // Count marketplaces per category
  const categoryCounts = new Map<string, number>();
  marketplaces.forEach((m) => {
    m.categories.forEach((category) => {
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    });
  });
  
  // Convert to array of objects with label, slug, and count
  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({
      label: category,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
