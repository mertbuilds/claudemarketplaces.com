import { Suspense } from "react";
import Link from "next/link";

import type { Metadata } from "next";

export const revalidate = 86400; // 1 day ISR
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllMarketplaces, getMarketplaceCategoryCounts } from "@/lib/data/marketplaces";
import { MarketplaceContent } from "@/components/marketplace-content";
import { getInFeedAdsForPage } from "@/lib/ads";
import { MARKETPLACE_CATEGORIES } from "@/lib/data/marketplace-categories";
import { CategoryChips } from "@/components/category-chips";
import { ListingGridSkeleton, CategoryChipsSkeleton } from "@/components/listing-grid-skeleton";

export const metadata: Metadata = {
  title: "Plugin Marketplaces | Claude Code Plugin Directory",
  description:
    "Browse curated plugin marketplaces for Claude Code. Discover GitHub repositories and collections of AI development tools, extensions, and integrations.",
  alternates: { canonical: "/marketplaces" },
  openGraph: {
    title: "Plugin Marketplaces | Claude Code Plugin Directory",
    description:
      "Browse curated plugin marketplaces for Claude Code. Discover GitHub repositories and collections of AI development tools, extensions, and integrations.",
    url: "https://claudemarketplaces.com/marketplaces",
  },
};

// ── Category navigation ────────────────────────────────────────────────

async function CategoryNav() {
  const counts = await getMarketplaceCategoryCounts();

  const categories = MARKETPLACE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    count: counts[cat.slug] ?? 0,
    href: `/marketplaces/category/${cat.slug}`,
  }));

  return <CategoryChips categories={categories} />;
}

// ── Marketplace grid with search/sort/pagination ──────────────────────

async function MarketplaceData() {
  const marketplaces = await getAllMarketplaces({ includeEmpty: false });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Plugin Marketplaces",
    description: "Browse curated plugin marketplaces for Claude Code.",
    numberOfItems: marketplaces.length,
    itemListElement: marketplaces.slice(0, 10).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://claudemarketplaces.com/plugins/${m.slug}`,
      name: m.repo,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <MarketplaceContent
        marketplaces={marketplaces}
        newsletterSeed={[Math.random(), Math.random()]}
        infeedAds={getInFeedAdsForPage("marketplaces")}
      />
    </>
  );
}

export default function MarketplacesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Claude Code Plugin Marketplace",
        url: "https://claudemarketplaces.com",
        description:
          "Explore the ultimate Claude Code plugin marketplace. Discover AI development tools, extensions, and integrations for Claude AI.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://claudemarketplaces.com/marketplaces?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: "Claude Code Plugin Marketplace",
        description:
          "The central hub for discovering Claude Code plugins, extensions, and development tools",
        url: "https://claudemarketplaces.com",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Claude Code marketplace?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Claude Code marketplace is a curated directory for discovering, exploring, and integrating AI-powered plugins and extensions designed to enhance Claude's code generation and development capabilities. It features tools from multiple marketplaces including official and community sources.",
            },
          },
          {
            "@type": "Question",
            name: "Where can I find plugin marketplaces for Claude Code?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can find Claude Code plugin marketplaces at claudemarketplaces.com, which aggregates plugins from GitHub repositories, official Anthropic sources, and community-driven marketplaces. Browse by category or search for specific functionality.",
            },
          },
          {
            "@type": "Question",
            name: "How do I install Claude Code plugins?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Claude Code plugins can be installed through the official marketplace or by following the installation instructions provided by each plugin. Most plugins support easy integration with Claude's development environment.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      <main className="flex-1">
        {/* ── Hero: two-column layout ── */}
        <section className="container mx-auto px-4 pt-10 pb-4 md:pt-12 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: title + description */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-normal mb-3">
                Plugin Marketplaces
              </h1>
              <p className="text-sm text-muted-foreground max-w-md">
                Curated collections of Claude Code plugins and extensions.
                Browse GitHub repositories that aggregate tools for AI-powered
                development.
              </p>
            </div>

            {/* Right: categories */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">
                  Categories
                </span>
                <div className="flex-1 border-t border-border" />
              </div>
              <Suspense fallback={<CategoryChipsSkeleton />}>
                <CategoryNav />
              </Suspense>
            </div>
          </div>
        </section>

        {/* ── All marketplaces grid ── */}
        <Suspense fallback={<ListingGridSkeleton variant="marketplace" showFeatured />}>
          <MarketplaceData />
        </Suspense>
      </main>
      <Footer hideCategories />
    </div>
  );
}
