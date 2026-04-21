"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

function WelcomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next") || "/";
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent }),
      });
      if (!res.ok) throw new Error();
      router.push(next);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Status chip */}
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 mb-8">
            <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-[0.14em] text-primary font-medium">
              Account created
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4 tracking-tight text-balance">
            You&apos;re <span className="italic">in</span>.
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mb-10 leading-relaxed">
            Welcome to Claude Code Marketplaces. You can now save, vote on, and
            comment on plugins, skills, and MCP servers.
          </p>

          {/* Newsletter masthead — the opt-in, reframed */}
          <div className="border border-border p-6 md:p-7 mb-8 bg-secondary/40 relative">
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

            <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-md">
              Model updates, Claude Code releases, MCP drops, and notable
              skills. Every Monday morning.
            </p>

            <label
              htmlFor="marketing-consent"
              className="inline-flex items-center gap-3 cursor-pointer group select-none"
            >
              <Checkbox
                id="marketing-consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                Send me the next issue
              </span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-destructive mb-4">
              Something went wrong. Please try again.
            </p>
          )}

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <Button
              onClick={handleContinue}
              disabled={loading}
              className="group gap-2 px-6 w-full sm:w-auto"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              {consent
                ? "You'll get the next issue on Monday."
                : "You can subscribe later from any footer."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
