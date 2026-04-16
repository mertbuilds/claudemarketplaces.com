import { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { videos, articles, links } from "@/lib/data/learn-content";
import { Link2 } from "lucide-react";

export const revalidate = 86400; // 1 day ISR

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">
        <span className="font-mono">{number}</span>
        <span className="mx-2 text-border">/</span>
        <span>{title}</span>
      </h2>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

export default function LearnPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Learn Claude Code",
    description:
      "Learn about Claude Code through video tutorials, guides, and articles from the community.",
    url: "https://claudemarketplaces.com/learn",
  };

  const featuredVideo = videos[0];
  const remainingVideos = videos.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-10 pb-4 md:pt-12 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left column */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-normal mb-3">
                Learn Claude Code
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                A curated collection of tutorials, articles, and resources from
                the community to help you master Claude Code.
              </p>

              {/* Contents navigation box */}
              <div className="border border-border">
                <div className="px-4 py-2.5 border-b border-border">
                  <span className="text-[10px] uppercase tracking-[0.12em] font-mono text-muted-foreground">
                    Contents
                  </span>
                </div>
                <div className="flex flex-col">
                  <a
                    href="#videos"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-muted/50 transition-colors border-b border-border"
                  >
                    <span className="font-mono text-muted-foreground">01</span>
                    <span>Videos ({videos.length})</span>
                  </a>
                  <a
                    href="#articles"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-muted/50 transition-colors border-b border-border"
                  >
                    <span className="font-mono text-muted-foreground">02</span>
                    <span>Articles ({articles.length})</span>
                  </a>
                  <a
                    href="#resources"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-mono text-muted-foreground">03</span>
                    <span>Resources ({links.length})</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right column — featured video */}
            <div>
              <div className="aspect-video w-full">
                <iframe
                  src={featuredVideo.url}
                  title={featuredVideo.title}
                  className="w-full h-full"
                  loading="lazy"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium">{featuredVideo.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={featuredVideo.author.image}
                      alt={featuredVideo.author.name}
                    />
                    <AvatarFallback>
                      {getInitials(featuredVideo.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {featuredVideo.author.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 01 / Videos */}
        <section id="videos" className="container mx-auto px-4 pb-16">
          <SectionLabel number="01" title="Videos" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            {remainingVideos.map((video) => (
              <div key={video.url} className="bg-background">
                <div className="aspect-video w-full">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-full"
                    loading="lazy"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={video.author.image}
                        alt={video.author.name}
                      />
                      <AvatarFallback>
                        {getInitials(video.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {video.author.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 02 / Articles */}
        <section id="articles" className="container mx-auto px-4 pb-16">
          <SectionLabel number="02" title="Articles" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            {articles.map((article) => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background hover:bg-muted/50 transition-colors"
              >
                {article.image ? (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-muted flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-12 w-12 text-foreground/70"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm font-medium line-clamp-2">
                    {article.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={article.author.image}
                          alt={article.author.name}
                        />
                        <AvatarFallback>
                          {getInitials(article.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {article.author.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatDate(article.date)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section 03 / Resources */}
        <section id="resources" className="container mx-auto px-4 pb-16">
          <SectionLabel number="03" title="Resources" />
          <div className="border border-border max-w-2xl">
            {links.map((link, i) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors${
                  i < links.length - 1 ? " border-b border-border" : ""
                }`}
              >
                <div className="h-8 w-8 bg-muted flex items-center justify-center shrink-0">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{link.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {link.description}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.12em] font-mono text-muted-foreground shrink-0">
                  {link.source}
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
