"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plugin } from "@/lib/types";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface PluginCardProps {
  plugin: Plugin;
}

export function PluginCard({ plugin }: PluginCardProps) {
  const [copied, setCopied] = useState(false);

  // Clean up source path and build GitHub URL
  const sourcePath = plugin.source?.replace(/^\.\//, "") || "";
  const sourceUrl = sourcePath
    ? `${plugin.marketplaceUrl}/tree/HEAD/${sourcePath}`
    : null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(plugin.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg line-clamp-2 flex-1 min-w-0">
            {plugin.name}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            {plugin.version && (
              <Badge variant="outline" className="text-xs">
                v{plugin.version}
              </Badge>
            )}
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-7 p-1 hover:bg-muted rounded-none transition-colors"
                aria-label="View source on GitHub"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {plugin.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/* Category, License, and Keywords */}
          {(plugin.category || plugin.license || plugin.keywords) && (
            <div className="flex flex-wrap gap-1">
              {plugin.category && (
                <Badge
                  variant="secondary"
                  className="text-xs capitalize"
                >
                  {plugin.category}
                </Badge>
              )}
              {plugin.license && (
                <Badge variant="secondary" className="text-xs">
                  {plugin.license}
                </Badge>
              )}
              {plugin.keywords?.slice(0, 2).map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="text-xs"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {/* Author */}
          {plugin.author?.name && (
            <p className="text-xs text-muted-foreground">
              by {plugin.author.name}
            </p>
          )}

          {/* Install Command */}
          <div className="mt-2 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded-none flex-1 truncate min-w-0">
                {plugin.installCommand}
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
