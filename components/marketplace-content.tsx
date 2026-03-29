"use client";

import { MarketplaceGrid } from "@/components/marketplace-grid";
import { MarketplaceSearch } from "@/components/marketplace-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketplaceFilters } from "@/lib/hooks/use-marketplace-filters";
import { Marketplace } from "@/lib/types";
import { FILTER_PRESETS } from "@/lib/config/filter-presets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeaturedCards } from "@/components/featured-cards";
import { VoteProvider } from "@/lib/contexts/vote-context";

interface MarketplaceContentProps {
  marketplaces: Marketplace[];
  categories: string[];
  newsletterSeed: [number, number];
}

export function MarketplaceContent({
  marketplaces,
  categories,
  newsletterSeed,
}: MarketplaceContentProps) {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterPreset,
    selectedCategories,
    paginatedMarketplaces,
    filteredCount,
    currentPage,
    totalPages,
    setPage,
    setFilterPreset,
    toggleCategory,
    clearFilters,
  } = useMarketplaceFilters(marketplaces);

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    (filterPreset && filterPreset !== "all");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar + Sort */}
      <div className="mb-6 flex gap-3">
        <div className="flex-1">
          <MarketplaceSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value: "stars" | "plugins" | "votes") => setSortBy(value)}
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stars">Most stars</SelectItem>
            <SelectItem value="plugins">Most plugins</SelectItem>
            <SelectItem value="votes">Most voted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Horizontal Scrollable Filter Presets and Categories */}
      <div className="mb-6 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* Filter Presets */}
          {FILTER_PRESETS.map((preset) => (
            <Badge
              key={preset.id}
              variant={filterPreset === preset.id ? "default" : "outline"}
              className="cursor-pointer capitalize shrink-0"
              onClick={() => setFilterPreset(preset.id)}
            >
              {preset.label}
            </Badge>
          ))}
          {/* Category Filters */}
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <Badge
                key={category}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer capitalize shrink-0"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Featured Cards - only on page 1 with no filters */}
      {currentPage === 1 && !hasActiveFilters && <FeaturedCards />}

      {/* Results info */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredCount} {filteredCount === 1 ? "marketplace" : "marketplaces"}
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

      {/* Marketplace Grid */}
      {paginatedMarketplaces.length > 0 ? (
        <VoteProvider itemType="marketplace" itemIds={paginatedMarketplaces.map(m => m.repo)}>
          <MarketplaceGrid marketplaces={paginatedMarketplaces} newsletterSeed={newsletterSeed} isSearching={!!searchQuery} />

          {/* Pagination */}
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
        </VoteProvider>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No marketplaces found matching your criteria.
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
