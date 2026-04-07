"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { AdConfig } from "@/lib/ads";

export function SponsoredInFeedCard({ ad }: { ad: AdConfig }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && typeof window.op === "function") {
          window.op!("track", "infeed_card_viewed", { card: ad.id });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ad.id]);

  return (
    <Card ref={cardRef} className="relative h-full bg-white border-primary transition-all hover:shadow-lg overflow-auto py-4 gap-0 flex flex-col">
      <CardHeader className="px-5 py-0 gap-3">
        <div className="flex items-center gap-2">
          <Image src={ad.icon} alt={ad.title} width={24} height={24} className="h-6 w-6 shrink-0" />
          <CardTitle className="text-xl line-clamp-2 flex-1 min-w-0 leading-7">
            <a
              href={ad.href}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0 cursor-pointer"
              onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: ad.id }); }}
            >
              {ad.title}
            </a>
          </CardTitle>
        </div>
        <CardDescription className="text-base line-clamp-3">
          {ad.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-0 pt-3 mt-auto">
        <div className="flex flex-col gap-3">
          {ad.tags && ad.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ad.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-border">
            <a
              href={ad.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 text-base font-medium hover:underline"
              onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: ad.id }); }}
            >
              {ad.cta}
            </a>
          </div>
        </div>
      </CardContent>
      <div className="px-5 pt-8">
        <Badge variant="outline" className="text-xs">
          Sponsored
        </Badge>
      </div>
    </Card>
  );
}
