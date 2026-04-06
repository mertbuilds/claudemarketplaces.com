"use client";

import { Skill } from "@/lib/types";
import { SkillCard } from "@/components/skill-card";
import { SponsoredInFeedCard } from "@/components/sponsored-infeed-card";
import type { AdConfig } from "@/lib/ads";

interface SkillsGridProps {
  skills: Skill[];
  newsletterSeed: [number, number];
  infeedAds: [AdConfig, AdConfig];
  isSearching?: boolean;
}

export function SkillsGrid({ skills, newsletterSeed, infeedAds, isSearching }: SkillsGridProps) {
  if (isSearching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    );
  }

  const [ad1, ad2] = infeedAds;

  const cols = 3;
  const totalSlots = skills.length + 2;
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

  skills.forEach((skill, index) => {
    const currentIndex = index + inserted;
    if (inserted < 2 && positions.includes(currentIndex)) {
      items.push(infeedCards[inserted]);
      inserted++;
    }
    items.push(<SkillCard key={skill.id} skill={skill} />);
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
