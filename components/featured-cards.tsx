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
        {/* Card 1: Goilerplate */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Image src="/go-gopher.svg" alt="Go Gopher" width={16} height={16} className="h-4 w-4" />
              <CardTitle className="text-base">
                <a
                  href="https://goilerplate.com?atp=vinena"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0"
                  onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "goilerplate" }); }}
                >
                  Goilerplate
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Production-ready Go boilerplate for SaaS. Auth, billing, emails, and more — save 300+ hours of setup.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Get Goilerplate →
            </span>
          </CardHeader>
        </Card>

        {/* Card 2: Railway */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Image src="/railway-logo.svg" alt="Railway" width={16} height={16} className="h-4 w-4" />
              <CardTitle className="text-base">
                <a
                  href="https://railway.com?referralCode=vinena"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0"
                  onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "railway" }); }}
                >
                  Railway
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Deploy apps, databases, and infrastructure in seconds. The intelligent cloud platform that just works.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Try Railway →
            </span>
          </CardHeader>
        </Card>

        {/* Card 3: Dirstarter */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Image src="/dirstarter-logo.svg" alt="Dirstarter" width={16} height={16} className="h-4 w-4" />
              <CardTitle className="text-base">
                <a
                  href="https://dirstarter.com?atp=vinena"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0"
                  onClick={() => { if (typeof window.op === "function") window.op!("track", "featured_card_clicked", { card: "dirstarter" }); }}
                >
                  Dirstarter
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Ship directory websites in days, not months. Production-ready Next.js template — pay once, launch unlimited.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Get Dirstarter →
            </span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
