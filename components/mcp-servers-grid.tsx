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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (
          <McpServerCard key={server.slug} server={server} />
        ))}
      </div>
    );
  }

  const [ad1, ad2] = infeedAds;
  const cols = 3;

  // Ad 1: left column (col 0), row 2-3 area → grid index 3
  const ad1Pos = cols * 1; // index 3 = col 0

  // Ad 2: right column (col 2), near bottom
  // Total items = servers + 2 ads (each takes 2 slots due to row-span-2)
  const totalSlots = servers.length + 4; // 2 ads × 2 rows each
  const totalRows = Math.ceil(totalSlots / cols);
  const ad2Row = totalRows - 3; // 3rd row from bottom
  const ad2Pos = ad2Row * cols + 2; // col 2 (right side)

  const items: React.ReactNode[] = [];
  let inserted = 0;
  const adConfigs = [ad1, ad2];
  const adPositions = [ad1Pos, ad2Pos];

  servers.forEach((server, index) => {
    const currentIndex = index + (inserted * 2); // each ad takes 2 visual slots
    if (inserted < 2 && currentIndex >= adPositions[inserted]) {
      items.push(
        <div key={`infeed-${adConfigs[inserted].id}`} className="row-span-2">
          <SponsoredInFeedCard ad={adConfigs[inserted]} />
        </div>
      );
      inserted++;
    }
    items.push(<McpServerCard key={server.slug} server={server} />);
  });

  while (inserted < 2) {
    items.push(
      <div key={`infeed-${adConfigs[inserted].id}`} className="row-span-2">
        <SponsoredInFeedCard ad={adConfigs[inserted]} />
      </div>
    );
    inserted++;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items}
    </div>
  );
}
