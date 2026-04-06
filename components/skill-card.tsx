"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Copy, Check, Star, Download, MessageSquare } from "lucide-react";
import { formatStarCount } from "@/lib/utils/format";
import { VoteButton } from "@/components/vote-button";
import { BookmarkButton } from "@/components/bookmark-button";
import { useState } from "react";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const skillUrl = `/skills/${skill.id}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(skill.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    router.push(skillUrl);
  };

  return (
    <Card
      className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl line-clamp-2 flex-1 min-w-0 leading-7">
              {skill.name}
            </CardTitle>
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <BookmarkButton itemType="skill" itemId={skill.id} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {skill.repo}
          </p>
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
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
        <CardDescription className="line-clamp-3">
          {skill.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {skill.license && (
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {skill.license}
              </Badge>
            </div>
          )}

          <div className="mt-2 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded-none flex-1 truncate min-w-0">
                {skill.installCommand}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 p-1.5 hover:bg-muted rounded-none transition-colors cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
