"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NewsletterForm } from "@/components/newsletter-form";

type Status = "success" | "already" | "expired" | "invalid";

interface StateConfig {
  chipLabel: string;
  chipTone: "primary" | "muted";
  chipIcon: LucideIcon;
  headline: React.ReactNode;
  description: string;
  showMasthead: boolean;
  showResubscribe: boolean;
}

const states: Record<Status, StateConfig> = {
  success: {
    chipLabel: "Subscription confirmed",
    chipTone: "primary",
    chipIcon: Check,
    headline: (
      <>
        You&apos;re <span className="italic">in</span>.
      </>
    ),
    description:
      "The next issue of This week in Claude ships Monday morning.",
    showMasthead: true,
    showResubscribe: false,
  },
  already: {
    chipLabel: "Already confirmed",
    chipTone: "muted",
    chipIcon: Check,
    headline: (
      <>
        Already <span className="italic">here</span>.
      </>
    ),
    description:
      "You're on the list. The next issue ships Monday morning.",
    showMasthead: true,
    showResubscribe: false,
  },
  expired: {
    chipLabel: "Link expired",
    chipTone: "muted",
    chipIcon: Clock,
    headline: (
      <>
        Link <span className="italic">expired</span>.
      </>
    ),
    description:
      "Confirmation windows close after a while. Subscribe again below and we'll send you a fresh link.",
    showMasthead: false,
    showResubscribe: true,
  },
  invalid: {
    chipLabel: "Link not recognized",
    chipTone: "muted",
    chipIcon: AlertCircle,
    headline: (
      <>
        Link <span className="italic">not recognized</span>.
      </>
    ),
    description:
      "This link may have been copied wrong or already used. Subscribe again below to get a fresh link.",
    showMasthead: false,
    showResubscribe: true,
  },
};

function isStatus(value: string | null): value is Status {
  return value === "success" || value === "already" || value === "expired" || value === "invalid";
}

function EmailConfirmedContent() {
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get("status");
  const status: Status = isStatus(rawStatus) ? rawStatus : "invalid";
  const config = states[status];
  const Icon = config.chipIcon;
  const chipIsPrimary = config.chipTone === "primary";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Status chip */}
          <div
            className={
              chipIsPrimary
                ? "inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 mb-8"
                : "inline-flex items-center gap-2 border border-border bg-secondary/50 px-2.5 py-1 mb-8"
            }
          >
            <Icon
              className={
                chipIsPrimary
                  ? "h-3 w-3 text-primary"
                  : "h-3 w-3 text-muted-foreground"
              }
              strokeWidth={2.5}
            />
            <span
              className={
                chipIsPrimary
                  ? "text-[10px] uppercase tracking-[0.14em] text-primary font-medium"
                  : "text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium"
              }
            >
              {config.chipLabel}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4 tracking-tight text-balance">
            {config.headline}
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mb-10 leading-relaxed">
            {config.description}
          </p>

          {/* Masthead preview (success + already) */}
          {config.showMasthead && (
            <div className="border border-border p-6 md:p-7 mb-10 bg-secondary/40">
              <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-border">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  The newsletter
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Weekly &middot; Free
                </p>
              </div>
              <p className="font-serif italic text-2xl md:text-3xl font-normal mb-2 text-balance leading-tight">
                This week in Claude
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed max-w-md">
                Model updates, Claude Code releases, MCP drops, and notable
                skills. Every Monday morning.
              </p>
            </div>
          )}

          {/* Resubscribe (expired + invalid) */}
          {config.showResubscribe && (
            <div className="border border-border p-6 md:p-7 mb-10 bg-secondary/40">
              <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-border">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Try again
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Weekly &middot; Free
                </p>
              </div>
              <p className="font-serif italic text-2xl md:text-3xl font-normal mb-2 text-balance leading-tight">
                This week in Claude
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-md">
                Model updates, Claude Code releases, MCP drops, and notable
                skills. Every Monday morning.
              </p>
              <NewsletterForm source="email-confirmed" className="max-w-md" />
            </div>
          )}

          {/* Back link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            Back to the directory
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function EmailConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <EmailConfirmedContent />
    </Suspense>
  );
}
