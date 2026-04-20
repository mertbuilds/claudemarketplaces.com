"use client";

import { SkillsGrid } from "@/components/skills-grid";
import { useSkillsFilters } from "@/lib/hooks/use-skills-filters";
import { Skill } from "@/lib/types";
import { FeaturedCards } from "@/components/featured-cards";
import { VoteProvider } from "@/lib/contexts/vote-context";
import { BookmarkProvider } from "@/lib/contexts/bookmark-context";
import { ListingResultsBar } from "@/components/listing-results-bar";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingEmptyState } from "@/components/listing-empty-state";
import { ListingSearchBar } from "@/components/listing-search-bar";
import { useRouter, usePathname } from "next/navigation";
import type { AdConfig } from "@/lib/ads";

interface SkillsContentProps {
  skills: Skill[];
  newsletterSeed: [number, number];
  infeedAds: [AdConfig, AdConfig];
  showFeatured?: boolean;
}

export function SkillsContent({ skills, newsletterSeed, infeedAds, showFeatured = true }: SkillsContentProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredSkills,
    totalCount,
    paginatedSkills,
    repoFilter,
    sortBy,
    setSortBy,
    currentPage,
    totalPages,
    setPage,
  } = useSkillsFilters(skills);

  const router = useRouter();
  const pathname = usePathname();
  const hasActiveFilters = searchQuery.length > 0 || !!repoFilter;

  const clearFilters = () => {
    setSearchQuery("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 pt-0 pb-4">
      {showFeatured && <FeaturedCards />}

      <div className="my-4">
        <ListingSearchBar
          placeholder="Search skills..."
          sortOptions={[
            { value: "installs", label: "Most installed" },
            { value: "stars", label: "Most stars" },
            { value: "votes", label: "Most voted" },
          ]}
          defaultSort="installs"
        />
      </div>

      <ListingResultsBar
        count={totalCount}
        label="skill"
        pluralLabel="skills"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {paginatedSkills.length > 0 ? (
        <VoteProvider itemType="skill" itemIds={paginatedSkills.map(s => s.id)}>
          <BookmarkProvider itemType="skill" itemIds={paginatedSkills.map(s => s.id)}>
            <SkillsGrid skills={paginatedSkills} newsletterSeed={newsletterSeed} infeedAds={infeedAds} isSearching={!!searchQuery} />
            <ListingPagination currentPage={currentPage} totalPages={totalPages} setPage={setPage} />
          </BookmarkProvider>
        </VoteProvider>
      ) : (
        <ListingEmptyState
          message="No skills found matching your criteria."
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      )}
    </div>
  );
}
