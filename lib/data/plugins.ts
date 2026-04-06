import { Plugin } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapPluginRow, PluginRow } from "@/lib/supabase/mappers";

/**
 * Fetch all plugins from Supabase
 */
export async function getAllPlugins(): Promise<Plugin[]> {
  const supabase = await getDataClient();
  const allRows: PluginRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("plugins")
      .select("*")
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Error fetching plugins:", error);
      return [];
    }

    allRows.push(...(data as PluginRow[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return allRows.map(mapPluginRow);
}

/**
 * Get plugins for a specific marketplace by slug
 */
export async function getPluginsByMarketplace(
  slug: string
): Promise<Plugin[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("marketplace", slug);
  if (error) {
    console.error("Error fetching plugins:", error);
    return [];
  }
  return (data as PluginRow[]).map(mapPluginRow);
}

/**
 * Get unique categories from plugins in a marketplace
 */
export async function getPluginCategories(
  marketplaceSlug: string
): Promise<string[]> {
  const plugins = await getPluginsByMarketplace(marketplaceSlug);
  const categories = new Set<string>();

  plugins.forEach((plugin) => {
    if (plugin.category) {
      categories.add(plugin.category);
    }
  });

  return Array.from(categories).sort();
}
