"use client";

import { Marketplace } from "@/lib/types";
import { MarketplaceCard } from "@/components/marketplace-card";
import { SupastarterInFeedCard } from "@/components/supastarter-infeed-card";
import { NewsletterInFeedCard } from "@/components/newsletter-infeed-card";

interface MarketplaceGridProps {
  marketplaces: Marketplace[];
  newsletterSeed: [number, number];
}

export function MarketplaceGrid({ marketplaces, newsletterSeed }: MarketplaceGridProps) {
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
    <SupastarterInFeedCard key="supastarter-card" />,
    <NewsletterInFeedCard key="newsletter-card" />,
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
