"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Marketplace } from "@/lib/types";
import { Package, ExternalLink, Copy, Check, Star } from "lucide-react";
import { useState } from "react";
import { formatStarCount } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface MarketplaceCardProps {
  marketplace: Marketplace;
}

export function MarketplaceCard({ marketplace }: MarketplaceCardProps) {
  const repoUrl = `https://github.com/${marketplace.repo}`;
  const installCommand = `/plugin marketplace add ${marketplace.repo}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(repoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Link href={`/plugins/${marketplace.slug}`} className="block h-full">
      <Card
        className={cn(
          "group h-full flex flex-col justify-between relative cursor-pointer shadow-lg shadow-primary-foreground/5",
          "transition-colors ease-in",
          "hover:border-foreground/50 hover:duration-0"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 pointer-events-none bg-gradient-to-b to-primary/3 from-transparent opacity-0 transition-opacity ease-in-out",
            "group-hover:opacity-100 group-hover:duration-100"
          )}
        />
        <CardHeader>
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-xl font-serif line-clamp-2 flex-1 min-w-0 leading-7">
                {marketplace.repo}
              </CardTitle>
              <button
                type="button"
                onClick={handleExternalLink}
                className="flex items-center justify-center shrink-0 h-7 p-1 hover:bg-muted rounded transition-colors"
                aria-label="View on GitHub"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              {marketplace.stars !== undefined && marketplace.stars > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-sm font-medium">
                    {formatStarCount(marketplace.stars)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="text-sm">
                  {marketplace.pluginCount}{" "}
                  {marketplace.pluginCount === 1 ? "plugin" : "plugins"}
                </span>
              </div>
            </div>
          </div>
          <CardDescription className="line-clamp-3">
            {marketplace.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {marketplace.categories && marketplace.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {marketplace.categories.slice(0, 4).map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="text-xs capitalize"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-2 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate min-w-0">
                  {installCommand}
                </code>
                <button
                  onClick={handleCopy}
                  className="shrink-0 p-1.5 hover:bg-muted rounded transition-colors cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
