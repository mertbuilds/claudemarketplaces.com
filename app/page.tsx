import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
      <Script
        id="schema-org"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Curated plugins, skills, and MCP servers for Claude Code
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A hand-picked directory of high-quality extensions with community voting and commenting (soon). Only the best tools make it here.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Browse skills
            </Link>
            <Link
              href="/mcp"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md font-medium hover:bg-muted transition-colors"
            >
              Browse MCP servers
            </Link>
          </div>
        </section>

        {/* Directory Cards */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/skills" className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-xl">Agent Skills</CardTitle>
                  <CardDescription>
                    Reusable instructions that teach your agent how to perform
                    specific tasks. Install with a single command.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-primary group-hover:underline">
                    Browse 2,300+ skills &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/mcp" className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-xl">MCP Servers</CardTitle>
                  <CardDescription>
                    Model Context Protocol servers that extend your agent with
                    additional tools, APIs, and integrations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-primary group-hover:underline">
                    Browse 770+ servers &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/marketplaces" className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Plugin Marketplaces
                  </CardTitle>
                  <CardDescription>
                    Curated GitHub repositories containing collections of
                    plugins, tools, and extensions for AI coding agents.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-primary group-hover:underline">
                    Browse 95+ marketplaces &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16 border-t">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">
                What are Claude Code skills?
              </h3>
              <p className="text-sm text-muted-foreground">
                Reusable instruction sets that teach your Claude Code agent how
                to perform specific tasks. Install with a single command and
                start using immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How is quality maintained?</h3>
              <p className="text-sm text-muted-foreground">
                We curate by install count, GitHub stars, and community votes.
                Only high-quality, actively used extensions are listed.
                Voting and commenting (soon) help surface the best tools.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is this free?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, completely free and open directory. Browse and install any
                skills, MCP servers, or plugins at no cost.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What are MCP servers?</h3>
              <p className="text-sm text-muted-foreground">
                Model Context Protocol servers provide additional tools and
                capabilities to AI coding agents. They extend your agent by
                connecting to external services, databases, APIs, and more.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                How do I install a skill?
              </h3>
              <p className="text-sm text-muted-foreground">
                Copy the install command from any skill page and run it in your
                terminal. Most skills can be installed with a single command and
                are ready to use immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What are plugin marketplaces?
              </h3>
              <p className="text-sm text-muted-foreground">
                GitHub repositories containing collections of plugins, skills,
                and tools curated by the community. They aggregate extensions
                from multiple sources into organized, browsable directories.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to enhance your workflow?
          </h2>
          <p className="text-muted-foreground mb-8">
            Curated extensions, community-driven quality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Browse skills
            </Link>
            <Link
              href="/marketplaces"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md font-medium hover:bg-muted transition-colors"
            >
              Browse marketplaces
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
