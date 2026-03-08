"use client";

import { Marketplace } from "@/lib/types";
import { MarketplaceCard } from "@/components/marketplace-card";
import { NewsletterInFeedCard } from "@/components/newsletter-infeed-card";
import { AdvertiseInFeedCard } from "@/components/advertise-infeed-card";

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

  const items: React.ReactNode[] = [];
  let inserted = 0;

  marketplaces.forEach((marketplace, index) => {
    const currentIndex = index + inserted;
    if (inserted < 2) {
      if (currentIndex === positions[0] || currentIndex === positions[1]) {
        items.push(
          inserted === 0
            ? <NewsletterInFeedCard key="newsletter-card" />
            : <AdvertiseInFeedCard key="advertise-card" />
        );
        inserted++;
      }
    }
    items.push(
      <MarketplaceCard key={marketplace.repo} marketplace={marketplace} />
    );
  });

  // If second card hasn't been inserted yet (position was past all items)
  if (inserted < 2) {
    items.push(<AdvertiseInFeedCard key="advertise-card" />);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items}
    </div>
  );
}
