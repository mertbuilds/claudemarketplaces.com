"use client";

import { Skill } from "@/lib/types";
import { SkillCard } from "@/components/skill-card";
import { GoilerplateInFeedCard } from "@/components/goilerplate-infeed-card";
import { NewsletterInFeedCard } from "@/components/newsletter-infeed-card";

interface SkillsGridProps {
  skills: Skill[];
  newsletterSeed: [number, number];
}

export function SkillsGrid({ skills, newsletterSeed }: SkillsGridProps) {
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
    <GoilerplateInFeedCard key="goilerplate-card" />,
    <NewsletterInFeedCard key="newsletter-card" />,
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
