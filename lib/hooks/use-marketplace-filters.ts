"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import { Marketplace } from "@/lib/types";
import { FilterPreset, getFilterPreset } from "@/lib/config/filter-presets";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function useMarketplaceFilters(
  marketplaces: Marketplace[],
  searchQuery: string = "" // Accept search query as parameter (local state)
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounce search query for better filtering performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  // Validate filter preset from URL params
  const filterParam = searchParams.get("filter");
  const filterPreset: FilterPreset =
    filterParam === "recently-published" ? filterParam : "all";
  const selectedCategories = useMemo(
    () => searchParams.get("categories")?.split(",").filter(Boolean) || [],
    [searchParams]
  );

  const updateURL = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Filter and sort marketplaces
  const filteredMarketplaces = useMemo(() => {
    let filtered = marketplaces;

    // Search filter (searches marketplace fields + aggregated plugin keywords)
    // Uses debounced query to reduce expensive filtering on every keystroke
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.repo.toLowerCase().includes(query) ||
          m.slug.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.categories.some((cat) => cat.toLowerCase().includes(query)) ||
          m.pluginKeywords?.some((kw) => kw.includes(query))
      );
    }

    // Apply filter preset (mutually exclusive with categories)
    if (filterPreset && filterPreset !== "all") {
      const presetConfig = getFilterPreset(filterPreset);
      if (presetConfig) {
        filtered = filtered.filter(presetConfig.predicate);
      }
    }
    // Category filter (only if no preset filter is active)
    else if (selectedCategories.length > 0) {
      filtered = filtered.filter((m) =>
        selectedCategories.some((cat) => m.categories.includes(cat))
      );
    }

    // Sort by stars (highest first)
    return filtered.sort((a, b) => {
      const starsA = a.stars ?? 0;
      const starsB = b.stars ?? 0;
      return starsB - starsA;
    });
  }, [marketplaces, debouncedSearchQuery, filterPreset, selectedCategories]);

  return {
    filterPreset,
    selectedCategories,
    filteredMarketplaces,
    filteredCount: filteredMarketplaces.length,
    setFilterPreset: (preset: FilterPreset) => {
      updateURL({
        filter: preset === "all" ? null : preset,
        categories: null, // Clear categories when setting a preset
      });
    },
    toggleCategory: (cat: string) => {
      const newCats = selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];
      updateURL({
        categories: newCats.length ? newCats.join(",") : null,
        filter: null, // Clear preset when selecting a category
      });
    },
    clearFilters: () => updateURL({ categories: null, filter: null }),
  };
}
