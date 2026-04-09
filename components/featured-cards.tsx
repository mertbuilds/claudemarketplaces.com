"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
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

interface FeaturedCardData {
  key: string;
  impressionKey?: string;
  cardClassName: string;
  content: ReactNode;
}

export function FeaturedCards() {
  const oneinchRef = useImpression("1inch");
  const appsignalRef = useImpression("appsignal");
  const ideabrowserRef = useImpression("ideabrowser");

  const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    "1inch": oneinchRef,
    appsignal: appsignalRef,
    ideabrowser: ideabrowserRef,
  };

  const cards: FeaturedCardData[] = [
    {
      key: "1inch",
      impressionKey: "1inch",
      cardClassName:
        "relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer py-1 gap-0",
      content: (
        <CardHeader className="flex-1 !flex !flex-col px-3 py-2 gap-2">
          <div className="flex gap-2 items-start">
            <Image
              src="/1inch.png"
              alt="1inch"
              width={14}
              height={14}
              className="h-3.5 w-3.5 shrink-0 mt-[0.15rem]"
            />
            <CardTitle className="text-sm leading-snug">
              <a
                href="https://business.1inch.com/1inch-mcp?utm_source=claudemarketplaces&utm_medium=cpm&utm_campaign=1inch-mcp-awareness&utm_content=pinned-card"
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 cursor-pointer"
                onClick={() => {
                  if (typeof window.op === "function")
                    window.op!("track", "featured_card_clicked", {
                      card: "1inch",
                    });
                }}
              >
                Make your agent a DeFi expert
              </a>
            </CardTitle>
          </div>
          <CardDescription className="text-xs line-clamp-2">
            Real-time data across 13 networks, powered by 1inch.
          </CardDescription>
          <span className="text-xs font-medium text-primary mt-auto">
            Install now &rarr;
          </span>
        </CardHeader>
      ),
    },
    {
      key: "appsignal",
      impressionKey: "appsignal",
      cardClassName:
        "relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer py-1 gap-0",
      content: (
        <CardHeader className="flex-1 !flex !flex-col px-3 py-2 gap-2">
          <div className="flex gap-2 items-start">
            <Image
              src="/appsignal.svg"
              alt="AppSignal"
              width={14}
              height={14}
              className="h-3.5 w-3.5 shrink-0 mt-[0.15rem]"
            />
            <CardTitle className="text-sm leading-snug">
              <a
                href="https://www.appsignal.com/?utm_source=native&utm_medium=paid&utm_campaign=claudemarketplaces"
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 cursor-pointer"
                onClick={() => {
                  if (typeof window.op === "function")
                    window.op!("track", "featured_card_clicked", {
                      card: "appsignal",
                    });
                }}
              >
                AppSignal
              </a>
            </CardTitle>
          </div>
          <CardDescription className="text-xs line-clamp-2">
            Monitor with ease. Code with confidence.
          </CardDescription>
          <span className="text-xs font-medium text-primary mt-auto">
            Start Free Trial &rarr;
          </span>
        </CardHeader>
      ),
    },
    {
      key: "ideabrowser",
      impressionKey: "ideabrowser",
      cardClassName:
        "relative border-primary transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer py-1 gap-0",
      content: (
        <CardHeader className="flex-1 !flex !flex-col px-3 py-2 gap-2">
          <div className="flex gap-2 items-start">
            <Image
              src="/ideabrowser-symbol.webp"
              alt="ideabrowser.com"
              width={14}
              height={14}
              className="h-3.5 w-3.5 shrink-0 mt-[0.15rem]"
            />
            <CardTitle className="text-sm leading-snug">
              <a
                href="https://www.ideabrowser.com/join?utm_source=claudecode_marketplace&utm_medium=paid&utm_campaign=march-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 cursor-pointer"
                onClick={() => {
                  if (typeof window.op === "function")
                    window.op!("track", "featured_card_clicked", {
                      card: "ideabrowser",
                    });
                }}
              >
                ideabrowser.com
              </a>
            </CardTitle>
          </div>
          <CardDescription className="text-xs line-clamp-2">
            Trending startup ideas with real demand. Launch with AI agents.
          </CardDescription>
          <span className="text-xs font-medium text-primary mt-auto">
            Get trending ideas &rarr;
          </span>
        </CardHeader>
      ),
    },
    {
      key: "advertise-cta",
      cardClassName:
        "relative border-dashed border-muted-foreground/25 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer py-1 gap-0",
      content: (
        <CardHeader className="flex-1 !flex !flex-col px-3 py-2 gap-2">
          <CardTitle className="text-sm leading-snug">
            <Link
              href="/advertise"
              className="after:absolute after:inset-0 cursor-pointer"
              onClick={() => {
                if (typeof window.op === "function")
                  window.op!("track", "featured_card_clicked", {
                    card: "advertise-cta",
                  });
              }}
            >
              Your product here
            </Link>
          </CardTitle>
          <CardDescription className="text-xs line-clamp-2">
            Show your product to 100K+ AI developers monthly.
          </CardDescription>
          <span className="text-xs font-medium text-primary mt-auto">
            Advertise &rarr;
          </span>
        </CardHeader>
      ),
    },
  ];

  const renderCard = (card: FeaturedCardData) => (
    <Card
      key={card.key}
      ref={card.impressionKey ? refs[card.impressionKey] : undefined}
      className={card.cardClassName}
    >
      {card.content}
    </Card>
  );

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % cards.length) + cards.length) % cards.length);
    },
    [cards.length]
  );

  // Auto-rotation
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(id);
  }, [paused, cards.length]);

  // Pause on touch, resume after
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setPaused(true);
      touchStartX.current = e.touches[0].clientX;
      touchDeltaX.current = 0;
    },
    []
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goTo(activeIndex + 1);
    } else if (touchDeltaX.current > threshold) {
      goTo(activeIndex - 1);
    }
    // Resume auto-rotation after 3s of no interaction
    const timeout = setTimeout(() => setPaused(false), 3000);
    return () => clearTimeout(timeout);
  }, [activeIndex, goTo]);

  return (
    <div className="mb-4">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">
        Featured
      </p>

      {/* Mobile carousel: visible below md */}
      <div
        className="md:hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {cards.map((card) => (
              <div key={card.key} className="w-full shrink-0">
                {renderCard(card)}
              </div>
            ))}
          </div>
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-2">
          {cards.map((card, i) => (
            <button
              key={card.key}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
              onClick={() => {
                goTo(i);
                setPaused(true);
                setTimeout(() => setPaused(false), 3000);
              }}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid: visible at md+ */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(renderCard)}
      </div>
    </div>
  );
}
