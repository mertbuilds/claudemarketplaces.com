"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skill } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function useSkillsFilters(skills: Skill[]) {
  const searchParams = useSearchParams();
  const repoFilter = searchParams.get("repo");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"installs" | "stars" | "votes">("installs");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredSkills = useMemo(() => {
    let filtered = skills;

    // Repo filter from URL
    if (repoFilter) {
      filtered = filtered.filter((s) => s.repo === repoFilter);
    }

    // Search filter (matches name, description, repo)
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.repo.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "stars") return (b.stars ?? 0) - (a.stars ?? 0);
      if (sortBy === "votes") return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      return b.installs - a.installs;
    });
  }, [skills, repoFilter, debouncedSearchQuery, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    filteredSkills,
    sortBy,
    setSortBy,
    repoFilter,
  };
}
