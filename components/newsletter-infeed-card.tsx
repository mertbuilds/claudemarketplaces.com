"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { useAdViewTracking, useAdClickHandler } from "@/lib/hooks/use-ad-tracking";

export function NewsletterInFeedCard() {
  const viewRef = useAdViewTracking("infeed_card_viewed", { card: "newsletter" });
  const handleClick = useAdClickHandler("infeed_card_clicked", { card: "newsletter" });

  return (
    <Card ref={viewRef} onClick={handleClick} className="relative h-full bg-white border-primary transition-all hover:shadow-lg overflow-auto">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl line-clamp-2 flex-1 min-w-0 leading-7">
              <a
                href="https://tastysoftware.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0"
              >
                Tasty Software Newsletter
              </a>
            </CardTitle>
            <Badge variant="outline" className="shrink-0 text-xs">
              Newsletter
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Weekly updates</span>
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          We transform our years of product building expertise into AI native engineering practices — with taste. From ex OpenPurpose and Atölye15 engineers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs capitalize">
              claude code
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              plugins
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              newsletter
            </Badge>
          </div>
          <div className="mt-2 pt-3 border-t border-border">
            <a
              href="https://tastysoftware.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              Subscribe →
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
