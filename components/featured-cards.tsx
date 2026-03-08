"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Twitter, Megaphone, Code } from "lucide-react";
import { useAdViewTracking, useAdClickHandler } from "@/lib/hooks/use-ad-tracking";

export function FeaturedCards() {
  const sectionRef = useAdViewTracking("featured_section_viewed");
  const xFollowRef = useAdViewTracking("featured_card_viewed", { card: "x_follow" });
  const vinenaRef = useAdViewTracking("featured_card_viewed", { card: "vinena_studio" });
  const advertiseRef = useAdViewTracking("featured_card_viewed", { card: "advertise" });
  const onXFollowClick = useAdClickHandler("featured_card_clicked", { card: "x_follow" });
  const onVinenaClick = useAdClickHandler("featured_card_clicked", { card: "vinena_studio" });
  const onAdvertiseClick = useAdClickHandler("featured_card_clicked", { card: "advertise" });

  return (
    <div className="mb-8" ref={sectionRef}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Featured
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Follow on X */}
        <Card ref={xFollowRef} onClick={onXFollowClick} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Twitter className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                <Link
                  href="https://x.com/mertduzgun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0"
                >
                  Follow @mertduzgun
                </Link>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Stay updated with the latest Claude plugins and marketplace news.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Follow on X →
            </span>
          </CardHeader>
        </Card>

        {/* Card 2: Vinena Studio */}
        <Card ref={vinenaRef} onClick={onVinenaClick} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                <a
                  href="https://vinena.studio?referrer=claudemarketplaces.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0"
                >
                  Vinena Studio
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              AI-native engineering studio — from ex OpenPurpose and Atölye15 engineers.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Visit vinena.studio →
            </span>
          </CardHeader>
        </Card>

        {/* Card 3: Advertise */}
        <Card ref={advertiseRef} onClick={onAdvertiseClick} className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                <Link
                  href="/advertise"
                  className="after:absolute after:inset-0"
                >
                  Advertise Here
                </Link>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Promote your developer tool or service to thousands of Claude Code
              users.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Learn more →
            </span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
