"use client";

import { McpServer } from "@/lib/types";
import { McpServerCard } from "@/components/mcp-server-card";
import { SponsoredInFeedCard } from "@/components/sponsored-infeed-card";
import type { AdConfig } from "@/lib/ads";

interface McpServersGridProps {
  servers: McpServer[];
  newsletterSeed: [number, number];
  infeedAds: [AdConfig, AdConfig];
  isSearching?: boolean;
}

export function McpServersGrid({ servers, newsletterSeed, infeedAds, isSearching }: McpServersGridProps) {
  if (isSearching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server) => (
          <McpServerCard key={server.slug} server={server} />
        ))}
      </div>
    );
  }

  const [ad1, ad2] = infeedAds;

  const cols = 3;
  const totalSlots = servers.length + 2;
  const totalRows = Math.ceil(totalSlots / cols);

  const topPos = cols + Math.floor(newsletterSeed[0] * cols);
  const bottomRowStart = Math.max(cols * 2, (totalRows - 2) * cols);
  const bottomPos = bottomRowStart + Math.floor(newsletterSeed[1] * (totalSlots - bottomRowStart));

  const positions = [topPos, bottomPos];
  const infeedCards = [
    <SponsoredInFeedCard key={`infeed-${ad1.id}`} ad={ad1} />,
    <SponsoredInFeedCard key={`infeed-${ad2.id}`} ad={ad2} />,
  ];

  const items: React.ReactNode[] = [];
  let inserted = 0;

  servers.forEach((server, index) => {
    const currentIndex = index + inserted;
    if (inserted < 2 && positions.includes(currentIndex)) {
      items.push(infeedCards[inserted]);
      inserted++;
    }
    items.push(<McpServerCard key={server.slug} server={server} />);
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
