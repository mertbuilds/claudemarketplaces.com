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
export function SupastarterInFeedCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && typeof window.op === "function") {
          window.op!("track", "infeed_card_viewed", { card: "supastarter" });
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
            <Image src="/supastarter-logo.svg" alt="supastarter" width={16} height={16} className="h-5 w-5 shrink-0" />
            <CardTitle className="text-xl line-clamp-2 flex-1 min-w-0 leading-7">
              <a
                href="https://supastarter.dev?atp=vinena"
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0"
                onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: "supastarter" }); }}
              >
                supastarter
              </a>
            </CardTitle>
            <Badge variant="outline" className="shrink-0 text-xs">
              Sponsored
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-sm">SaaS starter kit for Next.js and Nuxt</span>
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          Production-ready SaaS starter kit. Auth, billing, i18n, multi-tenancy, and more — save months of setup. Pay once, build unlimited.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs capitalize">
              next.js
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              saas
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              starter kit
            </Badge>
          </div>
          <div className="mt-2 pt-3 border-t border-border">
            <a
              href="https://supastarter.dev?atp=vinena"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: "supastarter" }); }}
            >
              Get supastarter →
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
