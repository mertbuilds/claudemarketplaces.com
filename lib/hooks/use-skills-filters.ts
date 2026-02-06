"use client";

import { useMemo, useState } from "react";
import { Skill } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function useSkillsFilters(skills: Skill[]) {
  const [searchQuery, setSearchQuery] = useState("");

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

    // Sort by stars (highest first)
    return filtered.sort((a, b) => {
      const starsA = a.stars ?? 0;
      const starsB = b.stars ?? 0;
      return starsB - starsA;
    });
  }, [skills, debouncedSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredSkills,
  };
}
