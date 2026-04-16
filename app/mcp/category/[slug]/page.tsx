import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { McpServersContent } from "@/components/mcp-servers-content";
import { getMcpServersByCategory, getMcpCategoryCounts } from "@/lib/data/mcp-servers";
import { getInFeedAdsForPage } from "@/lib/ads";
import {
  MCP_CATEGORIES,
  getMcpCategoryBySlug,
} from "@/lib/data/mcp-categories";
import { ListingGridSkeleton } from "@/components/listing-grid-skeleton";

export const revalidate = 86400; // 1 day ISR

// ── Static params for SSG ──────────────────────────────────────────────

export function generateStaticParams() {
  return MCP_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

// ── Dynamic metadata ───────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getMcpCategoryBySlug(slug);
  if (!cat) return {};

  const servers = await getMcpServersByCategory(slug);
  const count = servers.length;
  const title = `${cat.title} | MCP Servers`;
  const description = `${cat.description} Browse ${count}+ servers.`;

  return {
    title,
    description,
    keywords: [
      `${cat.name.toLowerCase()} mcp servers`,
      `claude ${cat.name.toLowerCase()} mcp`,
      `${cat.name.toLowerCase()} model context protocol`,
      "mcp servers",
      "model context protocol",
    ],
    openGraph: {
      title,
      description,
      url: `https://claudemarketplaces.com/mcp/category/${slug}`,
      siteName: "Claude Code Plugin Marketplace",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://claudemarketplaces.com/mcp/category/${slug}`,
    },
  };
}

// ── MCP servers list with search/sort/pagination ──────────────────────

async function CategoryServers({ slug }: { slug: string }) {
  const servers = await getMcpServersByCategory(slug);
  const cat = getMcpCategoryBySlug(slug)!;

  // Structured data: ItemList
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} MCP Servers`,
    description: cat.description,
    numberOfItems: servers.length,
    itemListElement: servers.slice(0, 20).map((server, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://claudemarketplaces.com/mcp/${server.slug}`,
      name: server.displayName || server.name,
    })),
  };

  // Structured data: FAQPage
  const faqSchema =
    cat.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: cat.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <McpServersContent
        servers={servers}
        newsletterSeed={[Math.random(), Math.random()]}
        infeedAds={getInFeedAdsForPage("mcp")}
        showFeatured={false}
      />
    </>
  );
}

// ── Related categories ─────────────────────────────────────────────────

async function RelatedCategories({ slug }: { slug: string }) {
  const [categoryCounts] = await Promise.all([getMcpCategoryCounts()]);
  const cat = getMcpCategoryBySlug(slug)!;

  const relatedCategories = cat.relatedSlugs
    .map((s) => {
      const related = getMcpCategoryBySlug(s);
      if (!related) return null;
      return { ...related, count: categoryCounts[s] ?? 0 };
    })
    .filter(Boolean) as (typeof MCP_CATEGORIES[number] & {
    count: number;
  })[];

  if (!relatedCategories.length) return null;

  return (
    <section className="mt-16 border-t pt-12">
      <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-6">
        Related categories
      </h2>
      <div className="flex flex-wrap gap-1">
        {relatedCategories.map((rc) => (
          <Link
            key={rc.slug}
            href={`/mcp/category/${rc.slug}`}
            className="group inline-flex items-center gap-2 px-3 py-1.5 border border-border text-xs uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            <span>{rc.name}</span>
            <span className="font-mono text-[10px] text-muted-foreground/60 group-hover:text-primary transition-colors">
              {rc.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Page component ─────────────────────────────────────────────────────

export default async function McpCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getMcpCategoryBySlug(slug);
  if (!cat) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "MCP Servers",
        item: "https://claudemarketplaces.com/mcp",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat.name,
        item: `https://claudemarketplaces.com/mcp/category/${slug}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} — MCP Servers`,
    description: cat.description,
    url: `https://claudemarketplaces.com/mcp/category/${slug}`,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/mcp">MCP Servers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{cat.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <h1 className="font-serif text-2xl md:text-3xl font-normal max-w-xl mb-3">
            {cat.headline}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {cat.intro}
          </p>
        </div>

        {/* Servers with search, sort, pagination */}
        <Suspense fallback={<ListingGridSkeleton variant="mcp" />}>
          <CategoryServers slug={slug} />
        </Suspense>

        <div className="container mx-auto px-4 pb-16">
          {/* FAQ */}
          {cat.faq.length > 0 && (
            <section className="mt-16 border-t pt-12">
              <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-8">
                FAQ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                {cat.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-medium mb-1.5">
                      {f.question}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related categories */}
          <Suspense fallback={null}>
            <RelatedCategories slug={slug} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
