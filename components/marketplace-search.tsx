"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface MarketplaceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarketplaceSearch({ value, onChange }: MarketplaceSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        placeholder="Search by name, description, or category..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex h-9 w-full rounded-md border border-border bg-input px-3 py-1 pl-9 pr-9 text-sm shadow-md shadow-primary-foreground/5 transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors",
            "hover:text-foreground"
          )}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
