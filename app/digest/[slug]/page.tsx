import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  getBroadcastBySlug,
  listPublishedBroadcasts,
  sanitizeBroadcastHtml,
  stripSubjectPrefix,
} from "@/lib/kit";

export const revalidate = 3600;

export async function generateStaticParams() {
  const issues = await listPublishedBroadcasts();
  return issues.map((i) => ({ slug: i.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const broadcast = await getBroadcastBySlug(slug);
  if (!broadcast) {
    return { title: "Issue not found" };
  }
  const cleanSubject = stripSubjectPrefix(broadcast.subject);
  return {
    title: `${cleanSubject} · This week in Claude`,
    description:
      broadcast.preview_text ??
      "Weekly digest for Claude Code builders. Model updates, releases, and notable tools.",
    alternates: { canonical: `/digest/${slug}` },
    openGraph: {
      title: cleanSubject,
      description: broadcast.preview_text ?? undefined,
      url: `https://claudemarketplaces.com/digest/${slug}`,
      type: "article",
      publishedTime: broadcast.send_at ?? undefined,
    },
  };
}

function formatSendDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function DigestIssuePage({ params }: PageProps) {
  const { slug } = await params;
  const broadcast = await getBroadcastBySlug(slug);
  if (!broadcast) notFound();

  // Find prev/next issues for footer nav
  const issues = await listPublishedBroadcasts();
  const currentIndex = issues.findIndex((i) => i.slug === slug);
  const newer = currentIndex > 0 ? issues[currentIndex - 1] : null;
  const older =
    currentIndex >= 0 && currentIndex < issues.length - 1
      ? issues[currentIndex + 1]
      : null;

  const sanitized = sanitizeBroadcastHtml(broadcast.content);
  const dateLabel = broadcast.send_at
    ? formatSendDate(broadcast.send_at)
    : null;
  const cleanSubject = stripSubjectPrefix(broadcast.subject);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Breadcrumb */}
          <Link
            href="/digest"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            All issues
          </Link>

          {/* Masthead */}
          <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-border">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              This week in Claude
            </p>
            {dateLabel && (
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-mono">
                {dateLabel}
              </p>
            )}
          </div>

          {/* Subject */}
          <h1 className="font-serif text-3xl md:text-4xl font-normal mb-4 tracking-tight text-balance leading-tight">
            {cleanSubject}
          </h1>
          {broadcast.preview_text && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              {broadcast.preview_text}
            </p>
          )}

          {/* Subscribe CTA — top */}
          <div className="border border-border p-5 md:p-6 mb-12 bg-secondary/40">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-foreground/80 leading-relaxed max-w-md">
                Get the next issue in your inbox. Weekly, free.
              </p>
              <NewsletterForm
                source="digest"
                className="w-full md:w-[340px] shrink-0"
              />
            </div>
          </div>

          {/* Rendered issue content */}
          <div
            className="prose prose-neutral max-w-none prose-headings:font-sans prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none prose-hr:border-border prose-table:text-sm prose-th:bg-secondary"
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />

          {/* Subscribe CTA — bottom */}
          <div className="border border-border p-6 md:p-7 mt-16 bg-secondary/40">
            <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Liked this?
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Weekly &middot; Free
              </p>
            </div>
            <p className="font-serif italic text-2xl md:text-3xl font-normal mb-2 text-balance leading-tight">
              This week in Claude
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-md">
              Get the next issue every Monday morning. Model updates,
              releases, and notable tools.
            </p>
            <NewsletterForm source="digest" className="max-w-md" />
          </div>

          {/* Prev / next nav */}
          {(newer || older) && (
            <nav className="mt-16 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
              {older ? (
                <Link
                  href={`/digest/${older.slug}`}
                  className="group flex flex-col gap-1 md:pr-6"
                >
                  <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Older issue
                  </span>
                  <span className="font-serif text-lg leading-snug text-balance group-hover:text-primary transition-colors">
                    {stripSubjectPrefix(older.subject)}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {newer ? (
                <Link
                  href={`/digest/${newer.slug}`}
                  className="group flex flex-col gap-1 md:text-right md:pl-6 md:border-l md:border-border"
                >
                  <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground inline-flex items-center md:justify-end gap-2">
                    Newer issue
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="font-serif text-lg leading-snug text-balance group-hover:text-primary transition-colors">
                    {stripSubjectPrefix(newer.subject)}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          {/* Kit permalink, quiet */}
          {broadcast.public_url && (
            <p className="mt-12 text-xs text-muted-foreground">
              Also available at{" "}
              <a
                href={broadcast.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                kit.com
              </a>
              .
            </p>
          )}

          {/* JSON-LD Article schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: broadcast.subject,
                description: broadcast.preview_text ?? undefined,
                datePublished: broadcast.send_at,
                publisher: {
                  "@type": "Organization",
                  name: "Claude Code Marketplaces",
                  url: "https://claudemarketplaces.com",
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `https://claudemarketplaces.com/digest/${slug}`,
                },
              }),
            }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
