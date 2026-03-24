"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { McpServer } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

const ITEMS_PER_PAGE = 22;

export function useMcpFilters(servers: McpServer[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setLocalSearch] = useState(searchParams.get("search") || "");
  const sortBy = (searchParams.get("sort") as "stars" | "votes") || "stars";
  const currentPage = Number(searchParams.get("page")) || 1;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const setSortBy = useCallback(
    (sort: "stars" | "votes") => updateURL({ sort: sort === "stars" ? null : sort, page: null }),
    [updateURL]
  );

  const setPage = useCallback(
    (page: number) => updateURL({ page: page === 1 ? null : String(page) }),
    [updateURL]
  );

  const filteredServers = useMemo(() => {
    let filtered = servers;

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.sourceRepo.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "votes") return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      return (b.stars ?? 0) - (a.stars ?? 0);
    });
  }, [servers, debouncedSearchQuery, sortBy]);

  const totalPages = Math.ceil(filteredServers.length / ITEMS_PER_PAGE);

  const paginatedServers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredServers, currentPage]);

  return {
    searchQuery,
    setSearchQuery,
    filteredServers,
    paginatedServers,
    sortBy,
    setSortBy,
    currentPage,
    totalPages,
    setPage,
  };
}
