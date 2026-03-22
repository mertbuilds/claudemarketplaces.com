"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { McpServer } from "@/lib/types";
import { ExternalLink, Star } from "lucide-react";
import { formatStarCount } from "@/lib/utils/format";
import { VoteButton } from "@/components/vote-button";
import { useRouter } from "next/navigation";

interface McpServerCardProps {
  server: McpServer;
}

export function McpServerCard({ server }: McpServerCardProps) {
  const router = useRouter();
  const repoUrl = `https://github.com/${server.slug}`;

  const handleCardClick = () => {
    router.push(`/mcp/${server.slug}`);
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
              {server.displayName || server.name}
            </CardTitle>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center shrink-0 h-7 p-1 hover:bg-muted rounded-none transition-colors"
              aria-label="View on GitHub"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {server.slug}
          </p>
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <VoteButton itemType="mcp_server" itemId={server.slug} initialVoteCount={server.voteCount} />
            {server.stars !== undefined && server.stars > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-medium">
                  {formatStarCount(server.stars)}
                </span>
              </div>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {server.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
