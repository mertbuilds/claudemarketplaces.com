import { Suspense } from "react";

export const revalidate = 3600;

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllMcpServers, getMcpCategoryCounts } from "@/lib/data/mcp-servers";
import { McpServersContent } from "@/components/mcp-servers-content";
import { getInFeedAdsForPage } from "@/lib/ads";
import { MCP_CATEGORIES } from "@/lib/data/mcp-categories";
import { CategoryChips } from "@/components/category-chips";
import { ListingGridSkeleton, CategoryChipsSkeleton } from "@/components/listing-grid-skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Servers | Discover Model Context Protocol Servers",
  description:
    "Browse and discover MCP servers for Claude Code. Find Model Context Protocol servers to extend your AI workflows.",
  keywords: [
    "mcp servers",
    "model context protocol",
    "claude code mcp",
    "ai tools",
    "claude code",
  ],
  openGraph: {
    title: "MCP Servers | Discover Model Context Protocol Servers",
    description:
      "Browse and discover MCP servers for Claude Code. Find Model Context Protocol servers to extend your AI workflows.",
    url: "https://claudemarketplaces.com/mcp",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Servers | Discover Model Context Protocol Servers",
    description:
      "Browse and discover MCP servers for Claude Code. Find Model Context Protocol servers to extend your AI workflows.",
  },
};

// ── Category navigation ────────────────────────────────────────────────

async function CategoryNav() {
  const counts = await getMcpCategoryCounts();

  const categories = MCP_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    count: counts[cat.slug] ?? 0,
    href: `/mcp/category/${cat.slug}`,
  }));

  return <CategoryChips categories={categories} />;
}

async function McpData() {
  const servers = await getAllMcpServers({ includeEmpty: false });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MCP Servers",
    description: "Browse and discover MCP servers for Claude Code.",
    numberOfItems: servers.length,
    itemListElement: servers.slice(0, 10).map((server, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://claudemarketplaces.com/mcp/${server.slug}`,
      name: server.displayName || server.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <McpServersContent
        servers={servers}
        newsletterSeed={[Math.random(), Math.random()]}
        infeedAds={getInFeedAdsForPage("mcp")}
      />
    </>
  );
}

export default function McpPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MCP Servers",
    description:
      "Browse and discover MCP servers for Claude Code. Find Model Context Protocol servers to extend your AI workflows.",
    url: "https://claudemarketplaces.com/mcp",
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
                MCP Servers
              </h1>
              <p className="text-sm text-muted-foreground max-w-md">
                Model Context Protocol servers that extend your AI agent with
                databases, APIs, browsers, and more. Browse the directory or
                search for specific capabilities.
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

        {/* ── All servers grid ── */}
        <Suspense fallback={<ListingGridSkeleton variant="mcp" showFeatured />}>
          <McpData />
        </Suspense>
      </main>
      <Footer hideCategories />
    </div>
  );
}
