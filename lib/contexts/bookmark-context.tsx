"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface BookmarkContextValue {
  userBookmarks: Record<string, boolean>;
  isAuthenticated: boolean;
  loaded: boolean;
  setUserBookmark: (itemId: string, value: boolean) => void;
}

const BookmarkContext = createContext<BookmarkContextValue>({
  userBookmarks: {},
  isAuthenticated: false,
  loaded: false,
  setUserBookmark: () => {},
});

export function useBookmarkContext() {
  return useContext(BookmarkContext);
}

interface BookmarkProviderProps {
  itemType: string;
  itemIds: string[];
  initialBookmarks?: Record<string, boolean>;
  children: React.ReactNode;
}

export function BookmarkProvider({ itemType, itemIds, initialBookmarks, children }: BookmarkProviderProps) {
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>(initialBookmarks ?? {});
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialBookmarks);
  const [loaded, setLoaded] = useState(!!initialBookmarks);

  useEffect(() => {
    if (initialBookmarks) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      const authed = !!user;
      setIsAuthenticated(authed);

      if (!authed || itemIds.length === 0) {
        setLoaded(true);
        return;
      }

      fetch(`/api/bookmarks/batch?itemType=${itemType}&itemIds=${itemIds.map(encodeURIComponent).join(",")}`)
        .then((res) => res.json())
        .then((data) => {
          const bookmarks: Record<string, boolean> = {};
          for (const id of itemIds) {
            bookmarks[id] = data.bookmarks[id] ?? false;
          }
          setUserBookmarks(bookmarks);
          setLoaded(true);
        })
        .catch((err) => {
          console.error(err);
          setLoaded(true);
        });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType, itemIds.join(","), !!initialBookmarks]);

  const setUserBookmark = useCallback((itemId: string, value: boolean) => {
    setUserBookmarks((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  return (
    <BookmarkContext.Provider value={{ userBookmarks, isAuthenticated, loaded, setUserBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}
