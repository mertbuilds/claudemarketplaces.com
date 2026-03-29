"use client";

import { useState, useCallback } from "react";
import { useVoteContext } from "@/lib/contexts/vote-context";

export function useVote(itemType: string, itemId: string, initialVoteCount: number) {
  const { userVotes, isAuthenticated, loaded, setUserVote } = useVoteContext();
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [isLoading, setIsLoading] = useState(false);

  const userVote = userVotes[itemId] ?? null;

  const vote = useCallback(
    async (value: 1 | -1) => {
      if (!isAuthenticated) return;
      if (isLoading) return;

      setIsLoading(true);

      const prevVoteCount = voteCount;
      const prevUserVote = userVote;

      const newValue = userVote === value ? 0 : value;

      let countDelta = 0;
      if (newValue === 0) {
        countDelta = -(prevUserVote ?? 0);
      } else if (prevUserVote === null) {
        countDelta = newValue;
      } else {
        countDelta = newValue - prevUserVote;
      }

      setVoteCount((prev) => prev + countDelta);
      setUserVote(itemId, newValue === 0 ? null : (newValue as 1 | -1));

      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemType, itemId, value: newValue }),
        });

        if (!res.ok) {
          setVoteCount(prevVoteCount);
          setUserVote(itemId, prevUserVote);
        } else {
          const data = await res.json();
          setVoteCount(data.voteCount);
          setUserVote(itemId, data.userVote);
        }
      } catch {
        setVoteCount(prevVoteCount);
        setUserVote(itemId, prevUserVote);
      } finally {
        setIsLoading(false);
      }
    },
    [itemType, itemId, voteCount, userVote, isAuthenticated, isLoading, setUserVote]
  );

  return { voteCount, userVote, vote, isLoading, isAuthenticated, loaded };
}
