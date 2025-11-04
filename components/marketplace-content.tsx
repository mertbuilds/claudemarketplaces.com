"use client";

import { useState } from "react";
import { MarketplaceGrid } from "@/components/marketplace-grid";
import { MarketplaceSearch } from "@/components/marketplace-search";
import { Badge } from "@/components/ui/badge";
import { useMarketplaceFilters } from "@/lib/hooks/use-marketplace-filters";
import { Marketplace } from "@/lib/types";
import { FILTER_PRESETS } from "@/lib/config/filter-presets";

interface MarketplaceContentProps {
  marketplaces: Marketplace[];
  categories: string[];
}

export function MarketplaceContent({
  marketplaces,
  categories,
}: MarketplaceContentProps) {
  // Local state for search query (not in URL)
  const [searchQuery, setSearchQuery] = useState("");

  const {
    filterPreset,
    selectedCategories,
    filteredMarketplaces,
    filteredCount,
    setFilterPreset,
    toggleCategory,
    clearFilters: clearUrlFilters,
  } = useMarketplaceFilters(marketplaces, searchQuery);

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    (filterPreset && filterPreset !== "all");

  // Clear both local search and URL filters
  const clearFilters = () => {
    setSearchQuery("");
    clearUrlFilters();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <MarketplaceSearch value={searchQuery} onChange={setSearchQuery} />
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
      {filteredMarketplaces.length > 0 ? (
        <MarketplaceGrid marketplaces={filteredMarketplaces} />
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
