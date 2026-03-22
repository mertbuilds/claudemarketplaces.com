"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { McpServersGrid } from "@/components/mcp-servers-grid";
import { useMcpFilters } from "@/lib/hooks/use-mcp-filters";
import { McpServer } from "@/lib/types";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeaturedCards } from "@/components/featured-cards";

interface McpServersContentProps {
  servers: McpServer[];
  newsletterSeed: [number, number];
}

export function McpServersContent({ servers, newsletterSeed }: McpServersContentProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredServers,
    paginatedServers,
    sortBy,
    setSortBy,
    currentPage,
    totalPages,
    setPage,
  } = useMcpFilters(servers);

  const hasActiveFilters = searchQuery.length > 0;

  const clearFilters = () => {
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search MCP servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value: "stars" | "votes") => setSortBy(value)}
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stars">Most stars</SelectItem>
            <SelectItem value="votes">Most voted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {currentPage === 1 && !hasActiveFilters && <FeaturedCards />}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredServers.length} {filteredServers.length === 1 ? "server" : "servers"}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {paginatedServers.length > 0 ? (
        <>
          <McpServersGrid servers={paginatedServers} newsletterSeed={newsletterSeed} isSearching={!!searchQuery} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No MCP servers found matching your criteria.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
