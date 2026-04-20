"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";
export function AdvertiseInFeedCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && typeof window.op === "function") {
          window.op!("track", "infeed_card_viewed", { card: "advertise" });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Card ref={cardRef} className="relative h-full bg-white border-primary transition-all hover:shadow-lg overflow-auto">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl line-clamp-2 flex-1 min-w-0 leading-7">
              <Link
                href="/advertise"
                className="after:absolute after:inset-0"
                onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: "advertise" }); }}
              >
                Your product here
              </Link>
            </CardTitle>
            <Badge variant="outline" className="shrink-0 text-xs">
              Ad Space
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Megaphone className="h-4 w-4" />
            <span className="text-sm font-mono tabular-nums">From $499/mo</span>
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          Reach 105,000+ Claude Code developers every month. 100% organic traffic, public analytics, under $0.50 per click on All Placements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
              Only 2 slots left
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              sponsorship
            </Badge>
          </div>
          <div className="mt-2 pt-3 border-t border-border">
            <Link
              href="/advertise"
              className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: "advertise" }); }}
            >
              See placements →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
