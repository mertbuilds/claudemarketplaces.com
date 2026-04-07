"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group flex items-center bg-muted/50">
      <code className="block text-sm px-3 py-2 font-mono text-foreground flex-1 min-w-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {command}
      </code>
      <button
        onClick={handleCopy}
        className="shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
