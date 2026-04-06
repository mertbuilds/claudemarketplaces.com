"use client";

import { useState, useCallback } from "react";
import { useBookmarkContext } from "@/lib/contexts/bookmark-context";

export function useBookmark(itemType: string, itemId: string) {
  const { userBookmarks, isAuthenticated, loaded, setUserBookmark } = useBookmarkContext();
  const [isLoading, setIsLoading] = useState(false);

  const isBookmarked = userBookmarks[itemId] ?? false;

  const toggleBookmark = useCallback(async () => {
    if (!isAuthenticated) return;
    if (isLoading) return;

    setIsLoading(true);
    const prev = isBookmarked;
    setUserBookmark(itemId, !prev);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId }),
      });

      if (!res.ok) {
        setUserBookmark(itemId, prev);
      } else {
        const data = await res.json();
        setUserBookmark(itemId, data.bookmarked);
      }
    } catch {
      setUserBookmark(itemId, prev);
    } finally {
      setIsLoading(false);
    }
  }, [itemType, itemId, isBookmarked, isAuthenticated, isLoading, setUserBookmark]);

  return { isBookmarked, toggleBookmark, isLoading, isAuthenticated, loaded };
}
