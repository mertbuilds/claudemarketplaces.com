"use client";

import { Marketplace } from "@/lib/types";
import { MarketplaceCard } from "@/components/marketplace-card";
import { SponsoredInFeedCard } from "@/components/sponsored-infeed-card";
import type { AdConfig } from "@/lib/ads";

interface MarketplaceGridProps {
  marketplaces: Marketplace[];
  newsletterSeed: [number, number];
  infeedAds: [AdConfig, AdConfig];
  isSearching?: boolean;
}

export function MarketplaceGrid({ marketplaces, newsletterSeed, infeedAds, isSearching }: MarketplaceGridProps) {
  if (isSearching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaces.map((marketplace) => (
          <MarketplaceCard key={marketplace.repo} marketplace={marketplace} />
        ))}
      </div>
    );
  }

  const [ad1, ad2] = infeedAds;

  const cols = 3;
  const totalSlots = marketplaces.length + 2;
  const totalRows = Math.ceil(totalSlots / cols);

  // First card: random slot in 2nd row (indices 3, 4, 5)
  const topPos = cols + Math.floor(newsletterSeed[0] * cols);

  // Second card: random slot in the bottom 2 rows
  const bottomRowStart = Math.max(cols * 2, (totalRows - 2) * cols);
  const bottomPos =
    bottomRowStart + Math.floor(newsletterSeed[1] * (totalSlots - bottomRowStart));

  const positions = [topPos, bottomPos];
  const infeedCards = [
    <SponsoredInFeedCard key={`infeed-${ad1.id}`} ad={ad1} />,
    <SponsoredInFeedCard key={`infeed-${ad2.id}`} ad={ad2} />,
  ];

  const items: React.ReactNode[] = [];
  let inserted = 0;

  marketplaces.forEach((marketplace, index) => {
    const currentIndex = index + inserted;
    if (inserted < 2 && positions.includes(currentIndex)) {
      items.push(infeedCards[inserted]);
      inserted++;
    }
    items.push(
      <MarketplaceCard key={marketplace.repo} marketplace={marketplace} />
    );
  });

  while (inserted < 2) {
    items.push(infeedCards[inserted]);
    inserted++;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items}
    </div>
  );
}
