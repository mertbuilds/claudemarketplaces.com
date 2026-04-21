import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NewsletterForm } from "@/components/newsletter-form";
import { listPublishedBroadcasts } from "@/lib/kit";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "This Week in Claude — Weekly Digest Archive",
  description:
    "Past issues of This week in Claude. Weekly digest for Claude Code builders covering model updates, releases, and notable tools.",
  alternates: { canonical: "/digest" },
  openGraph: {
    title: "This Week in Claude — Weekly Digest Archive",
    description:
      "Past issues of This week in Claude. Weekly digest for Claude Code builders.",
    url: "https://claudemarketplaces.com/digest",
    type: "website",
  },
};

function formatSendDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function DigestIndexPage() {
  const issues = await listPublishedBroadcasts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Status chip */}
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 mb-8">
            <BookOpen
              className="h-3 w-3 text-primary"
              strokeWidth={2.5}
            />
            <span className="text-[10px] uppercase tracking-[0.14em] text-primary font-medium">
              The newsletter
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4 tracking-tight text-balance">
            This week in Claude.
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mb-10 leading-relaxed">
            A weekly digest for Claude Code builders. Model updates, releases,
            and notable tools. Every Monday morning.
          </p>

          {/* Subscribe card */}
          <div className="border border-border p-6 md:p-7 mb-14 bg-secondary/40">
            <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Get the next issue
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Weekly &middot; Free
              </p>
            </div>
            <NewsletterForm source="digest" className="max-w-md" />
          </div>

          {/* Past issues */}
          <div>
            <div className="flex items-baseline justify-between pb-4 mb-8 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Past issues
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-mono">
                {issues.length}
              </p>
            </div>

            {issues.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center">
                <p className="font-serif italic text-xl md:text-2xl font-normal text-muted-foreground mb-2">
                  No issues published yet.
                </p>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Subscribe above to get the first one as it ships.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border border-t border-border">
                {issues.map((issue) => (
                  <li key={issue.id}>
                    <Link
                      href={`/digest/${issue.slug}`}
                      className="group flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 py-6 hover:bg-secondary/30 transition-colors -mx-4 px-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-mono md:w-28 shrink-0 pt-1">
                        {formatSendDate(issue.send_at)}
                      </p>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-xl md:text-2xl font-normal text-balance leading-snug group-hover:text-primary transition-colors mb-2">
                          {issue.subject}
                        </p>
                        {issue.preview_text && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {issue.preview_text}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary hidden md:block" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
