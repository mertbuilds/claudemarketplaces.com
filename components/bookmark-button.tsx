"use client";

import { useBookmark } from "@/lib/hooks/use-bookmark";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  const { isBookmarked, toggleBookmark, isLoading, isAuthenticated, loaded } = useBookmark(itemType, itemId);
  const router = useRouter();
  const pathname = usePathname();
  const [showSavedTip, setShowSavedTip] = useState(false);
  const clickedRef = useRef(false);

  useEffect(() => {
    if (isBookmarked && clickedRef.current) {
      setShowSavedTip(true);
      const timer = setTimeout(() => setShowSavedTip(false), 3000);
      clickedRef.current = false;
      return () => clearTimeout(timer);
    }
    clickedRef.current = false;
  }, [isBookmarked]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    clickedRef.current = true;
    setShowSavedTip(false);
    toggleBookmark();
  };

  if (!loaded) {
    return (
      <div className="p-1">
        <Bookmark className="h-4 w-4 text-muted-foreground/30" />
      </div>
    );
  }

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

  return (
    <TooltipProvider>
      <Tooltip open={showSavedTip} onOpenChange={setShowSavedTip}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent onClick={(e) => e.stopPropagation()}>
          <p>
            Saved! View all in{" "}
            <Link href="/saved" className="underline font-medium">
              your profile
            </Link>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
