import { Suspense } from "react";
import Script from "next/script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { getAllMarketplaces, getCategories } from "@/lib/data/marketplaces";
import { MarketplaceContent } from "@/components/marketplace-content";

async function MarketplaceData() {
  const [marketplaces, categories] = await Promise.all([
    getAllMarketplaces({ includeEmpty: false }),
    getCategories(),
  ]);

  return (
    <MarketplaceContent marketplaces={marketplaces} categories={categories} />
  );
}

export default function Home() {
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
              "https://claudemarketplaces.com/?search={search_term_string}",
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
      <Script
        id="schema-org"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>
      <Header />
      <main className="flex-1">
        <Navigation />
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
