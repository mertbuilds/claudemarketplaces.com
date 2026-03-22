"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type VoteValue = 1 | -1 | null;

export function useVote(itemType: string, itemId: string) {
  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState<VoteValue>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Check auth status and fetch initial vote data
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });

    // Fetch vote data
    fetch(
      `/api/votes?itemType=${itemType}&itemId=${encodeURIComponent(itemId)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setVoteCount(data.voteCount ?? 0);
        setUserVote(data.userVote ?? null);
        setLoaded(true);
      })
      .catch(console.error);
  }, [itemType, itemId]);

  const vote = useCallback(
    async (value: 1 | -1) => {
      if (!isAuthenticated) return;
      if (isLoading) return;

      setIsLoading(true);

      // Optimistic update
      const prevVoteCount = voteCount;
      const prevUserVote = userVote;

      const newValue = userVote === value ? 0 : value; // Toggle off if same

      // Calculate optimistic count
      let countDelta = 0;
      if (newValue === 0) {
        // Removing vote
        countDelta = -(prevUserVote ?? 0);
      } else if (prevUserVote === null) {
        // New vote
        countDelta = newValue;
      } else {
        // Changing vote
        countDelta = newValue - prevUserVote;
      }

      setVoteCount((prev) => prev + countDelta);
      setUserVote(newValue === 0 ? null : (newValue as 1 | -1));

      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemType, itemId, value: newValue }),
        });

        if (!res.ok) {
          // Revert on error
          setVoteCount(prevVoteCount);
          setUserVote(prevUserVote);
        } else {
          const data = await res.json();
          setVoteCount(data.voteCount);
          setUserVote(data.userVote);
        }
      } catch {
        // Revert on error
        setVoteCount(prevVoteCount);
        setUserVote(prevUserVote);
      } finally {
        setIsLoading(false);
      }
    },
    [itemType, itemId, voteCount, userVote, isAuthenticated, isLoading]
  );

  return { voteCount, userVote, vote, isLoading, isAuthenticated, loaded };
}
