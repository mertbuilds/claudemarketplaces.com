"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { safeNextPath } from "@/lib/safe-redirect";

const consentSchema = z.object({
  consent: z.boolean(),
});

type ConsentValues = z.infer<typeof consentSchema>;

function WelcomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = safeNextPath(searchParams.get("next"));

  const form = useForm<ConsentValues>({
    resolver: zodResolver(consentSchema),
    defaultValues: { consent: false },
  });

  const consent = form.watch("consent");
  const submitError = form.formState.errors.root?.message;
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: ConsentValues) => {
    form.clearErrors("root");
    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: values.consent }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        form.setError("root", {
          message: data?.error ?? "Something went wrong. Please try again.",
        });
        return;
      }
      router.push(next);
    } catch {
      form.setError("root", {
        message: "Network error. Please try again.",
      });
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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

                <p className="font-serif text-2xl md:text-3xl font-normal mb-2 text-balance leading-tight">
                  This week in Claude
                </p>

                <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-md">
                  Model updates, Claude Code releases, and notable tools. Every
                  Monday morning.
                </p>

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-3">
                      <FormControl>
                        <Checkbox
                          id="marketing-consent"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="marketing-consent"
                        className="text-sm text-foreground cursor-pointer font-normal"
                      >
                        Send me the next issue
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {submitError && (
                <p
                  role="alert"
                  aria-live="assertive"
                  className="text-sm text-destructive mb-4"
                >
                  {submitError}
                </p>
              )}

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group gap-2 px-6 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
                <p
                  aria-live="polite"
                  className="text-xs text-muted-foreground"
                >
                  {consent
                    ? "You'll get the next issue on Monday."
                    : "You can subscribe later from any footer."}
                </p>
              </div>
            </form>
          </Form>
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
