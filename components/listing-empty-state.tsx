"use client";

interface ListingEmptyStateProps {
  message: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ListingEmptyState({
  message,
  hasActiveFilters,
  onClearFilters,
}: ListingEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">{message}</p>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
