"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

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
    <div className="mb-8">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Featured
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: 1inch */}
        <Card ref={oneinchRef} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Image src="/1inch.png" alt="1inch" width={16} height={16} className="h-4 w-4" />
              <CardTitle className="text-base">
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
            <CardDescription className="text-sm">
              Give it real-time data across 13 networks, powered by 1inch.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Install now →
            </span>
          </CardHeader>
        </Card>

        {/* Card 2: AppSignal */}
        <Card ref={appsignalRef} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Image src="/appsignal.svg" alt="AppSignal" width={16} height={16} className="h-4 w-4" />
              <CardTitle className="text-base">
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
            <CardDescription className="text-sm">
              Monitor with ease. Code with confidence.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Start Free Trial →
            </span>
          </CardHeader>
        </Card>

        {/* Card 3: Ideabrowser */}
        <Card ref={ideabrowserRef} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Image src="/ideabrowser-symbol.webp" alt="ideabrowser.com" width={16} height={16} className="h-4 w-4" />
              <CardTitle className="text-base">
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
            <CardDescription className="text-sm">
              Find trending startup ideas with real demand. Launch with a team of AI agents.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Get trending startup ideas →
            </span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
