"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useOpenPanel } from "@openpanel/nextjs";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "site-banner-dismissed";

export function SiteBanner() {
  const [visible, setVisible] = useState(false);
  const { track } = useOpenPanel();

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
      track("banner_view");
    }
  }, [track]);

  function handleDismiss() {
    track("banner_dismiss");
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className={cn(
        "relative w-full bg-primary px-4 py-3 text-primary-foreground",
        "flex items-start justify-between gap-3",
        "sm:items-center sm:px-6",
      )}
    >
      <p className="text-sm leading-relaxed sm:text-center sm:flex-1">
        Anthropic wants me to take down this website. I&apos;ll share all this
        data and validate the best plugins myself on a new website.{" "}
        <a
          href="https://x.com/mertduzgun"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 font-medium hover:opacity-80"
          onClick={() => track("banner_x_click")}
        >
          Follow me on X
        </a>{" "}
        or{" "}
        <a
          href="https://mertbuilds.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 font-medium hover:opacity-80"
          onClick={() => track("banner_newsletter_click")}
        >
          subscribe to the newsletter
        </a>{" "}
        to get the updates.
      </p>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="shrink-0 rounded-sm p-1 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
