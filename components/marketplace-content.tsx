"use client";

import { useState, useMemo } from "react";
import { MarketplaceGrid } from "@/components/marketplace-grid";
import { MarketplaceSearch } from "@/components/marketplace-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketplaceFilters } from "@/lib/hooks/use-marketplace-filters";
import { Marketplace } from "@/lib/types";
import { FILTER_PRESETS, type FilterPreset } from "@/lib/config/filter-presets";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 20;

interface MarketplaceContentProps {
  marketplaces: Marketplace[];
  categories: string[];
}

export function MarketplaceContent({
  marketplaces,
  categories,
}: MarketplaceContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    filterPreset,
    selectedCategories,
    filteredMarketplaces,
    filteredCount,
    setFilterPreset,
    toggleCategory,
    clearFilters: clearUrlFilters,
  } = useMarketplaceFilters(marketplaces, searchQuery);

  const totalPages = Math.ceil(filteredCount / ITEMS_PER_PAGE);

  const paginatedMarketplaces = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMarketplaces.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMarketplaces, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterPreset = (id: FilterPreset) => {
    setFilterPreset(id);
    setCurrentPage(1);
  };

  const handleToggleCategory = (category: string) => {
    toggleCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    (filterPreset && filterPreset !== "all");

  const clearFilters = () => {
    setSearchQuery("");
    clearUrlFilters();
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <MarketplaceSearch value={searchQuery} onChange={handleSearchChange} />
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
              onClick={() => handleFilterPreset(preset.id)}
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
                onClick={() => handleToggleCategory(category)}
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
      {paginatedMarketplaces.length > 0 ? (
        <>
          <MarketplaceGrid marketplaces={paginatedMarketplaces} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
