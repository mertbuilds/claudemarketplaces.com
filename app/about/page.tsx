import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, RefreshCw, Github, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About Claude Code Marketplaces - How It Works & Discovery Process",
  description:
    "Learn how Claude Code Marketplaces automatically discovers and catalogs Anthropic Claude plugin repositories from GitHub. Understand our validation process, hourly updates, and how to create your own marketplace.",
  openGraph: {
    title: "About Claude Code Marketplaces - How It Works",
    description:
      "Automated discovery of Claude Code plugins, extensions, and tools. Learn about our GitHub search process and marketplace validation.",
    url: "https://claudemarketplaces.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header subtitle="" showAboutLink={false} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Disclaimer */}
          <Card className="mb-8 border-muted-foreground/20 bg-muted/30">
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This is an independent,
                community-run directory and is not officially affiliated with
                Anthropic or Claude. All marketplace listings are automatically
                discovered from public GitHub repositories. Users should review
                plugin code and marketplace repositories before installation to
                ensure they meet their security and quality standards.
              </p>
            </CardContent>
          </Card>

          {/* What is this */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What is this site?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <p className="text-lg font-semibold text-foreground">
                  The fastest way to discover Claude Code plugins and
                  extensions.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Claude Code Marketplaces</strong> is the only
                  automated directory that continuously searches GitHub to find
                  and catalog every available{" "}
                  <strong>Claude Code plugin marketplace</strong>. Instead of
                  manually searching through hundreds of repositories, our
                  system does the heavy lifting for you—discovering, validating,
                  and updating marketplace information every single hour.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Plugin marketplaces</strong> are GitHub repositories
                  containing collections of <strong>Claude Code plugins</strong>{" "}
                  that extend Claude Code&apos;s functionality with new tools,
                  commands, and integrations. Whether you&apos;re looking for
                  development tools, productivity extensions, testing utilities,
                  or specialized integrations, our directory gives you instant
                  access to the entire Claude Code plugin ecosystem.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Search className="h-6 w-6 text-primary" />
                <CardTitle>How does it work?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Automatic Discovery</h4>
                    <p className="text-sm text-muted-foreground">
                      Our search automatically discovers GitHub repositories
                      containing valid
                      <code className="bg-muted px-1.5 py-0.5 rounded mx-1">
                        .claude-plugin/marketplace.json
                      </code>
                      files. This happens hourly to ensure we capture new
                      marketplaces as they&apos;re created.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Validation & Metadata
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Each discovered marketplace is validated to ensure it
                      follows the official Claude Code marketplace schema. We
                      extract key information like description, plugin count,
                      and categories.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">GitHub Star Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      We fetch and update GitHub star counts hourly for all
                      marketplaces, allowing you to sort and discover popular
                      marketplaces based on community engagement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creating a marketplace */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Github className="h-6 w-6 text-primary" />
                <CardTitle>Want to create your own marketplace?</CardTitle>
              </div>
              <CardDescription>
                Creating a marketplace is easy and requires no submission
                process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Simply create a GitHub repository with a valid
                <code className="bg-muted px-1.5 py-0.5 rounded mx-1">
                  .claude-plugin/marketplace.json
                </code>
                file following the official schema. Our search will
                automatically discover and list it within an hour.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" asChild>
                  <a
                    href="https://docs.claude.com/en/docs/claude-code/plugin-marketplaces#marketplace-schema"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    View Marketplace Schema
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://docs.claude.com/en/docs/claude-code/plugins-reference"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Plugins Reference
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-6 w-6 text-primary" />
                <CardTitle>Automatic Updates</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    New marketplaces are discovered hourly through GitHub search
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>GitHub star counts are refreshed hourly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Marketplace metadata (description, plugin count, categories)
                    is updated during each search
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>No manual submission or approval process required</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Validation Issues */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <CardTitle>Validation Issues?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you believe your marketplace is valid but couldn&apos;t be
                validated by our search, please reach out so we can investigate
                the issue.
              </p>
              <Button variant="outline" asChild>
                <a
                  href="mailto:mert@duzgun.dev?subject=Marketplace Validation Issue"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact: mert@duzgun.dev
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Open Source */}
          <Card>
            <CardHeader>
              <CardTitle>Open Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This site is open source and built with Claude Code. The search
                functionality and website code are available on GitHub.
              </p>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/mert-duzgun/claudemarketplaces.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
