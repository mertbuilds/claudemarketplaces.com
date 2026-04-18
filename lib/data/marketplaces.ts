import { Marketplace } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapMarketplaceRow, MarketplaceRow } from "@/lib/supabase/mappers";
import {
  MARKETPLACE_CATEGORIES,
  classifyAllMarketplaces,
} from "@/lib/data/marketplace-categories";
import { createMemo } from "@/lib/cache/memo";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const marketplacesMemo = createMemo<Marketplace[]>(async () => {
  const supabase = await getDataClient();
  const allRows: MarketplaceRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("marketplaces")
      .select("*")
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
}, SEVEN_DAYS);

export const invalidateMarketplacesMemo = marketplacesMemo.invalidate;

export async function getAllMarketplaces(options?: {
  includeEmpty?: boolean;
}): Promise<Marketplace[]> {
  const { includeEmpty = true } = options || {};
  const all = await marketplacesMemo.get();
  if (includeEmpty) return all;
  return all.filter((m) => m.pluginCount > 0);
}

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

export async function getMarketplacesByCategory(
  category: string
): Promise<Marketplace[]> {
  const all = await marketplacesMemo.get();
  return all.filter((m) => m.categories?.includes(category));
}

export async function getCategories(): Promise<string[]> {
  const marketplaces = await marketplacesMemo.get();
  const categories = new Set(marketplaces.flatMap((m) => m.categories));
  return Array.from(categories).sort();
}

export async function getMarketplacesByNewCategory(
  slug: string
): Promise<Marketplace[]> {
  const all = await getAllMarketplaces({ includeEmpty: false });
  const classified = classifyAllMarketplaces(all);
  return classified[slug] ?? [];
}

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
