import { Suspense } from "react";

import type { Metadata } from "next";

export const revalidate = 3600;
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllMarketplaces, getCategories } from "@/lib/data/marketplaces";
import { MarketplaceContent } from "@/components/marketplace-content";

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

async function MarketplaceData() {
  const [marketplaces, categories] = await Promise.all([
    getAllMarketplaces({ includeEmpty: false }),
    getCategories(),
  ]);

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
        categories={categories}
        newsletterSeed={[Math.random(), Math.random()]}
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
        <div className="container mx-auto px-4 pt-8">
          <h1 className="text-sm uppercase tracking-[0.12em]">Plugin Marketplaces</h1>
        </div>
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-9 bg-muted rounded-md" />
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-7 w-20 bg-muted rounded-md" />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <MarketplaceData />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
