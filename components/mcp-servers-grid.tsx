"use client";

import { McpServer } from "@/lib/types";
import { McpServerCard } from "@/components/mcp-server-card";
import { IdeabrowserInFeedCard } from "@/components/ideabrowser-infeed-card";
import { NewsletterInFeedCard } from "@/components/newsletter-infeed-card";

interface McpServersGridProps {
  servers: McpServer[];
  newsletterSeed: [number, number];
  isSearching?: boolean;
}

export function McpServersGrid({ servers, newsletterSeed, isSearching }: McpServersGridProps) {
  if (isSearching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server) => (
          <McpServerCard key={server.slug} server={server} />
        ))}
      </div>
    );
  }

  const cols = 3;
  const totalSlots = servers.length + 2;
  const totalRows = Math.ceil(totalSlots / cols);

  const topPos = cols + Math.floor(newsletterSeed[0] * cols);
  const bottomRowStart = Math.max(cols * 2, (totalRows - 2) * cols);
  const bottomPos = bottomRowStart + Math.floor(newsletterSeed[1] * (totalSlots - bottomRowStart));

  const positions = [topPos, bottomPos];
  const infeedCards = [
    <IdeabrowserInFeedCard key="ideabrowser-card" />,
    <NewsletterInFeedCard key="newsletter-card" />,
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
