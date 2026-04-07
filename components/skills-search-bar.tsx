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
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function SkillsSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const sortBy =
    (searchParams.get("sort") as "installs" | "stars" | "votes") || "installs";
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
      updateURL({ search: debouncedSearch || null, page: null });
    }
  }, [debouncedSearch, updateURL]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="!h-8 pl-9 text-xs"
        />
      </div>
      <Select
        value={sortBy}
        onValueChange={(value: "installs" | "stars" | "votes") =>
          updateURL({ sort: value === "installs" ? null : value, page: null })
        }
      >
        <SelectTrigger size="sm" className="w-[160px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="installs">Most installed</SelectItem>
          <SelectItem value="stars">Most stars</SelectItem>
          <SelectItem value="votes">Most voted</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
