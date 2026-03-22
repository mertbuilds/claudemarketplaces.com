"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface McpInstallConfigProps {
  config: string;
}

export function McpInstallConfig({ config }: McpInstallConfigProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-muted border border-border rounded-md p-4 pr-12 text-sm font-mono overflow-x-auto">
        <code>{config}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 hover:bg-background rounded-md transition-colors cursor-pointer"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
