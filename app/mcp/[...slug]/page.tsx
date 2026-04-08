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
import { SkillInstallCommand } from "@/components/skill-install-command";
import { CommentSidebar } from "@/components/comment-sidebar";

export const revalidate = 300;

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
    server.description ||
    `${server.displayName || server.name} - an MCP server for Claude Code.`;

  // Noindex detail pages that have zero original signal (no votes, no comments).
  // The body is mirrored from the upstream README.md, which Google already indexes
  // at higher authority. Once a server earns a vote or comment on this site, it
  // graduates and becomes indexable on the next ISR revalidation.
  const hasOriginalSignal = server.voteCount + server.commentCount > 0;

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
      const res = await fetch(url, { next: { revalidate: 3600 } });
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

            {/* Description */}
            {server.description && (
              <p className="text-sm text-muted-foreground max-w-md">
                {server.description}
              </p>
            )}

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
            <Suspense fallback={null}>
              <RelatedMcpServers server={server} />
            </Suspense>
          </div>
        </div>
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
    .slice(0, 5);

  if (!related.length) return null;

  return (
    <Card>
      <CardContent className="space-y-2">
        <span className="text-sm text-muted-foreground block mb-1">
          Related {category?.name ?? ""} MCP Servers
        </span>
        {related.map((s) => (
          <Link
            key={s.slug}
            href={`/mcp/${s.slug}`}
            className="flex items-center justify-between py-1.5 hover:text-foreground transition-colors gap-2"
          >
            <span className="text-sm truncate">{s.displayName || s.name}</span>
            {s.stars !== undefined && s.stars > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                <Star className="h-3 w-3" />
                {formatStarCount(s.stars)}
              </span>
            )}
          </Link>
        ))}
        {category && (
          <Link
            href={`/mcp/category/${primaryCat}`}
            className="block pt-2 border-t text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse all {category.name} servers &rarr;
          </Link>
        )}
      </CardContent>
    </Card>
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
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="animate-pulse">
              {/* Breadcrumb */}
              <div className="container mx-auto px-4 pt-8 pb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-10 bg-muted" />
                  <div className="h-3 w-2 bg-muted" />
                  <div className="h-3 w-32 bg-muted" />
                </div>
              </div>
              {/* Two-column layout */}
              <div className="container mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left column */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <div className="h-7 w-2/5 bg-muted mb-3" />
                      <div className="h-3 w-3/5 bg-muted" />
                    </div>
                    {/* Install command */}
                    <div>
                      <div className="h-3 w-12 bg-muted mb-2" />
                      <div className="h-9 w-full bg-muted" />
                    </div>
                    {/* README placeholder */}
                    <div className="space-y-3 pt-4">
                      <div className="h-4 w-1/3 bg-muted" />
                      <div className="h-3 w-full bg-muted" />
                      <div className="h-3 w-full bg-muted" />
                      <div className="h-3 w-4/5 bg-muted" />
                      <div className="h-3 w-full bg-muted" />
                      <div className="h-3 w-2/3 bg-muted" />
                    </div>
                  </div>
                  {/* Sidebar */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="border border-border bg-card p-4 space-y-4">
                      <div className="flex justify-between">
                        <div className="h-3 w-24 bg-muted" />
                        <div className="h-3 w-12 bg-muted" />
                      </div>
                      <div className="flex justify-between">
                        <div className="h-3 w-12 bg-muted" />
                        <div className="h-5 w-14 bg-muted" />
                      </div>
                      <div className="border-t pt-4">
                        <div className="h-3 w-28 bg-muted" />
                      </div>
                    </div>
                    <div className="border border-border bg-card p-4 space-y-3">
                      <div className="h-3 w-20 bg-muted" />
                      <div className="h-16 w-full bg-muted" />
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
