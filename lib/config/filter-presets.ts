import { Marketplace } from "@/lib/types";

/**
 * Filter preset identifiers
 * Presets are mutually exclusive with category filters
 */
export type FilterPreset = "all" | "recently-published" | "most-voted";

/**
 * Configuration for a filter preset
 */
export interface FilterPresetConfig {
  id: FilterPreset;
  label: string;
  description: string;
  predicate: (marketplace: Marketplace) => boolean;
}

/**
 * Check if a marketplace was recently published
 * A marketplace is recently published when it was discovered within the last 24 hours
 */
export function isRecentlyPublished(marketplace: Marketplace): boolean {
  if (!marketplace.discoveredAt) {
    return false;
  }

  const discoveredDate = new Date(marketplace.discoveredAt);
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return discoveredDate >= twentyFourHoursAgo;
}

/**
 * All available filter presets
 * Order determines display order in UI
 */
export const FILTER_PRESETS: FilterPresetConfig[] = [
  {
    id: "all",
    label: "All",
    description: "Show all marketplaces",
    predicate: () => true,
  },
];

/**
 * Get a filter preset by ID
 */
export function getFilterPreset(id: string): FilterPresetConfig | undefined {
  return FILTER_PRESETS.find((preset) => preset.id === id);
}
