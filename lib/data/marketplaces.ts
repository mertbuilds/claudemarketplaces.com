import { Marketplace } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapMarketplaceRow, MarketplaceRow } from "@/lib/supabase/mappers";

/**
 * Fetch all marketplaces from Supabase
 * Optionally filter out marketplaces with 0 plugins
 */
export async function getAllMarketplaces(options?: {
  includeEmpty?: boolean;
}): Promise<Marketplace[]> {
  const { includeEmpty = true } = options || {};
  const supabase = await getDataClient();

  let query = supabase.from("marketplaces").select("*");
  if (!includeEmpty) {
    query = query.gt("plugin_count", 0);
  }

  const { data, error } = await query.order("stars", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("Error fetching marketplaces:", error);
    return [];
  }

  return (data as MarketplaceRow[]).map(mapMarketplaceRow);
}

/**
 * Get a single marketplace by slug
 */
export async function getMarketplaceBySlug(
  slug: string
): Promise<Marketplace | null> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("marketplaces")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapMarketplaceRow(data as MarketplaceRow);
}

/**
 * Get marketplaces that include a specific category
 */
export async function getMarketplacesByCategory(
  category: string
): Promise<Marketplace[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("marketplaces")
    .select("*")
    .contains("categories", [category])
    .order("stars", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Error fetching marketplaces by category:", error);
    return [];
  }

  return (data as MarketplaceRow[]).map(mapMarketplaceRow);
}

/**
 * Get all unique categories across marketplaces
 */
export async function getCategories(): Promise<string[]> {
  const marketplaces = await getAllMarketplaces();
  const categories = new Set(marketplaces.flatMap((m) => m.categories));
  return Array.from(categories).sort();
}
