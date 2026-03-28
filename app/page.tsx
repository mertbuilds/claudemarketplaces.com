import Link from "next/link";

import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Claude Code Plugins | Skills, MCP Servers & Marketplace Directory",
  description:
    "A curated directory of high-quality Claude Code plugins, skills, and MCP servers. Community-driven with voting and commenting.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Claude Code Plugins | Skills, MCP Servers & Marketplace Directory",
    description:
      "A curated directory of high-quality Claude Code plugins, skills, and MCP servers. Community-driven with voting and commenting.",
    url: "https://claudemarketplaces.com",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Claude Code Plugin Marketplace",
        url: "https://claudemarketplaces.com",
        description:
          "A curated directory of high-quality Claude Code plugins, skills, and MCP servers with community features.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://claudemarketplaces.com/skills?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: "Claude Code Plugin Marketplace",
        description:
          "A curated, community-driven directory for discovering Claude Code plugins, skills, and MCP servers",
        url: "https://claudemarketplaces.com",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What are Claude Code skills?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Claude Code skills are reusable instruction sets that teach your agent how to perform specific tasks. They can be installed with a single command.",
            },
          },
          {
            "@type": "Question",
            name: "What are MCP servers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Model Context Protocol (MCP) servers provide additional tools and capabilities to AI coding agents. They extend your agent's abilities by connecting to external services, databases, APIs, and more.",
            },
          },
          {
            "@type": "Question",
            name: "How is quality maintained?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We curate skills by install count, GitHub stars, and community votes. Only high-quality, actively used extensions are listed. Community features like voting and commenting help surface the best tools.",
            },
          },
          {
            "@type": "Question",
            name: "Is this free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, the directory is completely free and open. Browse and install any skills, MCP servers, or plugins at no cost.",
            },
          },
          {
            "@type": "Question",
            name: "How do I install a skill?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Copy the install command from any skill page and run it in your terminal. Most skills can be installed with a single command.",
            },
          },
          {
            "@type": "Question",
            name: "What are plugin marketplaces?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Plugin marketplaces are GitHub repositories containing collections of plugins, skills, and tools curated by the community. They aggregate extensions from multiple sources.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <h1 className="font-serif text-2xl md:text-3xl font-normal max-w-xl mb-4">
            Curated plugins, skills, and MCP servers for Claude Code
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mb-8">
            A hand-picked directory of high-quality extensions. Community voting and commenting soon.
          </p>
          <div className="flex gap-3">
            <Link
              href="/skills"
              className="text-xs uppercase tracking-[0.1em] px-4 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Browse skills
            </Link>
            <Link
              href="/mcp"
              className="text-xs uppercase tracking-[0.1em] px-4 py-2.5 border border-border font-medium hover:bg-muted transition-colors"
            >
              MCP servers
            </Link>
          </div>
        </section>

        {/* Directory */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border">
            <Link href="/skills" className="group p-6 hover:bg-muted/50 transition-colors">
              <p className="text-sm font-medium mb-1.5">Agent Skills</p>
              <p className="text-xs text-muted-foreground mb-4">
                Reusable instructions that teach your agent specific tasks. Install with a single command.
              </p>
              <span className="text-xs text-primary group-hover:underline">
                2,300+ skills &rarr;
              </span>
            </Link>
            <Link href="/mcp" className="group p-6 border-t md:border-t-0 md:border-l border-border hover:bg-muted/50 transition-colors">
              <p className="text-sm font-medium mb-1.5">MCP Servers</p>
              <p className="text-xs text-muted-foreground mb-4">
                Extend your agent with additional tools, APIs, and integrations via Model Context Protocol.
              </p>
              <span className="text-xs text-primary group-hover:underline">
                770+ servers &rarr;
              </span>
            </Link>
            <Link href="/marketplaces" className="group p-6 border-t md:border-t-0 md:border-l border-border hover:bg-muted/50 transition-colors">
              <p className="text-sm font-medium mb-1.5">Plugin Marketplaces</p>
              <p className="text-xs text-muted-foreground mb-4">
                Curated GitHub repositories containing collections of plugins and tools for AI agents.
              </p>
              <span className="text-xs text-primary group-hover:underline">
                95+ marketplaces &rarr;
              </span>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16 border-t border-border">
          <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-8">
            FAQ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 max-w-3xl">
            <div>
              <h3 className="text-sm font-medium mb-1.5">What are Claude Code skills?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reusable instruction sets that teach your agent specific tasks. Install with a single command.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">What are MCP servers?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protocol servers that extend your agent with tools, APIs, and integrations to external services.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">How is quality maintained?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Curated by install count, GitHub stars, and community votes. Only actively used extensions are listed.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">Is this free?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes. Completely free and open. Browse and install anything at no cost.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
