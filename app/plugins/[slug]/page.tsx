import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Star, Package } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PluginContent } from "@/components/plugin-content";
import { VoteButton } from "@/components/vote-button";
import { CommentSidebar } from "@/components/comment-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  getMarketplaceBySlug,
  getAllMarketplaces,
} from "@/lib/data/marketplaces";
import {
  getPluginsByMarketplace,
  getPluginCategories,
} from "@/lib/data/plugins";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all marketplaces
export async function generateStaticParams() {
  const marketplaces = await getAllMarketplaces();
  return marketplaces.map((marketplace) => ({
    slug: marketplace.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const marketplace = await getMarketplaceBySlug(slug);

  if (!marketplace) {
    return {
      title: "Marketplace Not Found",
    };
  }

  const title = `${marketplace.repo} Plugins | Claude Code Marketplace`;
  const description =
    marketplace.description ||
    `Discover ${marketplace.pluginCount}+ powerful plugins from ${marketplace.repo}. Enhance your Claude AI development workflow with curated tools and extensions.`;

  return {
    title,
    description,
    keywords: [
      `${marketplace.repo} plugins`,
      "Claude Code marketplace",
      "Claude plugin marketplace",
      "AI development tools",
      "Claude extensions",
    ],
    openGraph: {
      title,
      description,
      url: `https://claudemarketplaces.com/plugins/${slug}`,
      siteName: "Claude Code Plugin Marketplace",
      type: "website",
      images: [
        {
          url: "https://claudemarketplaces.com/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${marketplace.repo} Plugins`,
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

async function PluginData({ slug }: { slug: string }) {
  const [marketplace, plugins, categories] = await Promise.all([
    getMarketplaceBySlug(slug),
    getPluginsByMarketplace(slug),
    getPluginCategories(slug),
  ]);

  if (!marketplace) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/marketplaces">Marketplaces</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{marketplace.repo}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <h1 className="text-sm uppercase tracking-[0.12em] mb-2">
                {marketplace.repo}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {marketplace.description}
              </p>
            </div>
            <PluginContent
              plugins={plugins}
              categories={categories}
              expectedPluginCount={marketplace.pluginCount}
              className="py-4 pb-8"
            />
          </div>

          {/* Right column / sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardContent className="space-y-4">
                {/* Stars */}
                {marketplace.stars !== undefined && marketplace.stars > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Star className="h-4 w-4" />
                      GitHub Stars
                    </span>
                    <span className="text-sm font-medium">
                      {marketplace.stars.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Plugin count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Package className="h-4 w-4" />
                    Plugins
                  </span>
                  <span className="text-sm font-medium">
                    {marketplace.pluginCount}
                  </span>
                </div>

                {/* Votes */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Votes</span>
                  <VoteButton
                    itemType="marketplace"
                    itemId={marketplace.repo}
                    initialVoteCount={marketplace.voteCount}
                  />
                </div>
              </CardContent>
            </Card>
            <CommentSidebar itemType="marketplace" itemId={marketplace.repo} initialCommentCount={marketplace.commentCount} />
          </div>
        </div>
      </div>
    </>
  );
}

export default async function PluginsPage({ params }: PageProps) {
  const { slug } = await params;
  const marketplace = await getMarketplaceBySlug(slug);

  // Generate structured data for SEO
  const structuredData = marketplace
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${marketplace.repo} Plugins`,
        description: marketplace.description,
        url: `https://claudemarketplaces.com/plugins/${slug}`,
        breadcrumb: {
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
              name: marketplace.repo,
              item: `https://claudemarketplaces.com/plugins/${slug}`,
            },
          ],
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: marketplace.pluginCount,
        },
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <Header />
      <main className="flex-1">
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
          <PluginData slug={slug} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
