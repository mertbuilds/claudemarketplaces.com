"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";

const links = [
  { href: "/", label: "Marketplaces" },
  { href: "/skills", label: "Skills" },
  { href: "/mcp", label: "MCP" },
  { href: "/learn", label: "Learn" },
  { href: "/advertise", label: "Advertise" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="py-6">
      <div className="container mx-auto flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="inline-flex text-primary font-[family-name:var(--font-bbh-sans)] text-lg tracking-wide"
        >
          CLAUDE CODE MARKETPLACES
        </Link>
        <nav className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center md:justify-end md:gap-6">
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground",
                    isActive && "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
