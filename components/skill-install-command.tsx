"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function SkillInstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-muted border rounded-none px-4 py-3 pr-12 text-sm font-mono overflow-hidden truncate">
        <code>{command}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors cursor-pointer"
        aria-label="Copy install command"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
