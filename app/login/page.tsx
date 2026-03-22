"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  useEffect(() => {
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }, [supabase, next]);

  return (
    <p className="text-sm text-muted-foreground">Redirecting to GitHub...</p>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Loading...</p>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
