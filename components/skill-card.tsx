"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/lib/types";
import Link from "next/link";
import { Star, Download, MessageSquare } from "lucide-react";
import { formatStarCount } from "@/lib/utils/format";
import { VoteButton } from "@/components/vote-button";
import { BookmarkButton } from "@/components/bookmark-button";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const skillUrl = `/skills/${skill.id}`;

  return (
    <Card
      className="relative h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 py-0 gap-0"
    >
      <CardHeader className="p-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-1 flex-1 min-w-0 leading-6">
              <Link href={skillUrl} className="after:absolute after:inset-0 after:content-['']">
                {skill.name}
              </Link>
            </CardTitle>
            <div className="relative z-10 shrink-0">
              <BookmarkButton itemType="skill" itemId={skill.id} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {skill.repo}
            {skill.repoSkillCount && skill.repoSkillCount > 1 && (
              <Link
                href={`/skills/${skill.repo}`}
                className="relative z-10 ml-1.5 text-primary/70 hover:text-primary hover:underline"
              >
                +{skill.repoSkillCount - 1} more
              </Link>
            )}
          </p>
          <div className="relative z-10 flex items-center gap-3">
            <VoteButton itemType="skill" itemId={skill.id} initialVoteCount={skill.voteCount} />
            {skill.installs > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">
                  {formatStarCount(skill.installs)}
                </span>
              </div>
            )}
            {skill.stars !== undefined && skill.stars > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-medium">
                  {formatStarCount(skill.stars)}
                </span>
              </div>
            )}
            {skill.commentCount > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="text-sm">{skill.commentCount}</span>
              </div>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {skill.summary || skill.description}
        </CardDescription>
        {skill.license && (
          <div className="flex flex-wrap gap-1 pt-1">
            <Badge variant="secondary" className="text-xs">
              {skill.license}
            </Badge>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
