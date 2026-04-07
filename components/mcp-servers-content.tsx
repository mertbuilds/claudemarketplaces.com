"use client";

import { useRouter, usePathname } from "next/navigation";
import { McpServersGrid } from "@/components/mcp-servers-grid";
import { useMcpFilters } from "@/lib/hooks/use-mcp-filters";
import { McpServer } from "@/lib/types";
import { FeaturedCards } from "@/components/featured-cards";
import { VoteProvider } from "@/lib/contexts/vote-context";
import { BookmarkProvider } from "@/lib/contexts/bookmark-context";
import { ListingResultsBar } from "@/components/listing-results-bar";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingEmptyState } from "@/components/listing-empty-state";
import type { AdConfig } from "@/lib/ads";

interface McpServersContentProps {
  servers: McpServer[];
  newsletterSeed: [number, number];
  infeedAds: [AdConfig, AdConfig];
}

export function McpServersContent({ servers, newsletterSeed, infeedAds }: McpServersContentProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredServers,
    paginatedServers,
    currentPage,
    totalPages,
    setPage,
  } = useMcpFilters(servers);

  const router = useRouter();
  const pathname = usePathname();
  const hasActiveFilters = searchQuery.length > 0;

  const clearFilters = () => {
    setSearchQuery("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 pt-0 pb-4">
      {currentPage === 1 && <FeaturedCards />}

      <ListingResultsBar
        count={filteredServers.length}
        label="server"
        pluralLabel="servers"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {paginatedServers.length > 0 ? (
        <VoteProvider itemType="mcp_server" itemIds={paginatedServers.map(s => s.slug)}>
          <BookmarkProvider itemType="mcp_server" itemIds={paginatedServers.map(s => s.slug)}>
            <McpServersGrid servers={paginatedServers} newsletterSeed={newsletterSeed} infeedAds={infeedAds} isSearching={!!searchQuery} />
            <ListingPagination currentPage={currentPage} totalPages={totalPages} setPage={setPage} />
          </BookmarkProvider>
        </VoteProvider>
      ) : (
        <ListingEmptyState
          message="No MCP servers found matching your criteria."
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      )}
    </div>
  );
}
