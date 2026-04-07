"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Skill } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

const ITEMS_PER_PAGE = 26;

export function useSkillsFilters(skills: Skill[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const repoFilter = searchParams.get("repo");
  const [searchQuery, setLocalSearch] = useState(searchParams.get("search") || "");
  const sortBy = (searchParams.get("sort") as "installs" | "stars" | "votes") || "installs";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Sync local state when URL changes externally (e.g. from SkillsSearchBar)
  const urlSearch = searchParams.get("search") || "";
  useEffect(() => {
    setLocalSearch(urlSearch);
  }, [urlSearch]);

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
    (sort: "installs" | "stars" | "votes") => updateURL({ sort: sort === "installs" ? null : sort, page: null }),
    [updateURL]
  );

  const setPage = useCallback(
    (page: number) => updateURL({ page: page === 1 ? null : String(page) }),
    [updateURL]
  );

  const filteredSkills = useMemo(() => {
    let filtered = skills;

    if (repoFilter) {
      filtered = filtered.filter((s) => s.repo === repoFilter);
    }

    if (debouncedSearchQuery) {
      const words = debouncedSearchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter((s) => {
        const haystack = `${s.name} ${s.description} ${s.repo}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      });
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "stars") return (b.stars ?? 0) - (a.stars ?? 0);
      if (sortBy === "votes") return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      return b.installs - a.installs;
    });
  }, [skills, repoFilter, debouncedSearchQuery, sortBy]);

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);

  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSkills.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSkills, currentPage]);

  return {
    searchQuery,
    setSearchQuery,
    filteredSkills,
    paginatedSkills,
    sortBy,
    setSortBy,
    repoFilter,
    currentPage,
    totalPages,
    setPage,
  };
}
