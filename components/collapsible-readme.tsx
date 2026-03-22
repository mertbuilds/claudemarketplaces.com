"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SkillMarkdown } from "@/components/skill-markdown";

interface CollapsibleReadmeProps {
  content: string;
}

export function CollapsibleReadme({ content }: CollapsibleReadmeProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        README.md
      </button>
      {open && (
        <div className="px-4 pb-4 border-t">
          <div className="pt-4">
            <SkillMarkdown content={content} />
          </div>
        </div>
      )}
    </div>
  );
}
