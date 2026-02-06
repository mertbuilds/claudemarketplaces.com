"use client";

import { Skill } from "@/lib/types";
import { SkillCard } from "@/components/skill-card";

interface SkillsGridProps {
  skills: Skill[];
  searchQuery?: string;
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
