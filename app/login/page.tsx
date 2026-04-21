"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/client";
import { safeNextPath } from "@/lib/safe-redirect";

function LoginContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
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
            <Github className="h-3 w-3 text-primary" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-[0.14em] text-primary font-medium">
              Via GitHub
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4 tracking-tight text-balance">
            Sign <span className="italic">in</span>.
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mb-10 leading-relaxed">
            To vote, bookmark, and comment on anything in the directory — or to
            manage your subscription to This week in Claude.
          </p>

          {/* What to expect card */}
          <div className="border border-border p-6 md:p-7 mb-8 bg-secondary/40">
            <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                What happens next
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                One click
              </p>
            </div>
            <ul className="space-y-2.5 text-sm text-foreground/80 leading-relaxed">
              <li className="flex items-baseline gap-3">
                <span className="text-[10px] text-muted-foreground font-mono pt-0.5 tabular-nums shrink-0">
                  01
                </span>
                <span>
                  GitHub asks you to authorize Claude Code Marketplaces.
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-[10px] text-muted-foreground font-mono pt-0.5 tabular-nums shrink-0">
                  02
                </span>
                <span>
                  We read your public profile only. Nothing is posted on your
                  behalf.
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-[10px] text-muted-foreground font-mono pt-0.5 tabular-nums shrink-0">
                  03
                </span>
                <span>
                  You land back here, signed in. First-timers get a short
                  welcome step.
                </span>
              </li>
            </ul>
          </div>

          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <Button
              onClick={handleSignIn}
              disabled={loading}
              className="group gap-2 px-6 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4" />
                  Continue with GitHub
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to directory
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
