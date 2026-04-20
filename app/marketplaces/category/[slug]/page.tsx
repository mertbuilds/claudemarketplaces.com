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
import { MarketplaceContent } from "@/components/marketplace-content";
import {
  getMarketplacesByNewCategory,
  getMarketplaceCategoryCounts,
} from "@/lib/data/marketplaces";
import { getInFeedAdsForPage } from "@/lib/ads";
import {
  MARKETPLACE_CATEGORIES,
  getMarketplaceCategoryBySlug,
} from "@/lib/data/marketplace-categories";
import { ListingGridSkeleton } from "@/components/listing-grid-skeleton";

export const revalidate = 86400; // 1 day ISR

// ── Static params for SSG ──────────────────────────────────────────────

export function generateStaticParams() {
  return MARKETPLACE_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

// ── Dynamic metadata ───────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getMarketplaceCategoryBySlug(slug);
  if (!cat) return {};

  const marketplaces = await getMarketplacesByNewCategory(slug);
  const count = marketplaces.length;
  const title = `${cat.title} | Claude Code Plugin Marketplace`;
  const description = `${cat.description} Browse ${count}+ marketplaces.`;

  return {
    title,
    description,
    keywords: [
      `claude ${cat.name.toLowerCase()} marketplaces`,
      `claude code ${cat.name.toLowerCase()}`,
      `${cat.name.toLowerCase()} plugin marketplaces`,
      "claude code marketplaces",
      "claude code plugins",
    ],
    openGraph: {
      title,
      description,
      url: `https://claudemarketplaces.com/marketplaces/category/${slug}`,
      siteName: "Claude Code Plugin Marketplace",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://claudemarketplaces.com/marketplaces/category/${slug}`,
    },
  };
}

// ── Marketplaces list with search/sort/pagination ─────────────────────

async function CategoryMarketplaces({ slug }: { slug: string }) {
  const marketplaces = await getMarketplacesByNewCategory(slug);
  const cat = getMarketplaceCategoryBySlug(slug)!;

  // Structured data: ItemList
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} Claude Code Plugin Marketplaces`,
    description: cat.description,
    numberOfItems: marketplaces.length,
    itemListElement: marketplaces.slice(0, 20).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://claudemarketplaces.com/plugins/${m.slug}`,
      name: m.repo,
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
      <MarketplaceContent
        marketplaces={marketplaces}
        newsletterSeed={[Math.random(), Math.random()]}
        infeedAds={getInFeedAdsForPage("marketplaces")}
      />
    </>
  );
}

// ── Related categories ─────────────────────────────────────────────────

async function RelatedCategories({ slug }: { slug: string }) {
  const categoryCounts = await getMarketplaceCategoryCounts();
  const cat = getMarketplaceCategoryBySlug(slug)!;

  const relatedCategories = cat.relatedSlugs
    .map((s) => {
      const related = getMarketplaceCategoryBySlug(s);
      if (!related) return null;
      return { ...related, count: categoryCounts[s] ?? 0 };
    })
    .filter(Boolean) as (typeof MARKETPLACE_CATEGORIES[number] & {
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
            href={`/marketplaces/category/${rc.slug}`}
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

export default async function MarketplaceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getMarketplaceCategoryBySlug(slug);
  if (!cat) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Marketplaces",
        item: "https://claudemarketplaces.com/marketplaces",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat.name,
        item: `https://claudemarketplaces.com/marketplaces/category/${slug}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} — Claude Code Plugin Marketplaces`,
    description: cat.description,
    url: `https://claudemarketplaces.com/marketplaces/category/${slug}`,
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
                <BreadcrumbLink href="/marketplaces">Marketplaces</BreadcrumbLink>
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

        {/* Marketplaces with search, sort, pagination */}
        <Suspense fallback={<ListingGridSkeleton variant="marketplace" />}>
          <CategoryMarketplaces slug={slug} />
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
