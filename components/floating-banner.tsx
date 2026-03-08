"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const banners = [
  {
    text: "Follow @mertduzgun for updates",
    cta: "Follow",
    href: "https://x.com/mertduzgun",
    external: true,
  },
  {
    text: "Promote your product here",
    cta: "Advertise",
    href: "/advertise",
    external: false,
  },
];

export function FloatingBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % banners.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const banner = banners[activeIndex];

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 max-w-[480px] bg-background border border-primary/30 rounded-md p-5 flex items-center gap-4 shadow-lg">
      <div
        className={`flex items-center gap-4 flex-1 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        <p className="text-base font-medium text-foreground leading-snug">
          {banner.text}
        </p>
        {banner.external ? (
          <a
            href={banner.href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-medium"
          >
            {banner.cta}
          </a>
        ) : (
          <Link
            href={banner.href}
            className="shrink-0 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-medium"
          >
            {banner.cta}
          </Link>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-1 hover:bg-muted rounded-sm transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
