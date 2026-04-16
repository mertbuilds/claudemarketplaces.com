"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Skill } from "@/lib/types";

const ITEMS_PER_PAGE = 26;

export function useSkillsFilters(skills: Skill[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const repoFilter = searchParams.get("repo");
  const searchQuery = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sort") as "installs" | "stars" | "votes") || "installs";
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
    (sort: "installs" | "stars" | "votes") => updateURL({ sort: sort === "installs" ? null : sort, page: null }),
    [updateURL]
  );

  const setPage = useCallback(
    (page: number) => updateURL({ page: page === 1 ? null : String(page) }),
    [updateURL]
  );

  const { filteredSkills, totalCount } = useMemo(() => {
    let filtered = skills;

    if (repoFilter) {
      filtered = filtered.filter((s) => s.repo === repoFilter);
    }

    if (searchQuery) {
      const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter((s) => {
        const haystack = `${s.name} ${s.description} ${s.repo}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "stars") return (b.stars ?? 0) - (a.stars ?? 0);
      if (sortBy === "votes") return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      return b.installs - a.installs;
    });

    const totalCount = sorted.length;

    // When browsing (no search, no repo filter), show only the top skill
    // per repo so one org can't dominate the entire listing.
    if (!searchQuery && !repoFilter) {
      const repoCounts = new Map<string, number>();
      for (const s of sorted) {
        repoCounts.set(s.repo, (repoCounts.get(s.repo) ?? 0) + 1);
      }

      const seen = new Set<string>();
      const deduped = sorted
        .filter((s) => {
          if (seen.has(s.repo)) return false;
          seen.add(s.repo);
          return true;
        })
        .map((s) => ({ ...s, repoSkillCount: repoCounts.get(s.repo) ?? 1 }));

      return { filteredSkills: deduped, totalCount };
    }

    return { filteredSkills: sorted, totalCount };
  }, [skills, repoFilter, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);

  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSkills.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSkills, currentPage]);

  return {
    searchQuery,
    setSearchQuery,
    filteredSkills,
    totalCount,
    paginatedSkills,
    sortBy,
    setSortBy,
    repoFilter,
    currentPage,
    totalPages,
    setPage,
  };
}
