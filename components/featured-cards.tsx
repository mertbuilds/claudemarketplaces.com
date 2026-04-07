"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

function useImpression(card: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && typeof window.op === "function") {
          window.op!("track", "featured_card_viewed", { card });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [card]);
  return ref;
}

export function FeaturedCards() {
  const oneinchRef = useImpression("1inch");
  const appsignalRef = useImpression("appsignal");
  const ideabrowserRef = useImpression("ideabrowser");

  return (
    <div className="mb-4">
      <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground mb-2">
        Featured
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
        {/* Card 1: 1inch */}
        <Card ref={oneinchRef} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer py-1 gap-0">
          <CardHeader className="px-3 py-2 gap-2">
            <div className="flex gap-2 items-start">
              <Image src="/1inch.png" alt="1inch" width={14} height={14} className="h-3.5 w-3.5 shrink-0 mt-[0.15rem]" />
              <CardTitle className="text-sm leading-snug">
                <a
                  href="https://business.1inch.com/1inch-mcp?utm_source=claudemarketplaces&utm_medium=cpm&utm_campaign=1inch-mcp-awareness&utm_content=pinned-card"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 cursor-pointer"
                  onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "1inch" }); }}
                >
                  Make your agent a DeFi expert
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-xs line-clamp-2">
              Real-time data across 13 networks, powered by 1inch.
            </CardDescription>
            <span className="text-xs font-medium text-primary mt-auto">
              Install now →
            </span>
          </CardHeader>
        </Card>

        {/* Card 2: AppSignal */}
        <Card ref={appsignalRef} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer py-1 gap-0">
          <CardHeader className="px-3 py-2 gap-2">
            <div className="flex gap-2 items-start">
              <Image src="/appsignal.svg" alt="AppSignal" width={14} height={14} className="h-3.5 w-3.5 shrink-0 mt-[0.15rem]" />
              <CardTitle className="text-sm leading-snug">
                <a
                  href="https://www.appsignal.com/?utm_source=native&utm_medium=paid&utm_campaign=claudemarketplaces"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 cursor-pointer"
                  onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "appsignal" }); }}
                >
                  AppSignal
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-xs line-clamp-2">
              Monitor with ease. Code with confidence.
            </CardDescription>
            <span className="text-xs font-medium text-primary mt-auto">
              Start Free Trial →
            </span>
          </CardHeader>
        </Card>

        {/* Card 3: Ideabrowser */}
        <Card ref={ideabrowserRef} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer py-1 gap-0">
          <CardHeader className="px-3 py-2 gap-2">
            <div className="flex gap-2 items-start">
              <Image src="/ideabrowser-symbol.webp" alt="ideabrowser.com" width={14} height={14} className="h-3.5 w-3.5 shrink-0 mt-[0.15rem]" />
              <CardTitle className="text-sm leading-snug">
                <a
                  href="https://www.ideabrowser.com/join?utm_source=claudecode_marketplace&utm_medium=paid&utm_campaign=march-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 cursor-pointer"
                  onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "ideabrowser" }); }}
                >
                  ideabrowser.com
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-xs line-clamp-2">
              Trending startup ideas with real demand. Launch with AI agents.
            </CardDescription>
            <span className="text-xs font-medium text-primary mt-auto">
              Get trending ideas →
            </span>
          </CardHeader>
        </Card>

        {/* Card 4: Advertise CTA */}
        <Card className="relative border-dashed border-muted-foreground/25 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer py-1 gap-0">
          <CardHeader className="px-3 py-2 gap-2">
            <CardTitle className="text-sm leading-snug">
              <Link
                href="/advertise"
                className="after:absolute after:inset-0 cursor-pointer"
                onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "advertise-cta" }); }}
              >
                Your product here
              </Link>
            </CardTitle>
            <CardDescription className="text-xs line-clamp-2">
              Show your product to 100K+ AI developers monthly.
            </CardDescription>
            <span className="text-xs font-medium text-primary mt-auto">
              Advertise →
            </span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
