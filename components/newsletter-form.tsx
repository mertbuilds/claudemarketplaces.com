"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";

type Source = "hero" | "footer" | "email-confirmed" | "digest";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255),
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterForm({
  source,
  className = "",
}: {
  source: Source;
  className?: string;
}) {
  const [website, setWebsite] = useState("");
  const timestampRef = useRef(Date.now());
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError("");
    try {
      const res = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          website,
          timestamp: timestampRef.current,
          source,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success !== true) {
        setSubmitError(data?.error ?? "Something went wrong. Try again.");
        return;
      }

      if (typeof window.op === "function") {
        window.op!("track", "newsletter_subscribed", { source });
      }
      form.reset();
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Check your connection.");
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex items-center gap-2 text-sm text-foreground ${className}`}
      >
        <Check className="h-4 w-4 text-primary" />
        <span>Thanks. You&apos;ll get the next issue on Monday.</span>
      </div>
    );
  }

  const isSubmitting = form.formState.isSubmitting;
  const emailError = form.formState.errors.email?.message;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col gap-2 w-full ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1 space-y-0">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    aria-label="Email address"
                    aria-invalid={!!fieldState.error || !!submitError}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>

        {/* Honeypot */}
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

        {emailError && (
          <p
            role="alert"
            aria-live="assertive"
            className="text-xs text-destructive"
          >
            {emailError}
          </p>
        )}
        {submitError && !emailError && (
          <p
            role="alert"
            aria-live="assertive"
            className="text-xs text-destructive"
          >
            {submitError}
          </p>
        )}
      </form>
    </Form>
  );
}
