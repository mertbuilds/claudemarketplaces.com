import { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LearnContent } from "@/components/learn-content";
import { videos, articles, links } from "@/lib/data/learn-content";

export const metadata: Metadata = {
  title: "Learn - Claude Code Videos, Tutorials & Articles",
  description:
    "Learn about Claude Code through video tutorials, guides, and articles from X. Discover tips, tricks, and best practices from the community.",
  openGraph: {
    title: "Learn - Claude Code Videos, Tutorials & Articles",
    description:
      "Learn about Claude Code through video tutorials, guides, and articles from the community.",
    url: "https://claudemarketplaces.com/learn",
    type: "website",
  },
};

export default function LearnPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Learn Claude Code",
    description:
      "Learn about Claude Code through video tutorials, guides, and articles from the community.",
    url: "https://claudemarketplaces.com/learn",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Script
        id="learn-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <LearnContent videos={videos} articles={articles} links={links} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
