"use client";

import { useRef, useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSubscribeSchema } from "@/lib/schemas/newsletter.schema";

type Source = "hero" | "footer" | "email-confirmed" | "digest";
type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({
  source,
  className = "",
}: {
  source: Source;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const timestampRef = useRef(Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const result = newsletterSubscribeSchema.safeParse({
      email,
      website,
      timestamp: timestampRef.current,
      source,
    });

    if (!result.success) {
      setErrorMsg(
        result.error.flatten().fieldErrors.email?.[0] ?? "Invalid email",
      );
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }

      if (typeof window.op === "function") {
        window.op!("track", "newsletter_subscribed", { source });
      }
      setEmail("");
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Check your connection.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={`flex items-center gap-2 text-sm text-foreground ${className}`}
      >
        <Check className="h-4 w-4 text-primary" />
        <span>Thanks. You&apos;ll get the next issue on Monday.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <Input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          required
          aria-label="Email address"
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {errorMsg && status === "error" && (
        <p className="text-xs text-destructive">{errorMsg}</p>
      )}
    </form>
  );
}
