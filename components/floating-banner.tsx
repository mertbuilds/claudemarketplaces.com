"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { FLOATING_BANNERS } from "@/lib/ads";

export function FloatingBanner({ initialIndex }: { initialIndex: number }) {
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [fading, setFading] = useState(false);

  // Fire one impression per banner per page load. Uses a ref to track which
  // banners have already been counted so rotations don't inflate the number.
  const trackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (dismissed) return;
    const banner = FLOATING_BANNERS[activeIndex];
    if (trackedRef.current.has(banner.id)) return;
    const fire = () => {
      if (typeof window.op !== "function") return false;
      window.op!("track", "floating_banner_viewed", { banner: banner.id });
      trackedRef.current.add(banner.id);
      return true;
    };
    if (fire()) return;
    const id = setInterval(() => {
      if (fire()) clearInterval(id);
    }, 200);
    return () => clearInterval(id);
  }, [activeIndex, dismissed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % FLOATING_BANNERS.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const banner = FLOATING_BANNERS[activeIndex];

  const handleClick = () => {
    if (typeof window.op === "function") {
      window.op!("track", "floating_banner_clicked", { banner: banner.id });
    }
  };

  const cardContent = (
    <div
      className={`flex items-center gap-3 flex-1 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <Image src={banner.icon} alt={banner.id} width={20} height={20} className="shrink-0 h-5 w-5 rounded-sm" />
      <p className="text-sm font-medium text-foreground leading-snug">
        {banner.text}
      </p>
      <span className="shrink-0 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium">
        {banner.cta}
      </span>
    </div>
  );

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:bottom-5 sm:right-5 z-50 max-w-[384px] sm:max-w-[480px] bg-background border border-primary/30 rounded-md shadow-lg flex items-center">
      {banner.external ? (
        <a
          href={banner.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex items-center gap-3 flex-1 p-4 cursor-pointer"
        >
          {cardContent}
        </a>
      ) : (
        <Link
          href={banner.href}
          onClick={handleClick}
          className="flex items-center gap-3 flex-1 p-4 cursor-pointer"
        >
          {cardContent}
        </Link>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDismissed(true);
        }}
        className="shrink-0 p-2 mr-2 hover:bg-muted rounded-sm transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}
