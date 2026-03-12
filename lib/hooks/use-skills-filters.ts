"use client";

import { useMemo, useState } from "react";
import { Skill } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function useSkillsFilters(skills: Skill[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"stars" | "votes">("stars");

  // Debounce search query for better filtering performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter skills
  const filteredSkills = useMemo(() => {
    let filtered = skills;

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

    // Sort by votes or stars
    return filtered.sort((a, b) => {
      if (sortBy === "votes") {
        return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      }
      const starsA = a.stars ?? 0;
      const starsB = b.stars ?? 0;
      return starsB - starsA;
    });
  }, [skills, debouncedSearchQuery, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    filteredSkills,
    sortBy,
    setSortBy,
  };
}
