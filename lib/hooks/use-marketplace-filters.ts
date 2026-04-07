"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Marketplace } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

const ITEMS_PER_PAGE = 23;

export function useMarketplaceFilters(marketplaces: Marketplace[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setLocalSearch] = useState(searchParams.get("search") || "");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const currentPage = Number(searchParams.get("page")) || 1;

  // Sync local state when URL changes externally (e.g. from MarketplaceSearchBar)
  const urlSearch = searchParams.get("search") || "";
  useEffect(() => {
    setLocalSearch(urlSearch);
  }, [urlSearch]);

  const sortBy = (searchParams.get("sort") as "stars" | "plugins" | "votes") || "stars";

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

  const prevDebouncedRef = useRef(debouncedSearchQuery);
  useEffect(() => {
    if (prevDebouncedRef.current !== debouncedSearchQuery) {
      prevDebouncedRef.current = debouncedSearchQuery;
      updateURL({ search: debouncedSearchQuery || null, page: null });
    }
  }, [debouncedSearchQuery, updateURL]);

  const setSearchQuery = setLocalSearch;

  const setPage = useCallback(
    (page: number) => updateURL({ page: page === 1 ? null : String(page) }),
    [updateURL]
  );

  const filteredMarketplaces = useMemo(() => {
    let filtered = marketplaces;

    if (debouncedSearchQuery) {
      const words = debouncedSearchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter((m) => {
        const haystack = `${m.repo} ${m.description} ${m.categories.join(" ")} ${m.pluginKeywords?.join(" ") ?? ""}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      });
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "votes") return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      if (sortBy === "plugins") return (b.pluginCount ?? 0) - (a.pluginCount ?? 0);
      return (b.stars ?? 0) - (a.stars ?? 0);
    });
  }, [marketplaces, debouncedSearchQuery, sortBy]);

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
    filteredMarketplaces,
    paginatedMarketplaces,
    filteredCount: filteredMarketplaces.length,
    currentPage,
    totalPages,
    setPage,
    clearFilters: () => {
      setLocalSearch("");
      updateURL({ search: null, page: null });
    },
  };
}
