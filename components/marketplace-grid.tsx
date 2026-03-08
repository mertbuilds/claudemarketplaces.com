"use client";

import { Marketplace } from "@/lib/types";
import { MarketplaceCard } from "@/components/marketplace-card";

interface MarketplaceGridProps {
  marketplaces: Marketplace[];
}

export function MarketplaceGrid({ marketplaces }: MarketplaceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {marketplaces.map((marketplace) => (
        <MarketplaceCard key={marketplace.repo} marketplace={marketplace} />
      ))}
    </div>
  );
}
