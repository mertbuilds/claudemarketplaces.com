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
import { ExternalLink, Search, Github, Mail, Star, Shield } from "lucide-react";

export const revalidate = 86400; // 1 day ISR

export const metadata: Metadata = {
  title: "About | Claude Code Marketplaces",
  description:
    "A curated, community-driven directory of high-quality Claude Code plugins, skills, and MCP servers. Learn how we maintain quality through curation and community features.",
  openGraph: {
    title: "About | Claude Code Marketplaces",
    description:
      "A curated, community-driven directory of high-quality Claude Code plugins, skills, and MCP servers.",
    url: "https://claudemarketplaces.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Disclaimer */}
          <Card className="mb-8 border-muted-foreground/20 bg-muted/30">
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This is an independent,
                community-run directory and is not officially affiliated with
                Anthropic or Claude. Users should review plugin code and
                repositories before installation to ensure they meet their
                security and quality standards.
              </p>
            </CardContent>
          </Card>

          {/* What is this */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What is this site?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-semibold text-foreground">
                A curated, community-driven directory of high-quality Claude
                Code extensions.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Claude Code Marketplaces</strong> is a hand-picked
                directory of plugins, skills, and MCP servers for Claude Code.
                Unlike raw aggregators, we filter by quality — only extensions
                with proven adoption (500+ installs), active GitHub repos, and
                community trust make it here.
              </p>
              <p className="text-sm text-muted-foreground">
                Community features like <strong>voting</strong> and{" "}
                <strong>commenting</strong> help surface the best tools and
                let developers share their experiences.
              </p>
            </CardContent>
          </Card>

          {/* Quality Curation */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>How we maintain quality</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Install threshold</h4>
                    <p className="text-sm text-muted-foreground">
                      Skills must have 500+ installs to be listed. This filters
                      out abandoned, test, and low-quality entries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">GitHub stars</h4>
                    <p className="text-sm text-muted-foreground">
                      We track GitHub star counts as a proxy for community trust
                      and project maturity. Sort by stars to find the most
                      trusted extensions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Community voting</h4>
                    <p className="text-sm text-muted-foreground">
                      Logged-in users can upvote or downvote any skill, plugin,
                      or MCP server. Community signals help surface the best
                      tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Comments</h4>
                    <p className="text-sm text-muted-foreground">
                      Leave reviews and share experiences on any listing,
                      helping others make informed decisions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How discovery works */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Search className="h-6 w-6 text-primary" />
                <CardTitle>How discovery works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We crawl multiple sources to find extensions, then apply our
                quality filters:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Skills</strong> are crawled from skills.sh with
                    install counts and filtered to 500+ installs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Plugin marketplaces</strong> are discovered from
                    GitHub repositories with valid marketplace schemas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>MCP servers</strong> are aggregated from community
                    directories
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    GitHub star counts are refreshed regularly across all
                    listings
                  </span>
                </li>
              </ul>
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
                Create a GitHub repository with a valid
                <code className="bg-muted px-1.5 py-0.5 rounded mx-1">
                  .claude-plugin/marketplace.json
                </code>
                file following the official schema. Our crawler will
                discover and list it automatically.
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

          {/* Contact & Open Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <CardTitle>Contact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Questions, issues, or want to get your extension listed?
                  Reach out.
                </p>
                <Button variant="outline" asChild>
                  <a
                    href="mailto:mert@vinena.studio?subject=Claude Code Marketplaces"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    mert@vinena.studio
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-primary" />
                  <CardTitle>Open Source</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This site is open source and built with Claude Code.
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
