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
};

async function McpData() {
  const servers = await getAllMcpServers({ includeEmpty: false });
  return (
    <McpServersContent
      servers={servers}
      newsletterSeed={[Math.random(), Math.random()]}
    />
  );
}

export default function McpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
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
