"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { McpServer } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { VoteButton } from "@/components/vote-button";

interface McpServerCardProps {
  server: McpServer;
}

export function McpServerCard({ server }: McpServerCardProps) {
  const repoUrl = `https://github.com/${server.sourceRepo}`;

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
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
              className="flex items-center justify-center shrink-0 h-7 p-1 hover:bg-muted rounded-none transition-colors"
              aria-label="View on GitHub"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
          <div className="flex items-center gap-3">
            <VoteButton itemType="mcp_server" itemId={server.slug} initialVoteCount={server.voteCount} />
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {server.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {server.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {server.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {server.sourceRepo}
          </p>
          {server.url && (
            <div className="mt-2 pt-3 border-t border-border">
              <a
                href={server.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View on {server.source}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
