"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { McpServer } from "@/lib/types";
import { ExternalLink, Star, MessageSquare } from "lucide-react";
import { formatStarCount } from "@/lib/utils/format";
import { VoteButton } from "@/components/vote-button";
import { BookmarkButton } from "@/components/bookmark-button";
import Link from "next/link";

interface McpServerCardProps {
  server: McpServer;
}

export function McpServerCard({ server }: McpServerCardProps) {
  const repoUrl = `https://github.com/${server.slug}`;

  return (
    <Card
      className="relative h-full transition-all hover:shadow-lg hover:border-primary/50 py-0 gap-0 cursor-pointer"
    >
      <CardHeader className="p-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-1 flex-1 min-w-0 leading-6">
              <Link href={`/mcp/${server.slug}`} className="after:absolute after:inset-0 after:content-['']">
                {server.displayName || server.name}
              </Link>
            </CardTitle>
            <div className="relative z-10 flex items-center gap-1 shrink-0">
              <BookmarkButton itemType="mcp_server" itemId={server.slug} />
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-7 p-1 hover:bg-muted rounded-none transition-colors cursor-pointer"
                aria-label="View on GitHub"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {server.slug}
          </p>
          <div className="relative z-10 flex items-center gap-3">
            <VoteButton itemType="mcp_server" itemId={server.slug} initialVoteCount={server.voteCount} />
            {server.stars !== undefined && server.stars > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-medium">
                  {formatStarCount(server.stars)}
                </span>
              </div>
            )}
            {server.commentCount > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="text-sm">{server.commentCount}</span>
              </div>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {server.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
