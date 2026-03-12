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
export function IdeabrowserInFeedCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && typeof window.op === "function") {
          window.op!("track", "infeed_card_viewed", { card: "ideabrowser" });
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
          <div className="flex items-center justify-between gap-2">
            <Image src="/ideabrowser-symbol.webp" alt="ideabrowser.com" width={16} height={16} className="h-5 w-5 shrink-0" />
            <CardTitle className="text-xl line-clamp-2 flex-1 min-w-0 leading-7">
              <a
                href="https://www.ideabrowser.com/join?utm_source=claudecode_marketplace&utm_medium=paid&utm_campaign=march-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 cursor-pointer"
                onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: "ideabrowser" }); }}
              >
                ideabrowser.com
              </a>
            </CardTitle>
            <Badge variant="outline" className="shrink-0 text-xs">
              Sponsored
            </Badge>
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          Find trending startup ideas with real demand. Launch with a team of AI agents.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs capitalize">
              startups
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              ai agents
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              ideas
            </Badge>
          </div>
          <div className="mt-2 pt-3 border-t border-border">
            <a
              href="https://www.ideabrowser.com/join?utm_source=claudecode_marketplace&utm_medium=paid&utm_campaign=march-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              onClick={() => { if (typeof window.op === "function") window.op!("track", "infeed_card_clicked", { card: "ideabrowser" }); }}
            >
              Get trending startup ideas →
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
