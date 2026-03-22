"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import { Marketplace } from "@/lib/types";
import { FilterPreset, getFilterPreset } from "@/lib/config/filter-presets";
import { useDebounce } from "@/lib/hooks/use-debounce";

const ITEMS_PER_PAGE = 22;

export function useMarketplaceFilters(marketplaces: Marketplace[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const currentPage = Number(searchParams.get("page")) || 1;

  const sortBy = (searchParams.get("sort") as "stars" | "plugins" | "votes") || "stars";

  const filterParam = searchParams.get("filter");
  const filterPreset: FilterPreset =
    filterParam === "recently-published" || filterParam === "most-voted"
      ? filterParam
      : "all";
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

  const setSearchQuery = useCallback(
    (query: string) => updateURL({ search: query || null, page: null }),
    [updateURL]
  );

  const setPage = useCallback(
    (page: number) => updateURL({ page: page === 1 ? null : String(page) }),
    [updateURL]
  );

  const filteredMarketplaces = useMemo(() => {
    let filtered = marketplaces;

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

    if (filterPreset && filterPreset !== "all") {
      const presetConfig = getFilterPreset(filterPreset);
      if (presetConfig) {
        filtered = filtered.filter(presetConfig.predicate);
      }
    } else if (selectedCategories.length > 0) {
      filtered = filtered.filter((m) =>
        selectedCategories.some((cat) => m.categories.includes(cat))
      );
    }

    return filtered.sort((a, b) => {
      if (filterPreset === "most-voted" || sortBy === "votes") {
        return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      }
      if (sortBy === "plugins") {
        return (b.pluginCount ?? 0) - (a.pluginCount ?? 0);
      }
      const starsA = a.stars ?? 0;
      const starsB = b.stars ?? 0;
      return starsB - starsA;
    });
  }, [marketplaces, debouncedSearchQuery, filterPreset, selectedCategories, sortBy]);

  const totalPages = Math.ceil(filteredMarketplaces.length / ITEMS_PER_PAGE);

  const paginatedMarketplaces = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMarketplaces.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMarketplaces, currentPage]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy: (sort: "stars" | "plugins" | "votes") => {
      updateURL({ sort: sort === "stars" ? null : sort, page: null });
    },
    filterPreset,
    selectedCategories,
    filteredMarketplaces,
    paginatedMarketplaces,
    filteredCount: filteredMarketplaces.length,
    currentPage,
    totalPages,
    setPage,
    setFilterPreset: (preset: FilterPreset) => {
      updateURL({
        filter: preset === "all" ? null : preset,
        categories: null,
        page: null,
      });
    },
    toggleCategory: (cat: string) => {
      const newCats = selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];
      updateURL({
        categories: newCats.length ? newCats.join(",") : null,
        filter: null,
        page: null,
      });
    },
    clearFilters: () => updateURL({ categories: null, filter: null, search: null, page: null }),
  };
}
