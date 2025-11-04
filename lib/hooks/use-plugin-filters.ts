"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import { Plugin } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

/**
 * Plugin filtering hook - mirrors marketplace filtering pattern
 * Manages local state for search and URL-based state for category filters
 */
export function usePluginFilters(
  plugins: Plugin[],
  searchQuery: string = "" // Accept search query as parameter (local state)
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounce search query for better filtering performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
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

  // Filter and sort plugins
  const filteredPlugins = useMemo(() => {
    let filtered = plugins;

    // Search filter (using debounced query for better performance)
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.keywords?.some((k) => k.toLowerCase().includes(query)) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // Sort by name alphabetically
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [plugins, debouncedSearchQuery, selectedCategories]);

  return {
    selectedCategories,
    filteredPlugins,
    filteredCount: filteredPlugins.length,
    toggleCategory: (cat: string) => {
      const newCats = selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];
      updateURL({
        categories: newCats.length ? newCats.join(",") : null,
      });
    },
    clearFilters: () => updateURL({ categories: null }),
  };
}
