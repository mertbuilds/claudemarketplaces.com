"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Marketplaces" },
    { href: "/skills", label: "Skills" },
    { href: "/learn", label: "Learn" },
    { href: "/feedback", label: "Feedback" },
  ];

  return (
    <nav className="container mx-auto px-4 pt-8">
      <div className="flex gap-6 border-b border-border">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "pb-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
