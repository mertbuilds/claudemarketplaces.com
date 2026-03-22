"use client";

import { useVote } from "@/lib/hooks/use-vote";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface VoteButtonProps {
  itemType: string;
  itemId: string;
  initialVoteCount?: number;
}

export function VoteButton({
  itemType,
  itemId,
  initialVoteCount = 0,
}: VoteButtonProps) {
  const { voteCount, userVote, vote, isLoading, isAuthenticated, loaded } = useVote(
    itemType,
    itemId
  );
  const router = useRouter();
  const displayCount = loaded ? voteCount : initialVoteCount;

  const handleVote = (value: 1 | -1) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    vote(value);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleVote(1)}
        disabled={isLoading}
        className={`p-0.5 rounded-sm transition-colors cursor-pointer ${
          userVote === 1
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        aria-label="Upvote"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <span
        className={`text-xs font-medium tabular-nums ${
          displayCount > 0
            ? "text-foreground"
            : displayCount < 0
              ? "text-destructive"
              : "text-muted-foreground"
        }`}
      >
        {displayCount}
      </span>
      <button
        onClick={handleVote(-1)}
        disabled={isLoading}
        className={`p-0.5 rounded-sm transition-colors cursor-pointer ${
          userVote === -1
            ? "text-destructive bg-destructive/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        aria-label="Downvote"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
