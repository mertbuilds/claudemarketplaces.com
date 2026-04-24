"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/skills", label: "Skills" },
  { href: "/marketplaces", label: "Marketplaces" },
  { href: "/mcp", label: "MCP" },
  { href: "/digest", label: "Digest" },
  { href: "/learn", label: "Learn" },
  { href: "/jobs", label: "Jobs" },
  { href: "/advertise", label: "Advertise" },
];

function isLinkActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="inline-flex text-primary font-[family-name:var(--font-bbh-sans)] text-lg tracking-wide"
        >
          CLAUDE CODE MARKETPLACES
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {links.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground",
                    active && "text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <AuthButton />
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center text-foreground hover:text-primary transition-colors -mr-2"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-xs border-l border-border bg-background p-0 flex flex-col"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <SheetTitle className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-medium text-left">
                Menu
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="flex flex-col">
                {links.map((link) => {
                  const active = isLinkActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex items-baseline justify-between py-4 border-b border-border/70 transition-colors",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span className="font-serif text-xl font-normal">
                          {link.label}
                        </span>
                        {active && (
                          <span className="text-[10px] uppercase tracking-[0.14em] text-primary">
                            Now
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="px-6 py-6 border-t border-border">
              <AuthButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
