"use client";

import { Input } from "@/components/ui/input";
import { SkillsGrid } from "@/components/skills-grid";
import { useSkillsFilters } from "@/lib/hooks/use-skills-filters";
import { Skill } from "@/lib/types";
import { Search } from "lucide-react";

interface SkillsContentProps {
  skills: Skill[];
}

export function SkillsContent({ skills }: SkillsContentProps) {
  const { searchQuery, setSearchQuery, filteredSkills } = useSkillsFilters(skills);

  const hasActiveFilters = searchQuery.length > 0;

  const clearFilters = () => {
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

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
      {filteredSkills.length > 0 ? (
        <SkillsGrid skills={filteredSkills} />
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
