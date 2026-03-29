"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type VoteValue = 1 | -1 | null;

interface VoteContextValue {
  userVotes: Record<string, VoteValue>;
  isAuthenticated: boolean;
  loaded: boolean;
  setUserVote: (itemId: string, value: VoteValue) => void;
}

const VoteContext = createContext<VoteContextValue>({
  userVotes: {},
  isAuthenticated: false,
  loaded: false,
  setUserVote: () => {},
});

export function useVoteContext() {
  return useContext(VoteContext);
}

interface VoteProviderProps {
  itemType: string;
  itemIds: string[];
  children: React.ReactNode;
}

export function VoteProvider({ itemType, itemIds, children }: VoteProviderProps) {
  const [userVotes, setUserVotes] = useState<Record<string, VoteValue>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      const authed = !!user;
      setIsAuthenticated(authed);

      if (!authed || itemIds.length === 0) {
        setLoaded(true);
        return;
      }

      fetch(`/api/votes/batch?itemType=${itemType}&itemIds=${itemIds.map(encodeURIComponent).join(",")}`)
        .then((res) => res.json())
        .then((data) => {
          const votes: Record<string, VoteValue> = {};
          for (const id of itemIds) {
            votes[id] = data.votes[id] ?? null;
          }
          setUserVotes(votes);
          setLoaded(true);
        })
        .catch((err) => {
          console.error(err);
          setLoaded(true);
        });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType, itemIds.join(",")]);

  const setUserVote = useCallback((itemId: string, value: VoteValue) => {
    setUserVotes((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  return (
    <VoteContext.Provider value={{ userVotes, isAuthenticated, loaded, setUserVote }}>
      {children}
    </VoteContext.Provider>
  );
}
