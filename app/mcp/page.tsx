import { Suspense } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllMcpServers } from "@/lib/data/mcp-servers";
import { McpServersContent } from "@/components/mcp-servers-content";
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
        <div className="container mx-auto px-4 pt-8">
          <h1 className="text-sm uppercase tracking-[0.12em]">MCP Servers</h1>
        </div>
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-9 bg-muted rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <McpData />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
