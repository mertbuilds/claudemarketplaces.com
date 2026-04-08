"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

export interface SortOption {
  value: string;
  label: string;
}

interface ListingSearchBarProps {
  placeholder: string;
  sortOptions: SortOption[];
  defaultSort: string;
}

export function ListingSearchBar({
  placeholder,
  sortOptions,
  defaultSort,
}: ListingSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const urlSearch = searchParams.get("search") || "";
  const lastPushed = useRef(urlSearch);

  // Sync URL → input only for external changes (back/forward, clear filters)
  useEffect(() => {
    if (urlSearch !== lastPushed.current) {
      setSearchQuery(urlSearch);
    }
    lastPushed.current = urlSearch;
  }, [urlSearch]);

  const sortBy = searchParams.get("sort") || defaultSort;
  const debouncedSearch = useDebounce(searchQuery, 300);

  const updateURL = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const prevRef = useRef(debouncedSearch);
  useEffect(() => {
    if (prevRef.current !== debouncedSearch) {
      prevRef.current = debouncedSearch;
      lastPushed.current = debouncedSearch || "";
      updateURL({ search: debouncedSearch || null, page: null });
    }
  }, [debouncedSearch, updateURL]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="!h-8 pl-9 pr-8 text-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <Select
        value={sortBy}
        onValueChange={(value) =>
          updateURL({ sort: value === defaultSort ? null : value, page: null })
        }
      >
        <SelectTrigger size="sm" className="w-[160px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
