"use client";

import { useMemo, useState } from "react";
import { McpServer } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function useMcpFilters(servers: McpServer[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"votes">("votes");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

    return filtered.sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));
  }, [servers, debouncedSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredServers,
    sortBy,
    setSortBy,
  };
}
