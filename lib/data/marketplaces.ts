import { Marketplace } from "@/lib/types";
import { readMarketplaces } from "@/lib/search/storage";

/**
 * Fetch all marketplaces
 * Server-side: reads directly from Vercel Blob or local file
 * This works during build time and runtime
 */
export async function getAllMarketplaces(): Promise<Marketplace[]> {
  try {
    // Directly call the storage layer - works in all contexts
    return await readMarketplaces();
  } catch (error) {
    console.error("Error fetching marketplaces:", error);
    // Return empty array as fallback
    return [];
  }
}

export async function getMarketplacesByCategory(
  category: string
): Promise<Marketplace[]> {
  const marketplaces = await getAllMarketplaces();
  return marketplaces.filter((m) => m.categories.includes(category));
}

export async function getCategories(): Promise<string[]> {
  const marketplaces = await getAllMarketplaces();
  const categories = new Set(marketplaces.flatMap((m) => m.categories));
  return Array.from(categories).sort();
}
