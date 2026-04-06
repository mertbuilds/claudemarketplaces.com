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
    <Card ref={cardRef} className="relative h-full bg-white border-primary transition-all hover:shadow-lg overflow-auto">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Image src={ad.icon} alt={ad.title} width={16} height={16} className="h-5 w-5 shrink-0" />
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
            <Badge variant="outline" className="shrink-0 text-xs">
              Sponsored
            </Badge>
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {ad.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex flex-col gap-3">
          {ad.tags && ad.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ad.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-2 pt-3 border-t border-border">
            <a
              href={ad.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: ad.id }); }}
            >
              {ad.cta}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
