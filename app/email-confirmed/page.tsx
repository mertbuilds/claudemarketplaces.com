"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const messages: Record<string, { title: string; description: string }> = {
  success: {
    title: "You're in!",
    description: "We'll send the first digest soon.",
  },
  already: {
    title: "Already confirmed",
    description: "You've already confirmed — you're all set!",
  },
  expired: {
    title: "Link expired",
    description:
      "This link has expired. Please contact us if you'd like to subscribe.",
  },
  invalid: {
    title: "Invalid link",
    description: "Invalid confirmation link.",
  },
};

function EmailConfirmedContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "invalid";
  const msg = messages[status] ?? messages.invalid;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">{msg.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{msg.description}</p>
            <Link
              href="/"
              className="inline-block text-sm text-primary underline hover:text-primary/80"
            >
              Back to home
            </Link>
          </CardContent>
        </Card>
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
