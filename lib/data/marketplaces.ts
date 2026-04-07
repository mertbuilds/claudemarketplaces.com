import { Marketplace } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapMarketplaceRow, MarketplaceRow } from "@/lib/supabase/mappers";
import {
  MARKETPLACE_CATEGORIES,
  classifyAllMarketplaces,
} from "@/lib/data/marketplace-categories";

/**
 * Fetch all marketplaces from Supabase
 * Optionally filter out marketplaces with 0 plugins
 */
export async function getAllMarketplaces(options?: {
  includeEmpty?: boolean;
}): Promise<Marketplace[]> {
  const { includeEmpty = true } = options || {};
  const supabase = await getDataClient();
  const allRows: MarketplaceRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    let query = supabase.from("marketplaces").select("*");
    if (!includeEmpty) {
      query = query.gt("plugin_count", 0);
    }

    const { data, error } = await query
      .order("stars", { ascending: false, nullsFirst: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Error fetching marketplaces:", error);
      return [];
    }

    allRows.push(...(data as MarketplaceRow[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return allRows.map(mapMarketplaceRow);
}

/**
 * Get top-voted marketplaces (with at least 1 plugin).
 */
export async function getTopMarketplaces(limit: number = 2): Promise<Marketplace[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("marketplaces")
    .select("*")
    .gt("plugin_count", 0)
    .order("stars", { ascending: false, nullsFirst: false })
    .order("plugin_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching top marketplaces:", error);
    return [];
  }
  return (data as MarketplaceRow[]).map(mapMarketplaceRow);
}

/**
 * Get most recently added marketplaces (with at least 1 plugin).
 */
export async function getLatestMarketplaces(limit: number = 2): Promise<Marketplace[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("marketplaces")
    .select("*")
    .gt("plugin_count", 0)
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest marketplaces:", error);
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
  const allRows: MarketplaceRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("marketplaces")
      .select("*")
      .contains("categories", [category])
      .order("stars", { ascending: false, nullsFirst: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Error fetching marketplaces by category:", error);
      return [];
    }

    allRows.push(...(data as MarketplaceRow[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return allRows.map(mapMarketplaceRow);
}

/**
 * Get all unique categories across marketplaces
 */
export async function getCategories(): Promise<string[]> {
  const marketplaces = await getAllMarketplaces();
  const categories = new Set(marketplaces.flatMap((m) => m.categories));
  return Array.from(categories).sort();
}

/**
 * Get marketplaces for a curated category (keyword + DB-category classification).
 * Named differently from getMarketplacesByCategory which queries the DB directly.
 */
export async function getMarketplacesByNewCategory(
  slug: string
): Promise<Marketplace[]> {
  const all = await getAllMarketplaces({ includeEmpty: false });
  const classified = classifyAllMarketplaces(all);
  return classified[slug] ?? [];
}

/**
 * Returns curated category counts: { slug: number } for all defined marketplace categories.
 * Used for the category navigation section.
 */
export async function getMarketplaceCategoryCounts(): Promise<
  Record<string, number>
> {
  const all = await getAllMarketplaces({ includeEmpty: false });
  const classified = classifyAllMarketplaces(all);
  const counts: Record<string, number> = {};
  for (const cat of MARKETPLACE_CATEGORIES) {
    counts[cat.slug] = classified[cat.slug]?.length ?? 0;
  }
  return counts;
}
