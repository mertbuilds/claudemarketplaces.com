"use client";

interface ListingResultsBarProps {
  count: number;
  label: string;
  pluralLabel: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ListingResultsBar({
  count,
  label,
  pluralLabel,
  hasActiveFilters,
  onClearFilters,
}: ListingResultsBarProps) {
  return (
    <div className="flex items-center justify-between mt-6 mb-3">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {count} {count === 1 ? label : pluralLabel}
      </p>
      <button
        onClick={onClearFilters}
        className={`text-sm text-primary hover:underline ${hasActiveFilters ? "visible" : "invisible"}`}
      >
        Clear filters
      </button>
    </div>
  );
}
