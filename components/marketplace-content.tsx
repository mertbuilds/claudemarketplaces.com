"use client";

import { useRouter, usePathname } from "next/navigation";
import { MarketplaceGrid } from "@/components/marketplace-grid";
import { useMarketplaceFilters } from "@/lib/hooks/use-marketplace-filters";
import { Marketplace } from "@/lib/types";
import { FeaturedCards } from "@/components/featured-cards";
import { VoteProvider } from "@/lib/contexts/vote-context";
import { BookmarkProvider } from "@/lib/contexts/bookmark-context";
import { ListingResultsBar } from "@/components/listing-results-bar";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingEmptyState } from "@/components/listing-empty-state";
import type { AdConfig } from "@/lib/ads";

interface MarketplaceContentProps {
  marketplaces: Marketplace[];
  newsletterSeed: [number, number];
  infeedAds: [AdConfig, AdConfig];
}

export function MarketplaceContent({
  marketplaces,
  newsletterSeed,
  infeedAds,
}: MarketplaceContentProps) {
  const {
    searchQuery,
    paginatedMarketplaces,
    filteredCount,
    currentPage,
    totalPages,
    setPage,
    clearFilters,
  } = useMarketplaceFilters(marketplaces);

  const router = useRouter();
  const pathname = usePathname();
  const hasActiveFilters = !!searchQuery;

  const handleClearFilters = () => {
    clearFilters();
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 pt-0 pb-4">
      {currentPage === 1 && <FeaturedCards />}

      <ListingResultsBar
        count={filteredCount}
        label="marketplace"
        pluralLabel="marketplaces"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {paginatedMarketplaces.length > 0 ? (
        <VoteProvider itemType="marketplace" itemIds={paginatedMarketplaces.map(m => m.repo)}>
          <BookmarkProvider itemType="marketplace" itemIds={paginatedMarketplaces.map(m => m.repo)}>
            <MarketplaceGrid marketplaces={paginatedMarketplaces} newsletterSeed={newsletterSeed} infeedAds={infeedAds} isSearching={!!searchQuery} />
            <ListingPagination currentPage={currentPage} totalPages={totalPages} setPage={setPage} />
          </BookmarkProvider>
        </VoteProvider>
      ) : (
        <ListingEmptyState
          message="No marketplaces found matching your criteria."
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}
