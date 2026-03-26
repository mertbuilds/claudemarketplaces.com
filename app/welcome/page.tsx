"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Label } from "@/components/ui/label";

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
      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Claude Code Marketplaces</CardTitle>
            <CardDescription>
              You&apos;re all set to discover plugins, skills, and MCP servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing-consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
              />
              <Label htmlFor="marketing-consent" className="text-sm leading-relaxed cursor-pointer">
                Send me weekly updates on new Claude Code tools, skills, and resources
              </Label>
            </div>
            {error && (
              <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
            )}
            <Button onClick={handleContinue} disabled={loading} className="w-full">
              {loading ? "Saving..." : "Continue"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
