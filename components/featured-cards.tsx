"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
export function FeaturedCards() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && typeof window.op === "function") {
          window.op!("track", "featured_section_viewed");
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="mb-8">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Featured
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Ideabrowser */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer">
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

        {/* Card 2: supastarter */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Image src="/supastarter-logo.svg" alt="supastarter" width={16} height={16} className="h-4 w-4" />
              <CardTitle className="text-base">
                <a
                  href="https://supastarter.dev?atp=vinena"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 cursor-pointer"
                  onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "supastarter" }); }}
                >
                  supastarter
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Production-ready SaaS starter kit for Next.js and Nuxt. Auth, billing, i18n, multi-tenancy — save months of setup.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Get supastarter →
            </span>
          </CardHeader>
        </Card>

        {/* Card 3: Ideabrowser Workshop */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Image src="/ideabrowser-symbol.webp" alt="ideabrowser.com" width={16} height={16} className="h-4 w-4" />
              <CardTitle className="text-base">
                <a
                  href="https://www.ideabrowser.com/workshop/build-a-startup-with-me-Mar-25?utm_source=claudecode_marketplace&utm_medium=paid&utm_campaign=march-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 cursor-pointer"
                  onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "ideabrowser-workshop" }); }}
                >
                  How to build a startup using AI
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Free workshop to use AI to turn ideas into companies. See the tools and workflows to build businesses.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Join free workshop →
            </span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
