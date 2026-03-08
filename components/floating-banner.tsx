"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useOpenPanel } from "@openpanel/nextjs";
import { useAdViewTracking } from "@/lib/hooks/use-ad-tracking";

const banners = [
  {
    id: "x_follow",
    text: "Follow @mertduzgun for updates",
    cta: "Follow",
    href: "https://x.com/mertduzgun",
    external: true,
  },
  {
    id: "advertise",
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
  const bannerViewRef = useAdViewTracking("floating_banner_viewed");
  const { track } = useOpenPanel();

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
    <div ref={bannerViewRef} className="fixed bottom-3 left-3 right-3 sm:left-auto sm:bottom-5 sm:right-5 z-50 max-w-[384px] bg-background border border-primary/30 rounded-md p-4 flex items-center gap-3 shadow-lg">
      <div
        className={`flex items-center gap-3 flex-1 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        <p className="text-sm font-medium text-foreground leading-snug">
          {banner.text}
        </p>
        {banner.external ? (
          <a
            href={banner.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("floating_banner_clicked", { banner: banner.id })}
            className="shrink-0 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium"
          >
            {banner.cta}
          </a>
        ) : (
          <Link
            href={banner.href}
            onClick={() => track("floating_banner_clicked", { banner: banner.id })}
            className="shrink-0 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium"
          >
            {banner.cta}
          </Link>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-0.5 hover:bg-muted rounded-sm transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}
