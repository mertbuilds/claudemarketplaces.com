"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SkillsGrid } from "@/components/skills-grid";
import { useSkillsFilters } from "@/lib/hooks/use-skills-filters";
import { Skill } from "@/lib/types";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeaturedCards } from "@/components/featured-cards";

const ITEMS_PER_PAGE = 22;

interface SkillsContentProps {
  skills: Skill[];
  newsletterSeed: [number, number];
}

export function SkillsContent({ skills, newsletterSeed }: SkillsContentProps) {
  const { searchQuery, setSearchQuery, filteredSkills, repoFilter, sortBy, setSortBy } = useSkillsFilters(skills);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);

  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSkills.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSkills, currentPage]);

  const hasActiveFilters = searchQuery.length > 0 || !!repoFilter;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
    if (repoFilter) {
      window.history.pushState({}, "", "/skills");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar + Sort */}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value: "installs" | "stars" | "votes") => {
            setSortBy(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="installs">Most installed</SelectItem>
            <SelectItem value="stars">Most stars</SelectItem>
            <SelectItem value="votes">Most voted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Featured Cards - only on page 1 with no filters */}
      {currentPage === 1 && !hasActiveFilters && <FeaturedCards />}

      {/* Results info */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredSkills.length} {filteredSkills.length === 1 ? "skill" : "skills"}
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

      {/* Skills Grid */}
      {paginatedSkills.length > 0 ? (
        <>
          <SkillsGrid skills={paginatedSkills} newsletterSeed={newsletterSeed} isSearching={!!searchQuery} />

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
            No skills found matching your criteria.
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
