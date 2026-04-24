import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VoteButton } from "@/components/vote-button";
import { getMcpServerBySlug, getMcpServersByCategory } from "@/lib/data/mcp-servers";
import { classifyMcpServer, getMcpCategoryBySlug } from "@/lib/data/mcp-categories";
import { McpServer } from "@/lib/types";
import { formatStarCount } from "@/lib/utils/format";
import { CollapsibleReadme } from "@/components/collapsible-readme";
import { VoteProvider } from "@/lib/contexts/vote-context";
import { BookmarkProvider } from "@/lib/contexts/bookmark-context";
import { SkillInstallCommand } from "@/components/skill-install-command";
import { CommentSidebar } from "@/components/comment-sidebar";
import { McpServerCard } from "@/components/mcp-server-card";

export const revalidate = 86400; // 1 day ISR

export async function generateStaticParams() {
  const { getAllMcpServers } = await import("@/lib/data/mcp-servers");
  const servers = await getAllMcpServers();
  return servers.map((s) => ({
    slug: s.slug.split("/"),
  }));
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const serverSlug = slug.join("/");
  const server = await getMcpServerBySlug(serverSlug);

  if (!server) {
    return { title: "MCP Server Not Found" };
  }

  const title = `${server.displayName || server.name} | MCP Servers`;
  const description =
    server.summary?.slice(0, 160) ||
    server.description ||
    `${server.displayName || server.name} - an MCP server for Claude Code.`;

  // Noindex detail pages that have zero original signal.
  // Pages graduate to indexable when they have an editorial summary (original
  // content) OR community signal (votes/comments).
  const hasOriginalSignal =
    !!server.summary || server.voteCount + server.commentCount > 0;

  return {
    title,
    description,
    alternates: { canonical: `/mcp/${serverSlug}` },
    robots: hasOriginalSignal ? undefined : { index: false, follow: true },
    keywords: [
      server.name,
      "mcp server",
      "model context protocol",
      "claude code",
      ...server.tags,
    ],
    openGraph: {
      title,
      description,
      url: `https://claudemarketplaces.com/mcp/${serverSlug}`,
      siteName: "Claude Code Plugin Marketplace",
      type: "website",
      images: [
        {
          url: "https://claudemarketplaces.com/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${server.displayName || server.name} MCP Server`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://claudemarketplaces.com/opengraph-image"],
    },
  };
}

async function fetchReadme(repo: string): Promise<string | null> {
  const branches = ["main", "master"];

  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/${repo}/${branch}/README.md`;
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (res.ok) return await res.text();
    } catch {
      continue;
    }
  }
  return null;
}

async function McpServerDetailContent({ slug }: { slug: string[] }) {
  const serverSlug = slug.join("/");
  const server = await getMcpServerBySlug(serverSlug);

  if (!server) {
    notFound();
  }

  const repo = slug.slice(0, 2).join("/");
  const repoUrl = `https://github.com/${repo}`;
  const readme = await fetchReadme(repo);

  // Derive Claude Code install command
  // Monorepo (3-part slug): e.g. modelcontextprotocol/servers/fetch → uvx package: mcp-server-fetch
  // Simple repo (2-part slug): e.g. exa-labs/exa-mcp-server → uvx package: exa-mcp-server
  const isMonorepo = slug.length >= 3;
  const packageName = isMonorepo
    ? `mcp-server-${slug[slug.length - 1]}`
    : server.collection;
  const serverAlias = slug.join("-");
  const installCommand = `claude mcp add --transport stdio ${serverAlias} uvx ${packageName}`;

  return (
    <>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/mcp">MCP</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {server.displayName || server.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            <h1 className="font-serif text-2xl md:text-3xl font-normal mb-3">
              {server.displayName || server.name}
            </h1>

            {/* Editor's note */}
            {server.summary ? (
              <div className="border-l-2 border-muted-foreground/20 pl-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60 block mb-1.5">Editor&apos;s Note</span>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                  {server.summary}
                </p>
              </div>
            ) : server.description ? (
              <p className="text-sm text-muted-foreground max-w-md">
                {server.description}
              </p>
            ) : null}

            {/* Installation */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Install
              </h2>
              <SkillInstallCommand command={installCommand} />
            </div>

            {/* README.md - collapsible */}
            {readme && <CollapsibleReadme content={readme} />}
          </div>

          {/* Right column / sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardContent className="space-y-4">
                {/* Stars */}
                {server.stars !== undefined && server.stars > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Star className="h-4 w-4" />
                      GitHub Stars
                    </span>
                    <span className="text-sm font-medium">
                      {formatStarCount(server.stars)}
                    </span>
                  </div>
                )}

                {/* Votes */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Votes</span>
                  <VoteProvider itemType="mcp_server" itemIds={[server.slug]}>
                    <VoteButton
                      itemType="mcp_server"
                      itemId={server.slug}
                      initialVoteCount={server.voteCount}
                    />
                  </VoteProvider>
                </div>

                {/* Divider */}
                <div className="border-t pt-4">
                  <Link
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </Link>
                </div>
              </CardContent>
            </Card>
            <CommentSidebar itemType="mcp_server" itemId={server.slug} initialCommentCount={server.commentCount} />
          </div>
        </div>
        <Suspense fallback={null}>
          <RelatedMcpServers server={server} />
        </Suspense>
      </div>
    </>
  );
}

// ─── Related MCP Servers ────────────────────────────────────

async function RelatedMcpServers({ server }: { server: McpServer }) {
  const cats = classifyMcpServer(server);
  if (!cats.length) return null;

  const primaryCat = cats[0];
  const category = getMcpCategoryBySlug(primaryCat);
  const categoryServers = await getMcpServersByCategory(primaryCat);
  const related = categoryServers
    .filter((s) => s.slug !== server.slug)
    .slice(0, 6);

  if (!related.length) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Related {category?.name ?? ""} MCP Servers
        </h2>
        {category && (
          <Link
            href={`/mcp/category/${primaryCat}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all &rarr;
          </Link>
        )}
      </div>
      <VoteProvider itemType="mcp_server" itemIds={related.map((s) => s.slug)}>
        <BookmarkProvider itemType="mcp_server" itemIds={related.map((s) => s.slug)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((s) => (
              <McpServerCard key={s.slug} server={s} />
            ))}
          </div>
        </BookmarkProvider>
      </VoteProvider>
    </div>
  );
}

export default async function McpServerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const serverSlug = slug.join("/");
  const server = await getMcpServerBySlug(serverSlug);

  const breadcrumbSchema = server
    ? {
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
            name: server.displayName || server.name,
          },
        ],
      }
    : null;

  const softwareSchema = server
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: server.displayName || server.name,
        description: server.description || `${server.displayName || server.name} - an MCP server for Claude Code`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        url: `https://claudemarketplaces.com/mcp/${server.slug}`,
        codeRepository: `https://github.com/${slug.slice(0, 2).join("/")}`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }
    : null;

  const howToSchema = server
    ? (() => {
        const isMonorepo = slug.length >= 3;
        const packageName = isMonorepo
          ? `mcp-server-${slug[slug.length - 1]}`
          : server.collection;
        const serverAlias = slug.join("-");
        const installCommand = `claude mcp add --transport stdio ${serverAlias} uvx ${packageName}`;
        const displayName = server.displayName || server.name;
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to install the ${displayName} MCP server for Claude Code`,
          description: `Connect ${displayName} to Claude Code as an MCP server.`,
          totalTime: "PT1M",
          tool: [
            { "@type": "HowToTool", name: "Claude Code CLI" },
            { "@type": "HowToTool", name: "uvx" },
          ],
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Run the install command",
              text: `Open your terminal and run: ${installCommand}`,
            },
          ],
        };
      })()
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {softwareSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="animate-pulse">
              {/* Breadcrumb */}
              <div className="container mx-auto px-4 pt-8 pb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-10 bg-muted" />
                  <div className="h-3.5 w-2 bg-muted" />
                  <div className="h-3.5 w-32 bg-muted" />
                </div>
              </div>
              {/* Two-column layout */}
              <div className="container mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left column */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Title: font-serif text-2xl md:text-3xl */}
                    <div className="h-8 w-3/5 bg-muted mb-3" />
                    {/* Description: text-sm, multi-line */}
                    <div className="space-y-2 max-w-md">
                      <div className="h-4 w-full bg-muted" />
                      <div className="h-4 w-full bg-muted" />
                      <div className="h-4 w-3/4 bg-muted" />
                    </div>
                    {/* Install: label text-sm + command pre py-3 */}
                    <div>
                      <div className="h-5 w-12 bg-muted mb-2" />
                      <div className="h-11 w-full bg-muted border" />
                    </div>
                    {/* README.md collapsed: border rounded-md, button px-4 py-3 */}
                    <div className="border rounded-md">
                      <div className="flex items-center gap-2 px-4 py-3">
                        <div className="h-4 w-4 bg-muted" />
                        <div className="h-5 w-24 bg-muted" />
                      </div>
                    </div>
                  </div>
                  {/* Sidebar — Card with CardContent */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-card flex flex-col border shadow-sm py-6">
                      <div className="px-6 space-y-4">
                        {/* Stars: icon + text-sm label + count */}
                        <div className="flex items-center justify-between">
                          <div className="h-5 w-28 bg-muted" />
                          <div className="h-5 w-12 bg-muted" />
                        </div>
                        {/* Votes: text-sm label + VoteButton */}
                        <div className="flex items-center justify-between">
                          <div className="h-5 w-12 bg-muted" />
                          <div className="h-5 w-16 bg-muted" />
                        </div>
                        {/* GitHub link: border-t, icon + text-sm */}
                        <div className="border-t pt-4">
                          <div className="h-5 w-32 bg-muted" />
                        </div>
                      </div>
                    </div>
                    {/* CommentSidebar: text-xs label + login prompt */}
                    <div>
                      <div className="h-4 w-24 bg-muted mb-4" />
                      <div className="mb-4 py-3 border border-border flex justify-center">
                        <div className="h-3.5 w-24 bg-muted" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <McpServerDetailContent slug={slug} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
