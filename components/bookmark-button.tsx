"use client";

import { useBookmark } from "@/lib/hooks/use-bookmark";
import { Bookmark } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookmarkButtonProps {
  itemType: string;
  itemId: string;
}

export function BookmarkButton({ itemType, itemId }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isLoading, isAuthenticated } = useBookmark(itemType, itemId);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    toggleBookmark();
  };

  const button = (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-1 rounded-sm transition-colors cursor-pointer ${
        isBookmarked
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
    >
      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
    </button>
  );

  if (!isAuthenticated) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>Login to save items</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
