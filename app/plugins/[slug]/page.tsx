import { Suspense } from "react";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Metadata } from "next";
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
import { PluginContent } from "@/components/plugin-content";
import {
  getMarketplaceBySlug,
  getAllMarketplaces,
} from "@/lib/data/marketplaces";
import {
  getPluginsByMarketplace,
  getPluginCategories,
} from "@/lib/data/plugins";

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
          url: "https://claudemarketplaces.com/og-image.png",
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
      images: ["https://claudemarketplaces.com/og-image.png"],
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
              <BreadcrumbLink href="/">Marketplaces</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{marketplace.repo}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Marketplace Header */}
      <div className="container mx-auto px-4 pb-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold font-serif mb-2">
            {marketplace.repo}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {marketplace.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{marketplace.pluginCount} plugins</span>
            {marketplace.stars !== undefined && marketplace.stars > 0 && (
              <span>⭐ {marketplace.stars} stars</span>
            )}
          </div>
        </div>
      </div>

      {/* Plugin Content */}
      <PluginContent plugins={plugins} categories={categories} />
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
              item: "https://claudemarketplaces.com",
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
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(structuredData)}
        </Script>
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
