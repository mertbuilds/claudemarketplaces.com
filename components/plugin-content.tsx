"use client";

import { PluginCard } from "@/components/plugin-card";
import { MarketplaceSearch } from "@/components/marketplace-search";
import { Badge } from "@/components/ui/badge";
import { usePluginFilters } from "@/lib/hooks/use-plugin-filters";
import { Plugin } from "@/lib/types";

interface PluginContentProps {
  plugins: Plugin[];
  categories: string[];
  expectedPluginCount?: number;
}

export function PluginContent({ plugins, categories, expectedPluginCount }: PluginContentProps) {
  const {
    searchQuery,
    selectedCategories,
    filteredPlugins,
    filteredCount,
    setSearchQuery,
    toggleCategory,
    clearFilters,
  } = usePluginFilters(plugins);

  const hasActiveFilters =
    searchQuery || selectedCategories.length > 0;

  // Check if we have a data sync issue (marketplace says it has plugins but we found none)
  const hasDataSyncIssue =
    plugins.length === 0 &&
    !hasActiveFilters &&
    expectedPluginCount &&
    expectedPluginCount > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <MarketplaceSearch
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="mb-6 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPlugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
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
