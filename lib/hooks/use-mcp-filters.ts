"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { McpServer } from "@/lib/types";

const ITEMS_PER_PAGE = 23;

export function useMcpFilters(servers: McpServer[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sort") as "stars" | "votes") || "stars";
  const currentPage = Number(searchParams.get("page")) || 1;

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
    (q: string) => updateURL({ search: q || null, page: null }),
    [updateURL]
  );

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

    if (searchQuery) {
      const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter((s) => {
        const haystack = `${s.name} ${s.description} ${s.sourceRepo} ${s.tags.join(" ")}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      });
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "votes") return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      return (b.stars ?? 0) - (a.stars ?? 0);
    });
  }, [servers, searchQuery, sortBy]);

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
