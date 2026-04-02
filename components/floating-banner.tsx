"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
const banners = [
  {
    id: "mockhero",
    text: "MockHero — generate realistic test data with one API call. 156 field types, 22 locales, JSON/CSV/SQL output.",
    cta: "Try Free",
    href: "https://mockhero.dev/?utm_source=claudemarketplaces&utm_medium=floating_banner&utm_campaign=mar_apr2026",
    icon: "/mockhero.png",
    external: true,
  },
  {
    id: "ideabrowser",
    text: "ideabrowser.com — find trending startup ideas with real demand",
    cta: "Try it",
    href: "https://www.ideabrowser.com/join?utm_source=claudecode_marketplace&utm_medium=paid&utm_campaign=march-2026",
    icon: "/ideabrowser-symbol.webp",
    external: true,
  },
];

export function FloatingBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (typeof window.op === "function") {
        window.op!("track", "floating_banner_viewed");
        clearInterval(id);
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

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
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:bottom-5 sm:right-5 z-50 max-w-[384px] sm:max-w-[480px] bg-background border border-primary/30 rounded-md p-4 flex items-center gap-3 shadow-lg">
      <div
        className={`flex items-center gap-3 flex-1 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        <Image src={banner.icon} alt={banner.id} width={20} height={20} className="shrink-0 h-5 w-5 rounded-sm" />
        <p className="text-sm font-medium text-foreground leading-snug">
          {banner.text}
        </p>
        {banner.external ? (
          <a
            href={banner.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { if (typeof window.op === "function") window.op!("track", "floating_banner_clicked", { banner: banner.id }); }}
            className="shrink-0 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium"
          >
            {banner.cta}
          </a>
        ) : (
          <Link
            href={banner.href}
            onClick={() => { if (typeof window.op === "function") window.op!("track", "floating_banner_clicked", { banner: banner.id }); }}
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
