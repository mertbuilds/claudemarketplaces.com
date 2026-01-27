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
import { Copy, Check, ExternalLink, Star } from "lucide-react";
import { formatStarCount } from "@/lib/utils/format";
import { useState } from "react";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const [copied, setCopied] = useState(false);

  const repoUrl = `https://github.com/${skill.repo}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(skill.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl font-serif line-clamp-2 flex-1 min-w-0 leading-7">
              {skill.name}
            </CardTitle>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center shrink-0 h-7 p-1 hover:bg-muted rounded transition-colors"
              aria-label="View on GitHub"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
          <div className="flex items-center gap-3">
            {skill.stars !== undefined && skill.stars > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-medium">
                  {formatStarCount(skill.stars)}
                </span>
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
          {/* License */}
          {skill.license && (
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {skill.license}
              </Badge>
            </div>
          )}

          {/* Repo info */}
          <p className="text-xs text-muted-foreground">
            {skill.repo}
          </p>

          {/* Install Command */}
          <div className="mt-2 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate min-w-0">
                {skill.installCommand}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 p-1.5 hover:bg-muted rounded transition-colors cursor-pointer"
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
