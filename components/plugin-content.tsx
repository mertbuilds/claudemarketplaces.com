"use client";

import { useState } from "react";
import { PluginCard } from "@/components/plugin-card";
import { MarketplaceSearch } from "@/components/marketplace-search";
import { Badge } from "@/components/ui/badge";
import { usePluginFilters } from "@/lib/hooks/use-plugin-filters";
import { Plugin } from "@/lib/types";
import { VoteProvider } from "@/lib/contexts/vote-context";
import { BookmarkProvider } from "@/lib/contexts/bookmark-context";

interface PluginContentProps {
  plugins: Plugin[];
  categories: string[];
  expectedPluginCount?: number;
  className?: string;
}

export function PluginContent({ plugins, categories, expectedPluginCount, className }: PluginContentProps) {
  // Local state for search query (not in URL)
  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedCategories,
    filteredPlugins,
    filteredCount,
    toggleCategory,
    clearFilters: clearUrlFilters,
  } = usePluginFilters(plugins, searchQuery);

  const hasActiveFilters =
    searchQuery || selectedCategories.length > 0;

  // Check if we have a data sync issue (marketplace says it has plugins but we found none)
  const hasDataSyncIssue =
    plugins.length === 0 &&
    !hasActiveFilters &&
    expectedPluginCount &&
    expectedPluginCount > 0;

  // Clear both local search and URL filters
  const clearFilters = () => {
    setSearchQuery("");
    clearUrlFilters();
  };

  return (
    <div className={className ?? "container mx-auto px-4 pt-4 pb-8"}>
      {/* Search Bar */}
      <div className="mb-6">
        <MarketplaceSearch
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredCount} {filteredCount === 1 ? "plugin" : "plugins"}
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

      {/* Plugin Grid */}
      {filteredPlugins.length > 0 ? (
        <VoteProvider itemType="plugin" itemIds={filteredPlugins.map(p => p.id)}>
          <BookmarkProvider itemType="plugin" itemIds={filteredPlugins.map(p => p.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPlugins.map((plugin) => (
                <PluginCard key={plugin.id} plugin={plugin} />
              ))}
            </div>
          </BookmarkProvider>
        </VoteProvider>
      ) : (
        <div className="text-center py-12">
          {hasDataSyncIssue ? (
            <>
              <p className="text-muted-foreground mb-2">
                Plugins are currently being indexed.
              </p>
              <p className="text-sm text-muted-foreground">
                This marketplace has {expectedPluginCount} {expectedPluginCount === 1 ? 'plugin' : 'plugins'} that will appear shortly. Please check back soon or refresh the page.
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">
                No plugins found matching your criteria.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
