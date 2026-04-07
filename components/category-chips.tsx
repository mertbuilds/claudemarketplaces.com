"use client";

import { useState } from "react";
import Link from "next/link";

const VISIBLE_COUNT = 10;

interface CategoryChip {
  slug: string;
  name: string;
  count: number;
  href: string;
}

export function CategoryChips({ categories }: { categories: CategoryChip[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = categories.length > VISIBLE_COUNT;
  const visible = expanded ? categories : categories.slice(0, VISIBLE_COUNT);

  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1">
      {visible.map((cat) => (
        <Link
          key={cat.slug}
          href={cat.href}
          className="group inline-flex items-center gap-2 px-3 py-1.5 border border-border text-xs uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
        >
          <span>{cat.name}</span>
          <span className="font-mono text-[10px] text-muted-foreground/60 group-hover:text-primary transition-colors">
            {cat.count}
          </span>
        </Link>
      ))}
      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="inline-flex items-center px-3 py-1.5 border border-dashed border-border text-xs uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          +{categories.length - VISIBLE_COUNT} more
        </button>
      )}
    </div>
  );
}
