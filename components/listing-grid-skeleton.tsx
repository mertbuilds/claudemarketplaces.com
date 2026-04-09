import React from "react";

// ── Category chips skeleton ───────────────────────────────────────────

const CHIP_WIDTHS = [
  "w-52", "w-40", "w-36",         // row 1
  "w-36", "w-32", "w-44",         // row 2
  "w-28", "w-44", "w-36",         // row 3
  "w-40", "w-44",                 // row 4 + "more" button
];

export function CategoryChipsSkeleton() {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1">
      {CHIP_WIDTHS.map((w, i) => (
        <div
          key={i}
          className={`${w} px-3 py-1.5 border border-border animate-pulse`}
        >
          <div className="h-4 bg-muted rounded-sm" />
        </div>
      ))}
      <div className="w-24 px-3 py-1.5 border border-dashed border-border animate-pulse">
        <div className="h-4 bg-muted rounded-sm" />
      </div>
    </div>
  );
}

// ── Featured cards skeleton ───────────────────────────────────────────

function FeaturedCardSkeleton() {
  return (
    <div className="border border-border bg-card animate-pulse py-1">
      <div className="px-3 py-2 space-y-2">
        <div className="flex gap-2 items-start">
          <div className="h-3.5 w-3.5 bg-muted shrink-0 mt-[0.15rem]" />
          <div className="h-5 w-3/4 bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-3.5 w-full bg-muted" />
          <div className="h-3.5 w-2/3 bg-muted" />
        </div>
        <div className="h-4 w-20 bg-muted" />
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="mb-4">
      <div className="h-4 w-16 bg-muted animate-pulse mb-2" />

      {/* Mobile carousel skeleton: visible below md */}
      <div className="md:hidden">
        <FeaturedCardSkeleton />
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full bg-muted-foreground/30 ${i === 0 ? "w-4 bg-primary" : "w-1.5"}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid: visible at md+ */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <FeaturedCardSkeleton />
        <FeaturedCardSkeleton />
        <FeaturedCardSkeleton />
        <div className="border border-dashed border-muted-foreground/25 animate-pulse py-1">
          <div className="px-3 py-2 space-y-2">
            <div className="h-5 w-3/5 bg-muted" />
            <div className="space-y-1">
              <div className="h-3.5 w-full bg-muted" />
              <div className="h-3.5 w-2/3 bg-muted" />
            </div>
            <div className="h-4 w-16 bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card skeletons ────────────────────────────────────────────────────
// Heights match real components: same padding, gap, and line-height classes.

function SkillCardSkeleton() {
  return (
    <div className="bg-card flex flex-col border shadow-sm animate-pulse py-0 gap-0">
      <div className="grid auto-rows-min gap-2 p-4">
        <div className="flex flex-col gap-1.5">
          {/* Title row: text-base leading-6 (24px) + BookmarkButton p-1 (24px) */}
          <div className="flex items-start justify-between gap-2">
            <div className="h-6 w-3/5 bg-muted" />
            <div className="p-1"><div className="h-4 w-4 bg-muted" /></div>
          </div>
          {/* Repo: text-xs (16px) */}
          <div className="h-4 w-2/5 bg-muted" />
          {/* Stats: VoteButton (20px) + icons */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-12 bg-muted" />
            <div className="h-3.5 w-10 bg-muted" />
            <div className="h-3.5 w-10 bg-muted" />
          </div>
        </div>
        {/* Description: text-xs line-clamp-2 → 2×16px = 32px */}
        <div className="space-y-1">
          <div className="h-3.5 w-full bg-muted" />
          <div className="h-3.5 w-4/5 bg-muted" />
        </div>
      </div>
    </div>
  );
}

function MarketplaceCardSkeleton() {
  return (
    <div className="border border-border bg-card animate-pulse py-0">
      {/* CardHeader: grid gap-2, p-4 */}
      <div className="grid gap-2 p-4">
        <div className="flex flex-col gap-1.5">
          {/* Title row: leading-6 (24px) + bookmark (24px) + external link h-7 (28px) → 28px */}
          <div className="flex items-start justify-between gap-2">
            <div className="h-6 w-3/5 bg-muted" />
            <div className="flex items-center gap-1">
              <div className="p-1"><div className="h-4 w-4 bg-muted" /></div>
              <div className="h-7 w-7 bg-muted" />
            </div>
          </div>
          {/* Stats: VoteButton (20px) + stars + plugins */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-12 bg-muted" />
            <div className="h-3.5 w-10 bg-muted" />
            <div className="h-3.5 w-16 bg-muted" />
          </div>
        </div>
        {/* Description: text-xs line-clamp-2 → 32px */}
        <div className="space-y-1">
          <div className="h-3.5 w-full bg-muted" />
          <div className="h-3.5 w-3/5 bg-muted" />
        </div>
      </div>
    </div>
  );
}

function McpCardSkeleton() {
  return (
    <div className="border border-border bg-card animate-pulse py-0">
      {/* CardHeader: grid gap-2, p-4 */}
      <div className="grid gap-2 p-4">
        <div className="flex flex-col gap-1.5">
          {/* Title row: leading-6 (24px) + bookmark (24px) + external link h-7 (28px) → 28px */}
          <div className="flex items-start justify-between gap-2">
            <div className="h-6 w-3/5 bg-muted" />
            <div className="flex items-center gap-1">
              <div className="p-1"><div className="h-4 w-4 bg-muted" /></div>
              <div className="h-7 w-7 bg-muted" />
            </div>
          </div>
          {/* Slug: text-xs (16px) */}
          <div className="h-4 w-2/5 bg-muted" />
          {/* Stats: VoteButton (20px) + stars */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-12 bg-muted" />
            <div className="h-3.5 w-10 bg-muted" />
          </div>
        </div>
        {/* Description: text-xs line-clamp-2 → 32px */}
        <div className="space-y-1">
          <div className="h-3.5 w-full bg-muted" />
          <div className="h-3.5 w-3/5 bg-muted" />
        </div>
      </div>
    </div>
  );
}

// ── In-feed ad skeleton ───────────────────────────────────────────────

function InFeedAdSkeleton() {
  return (
    <div className="h-full border border-border bg-card animate-pulse py-4 flex flex-col">
      <div className="px-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-muted shrink-0" />
          <div className="h-7 w-3/4 bg-muted" />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-muted" />
          <div className="h-4 w-full bg-muted" />
          <div className="h-4 w-2/3 bg-muted" />
        </div>
      </div>
      <div className="px-5 pt-3 mt-auto space-y-3">
        <div className="flex gap-1.5">
          <div className="h-6 w-16 bg-muted" />
          <div className="h-6 w-20 bg-muted" />
        </div>
        <div className="pt-3 border-t border-border">
          <div className="h-4 w-24 bg-muted" />
        </div>
      </div>
      <div className="px-5 pt-8">
        <div className="h-5 w-20 bg-muted" />
      </div>
    </div>
  );
}

// ── Grid builder ──────────────────────────────────────────────────────
// Mirrors the exact ad-insertion algorithm from skills-grid / marketplace-grid.

function buildGridItems(count: number, CardSkeleton: React.FC) {
  const cols = 3;
  const ad1Pos = cols * 1; // index 3
  const totalSlots = count + 4; // 2 ads × 2 rows each
  const totalRows = Math.ceil(totalSlots / cols);
  const ad2Row = totalRows - 3;
  const ad2Pos = ad2Row * cols + 2;

  const items: React.ReactNode[] = [];
  let inserted = 0;
  const adPositions = [ad1Pos, ad2Pos];

  for (let i = 0; i < count; i++) {
    const currentIndex = i + inserted * 2;
    if (inserted < 2 && currentIndex >= adPositions[inserted]) {
      items.push(
        <div key={`ad-${inserted}`} className="row-span-2">
          <InFeedAdSkeleton />
        </div>
      );
      inserted++;
    }
    items.push(<CardSkeleton key={i} />);
  }

  while (inserted < 2) {
    items.push(
      <div key={`ad-${inserted}`} className="row-span-2">
        <InFeedAdSkeleton />
      </div>
    );
    inserted++;
  }

  return items;
}

// ── Search bar skeleton ───────────────────────────────────────────────

function SearchBarSkeleton() {
  return (
    <div className="my-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 h-8 bg-muted border border-border" />
        <div className="w-[160px] h-8 bg-muted border border-border" />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────

interface ListingGridSkeletonProps {
  variant?: "skill" | "marketplace" | "mcp";
  count?: number;
  showFeatured?: boolean;
}

export function ListingGridSkeleton({
  variant = "marketplace",
  count,
  showFeatured = false,
}: ListingGridSkeletonProps) {
  const CardSkeleton =
    variant === "skill"
      ? SkillCardSkeleton
      : variant === "mcp"
        ? McpCardSkeleton
        : MarketplaceCardSkeleton;

  const itemCount = count ?? (variant === "skill" ? 26 : 23);

  return (
    <div className="container mx-auto px-4 pt-0 pb-4">
      {showFeatured && <FeaturedSkeleton />}

      <SearchBarSkeleton />

      {/* Results bar: text-xs (h-4) + invisible text-sm button (h-5) */}
      <div className="flex items-center justify-between mt-6 mb-3">
        <div className="h-4 w-28 bg-muted animate-pulse" />
        <div className="h-5 w-20 invisible" />
      </div>

      {/* Card grid with in-feed ad skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildGridItems(itemCount, CardSkeleton)}
      </div>
    </div>
  );
}
