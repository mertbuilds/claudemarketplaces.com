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
import { Badge } from "@/components/ui/badge";
import { Mail, Users, BarChart3, Megaphone, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise - Claude Code Marketplaces",
  description:
    "Advertise to a highly engaged audience of AI developers building with Claude Code. Reach developers actively using and creating Claude Code plugins and extensions.",
  openGraph: {
    title: "Advertise - Claude Code Marketplaces",
    description:
      "Advertise to a highly engaged audience of AI developers building with Claude Code.",
    url: "https://claudemarketplaces.com/advertise",
    type: "website",
  },
};

export default function AdvertisePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Why Advertise With Us */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Why Advertise With Us</CardTitle>
              </div>
              <CardDescription>
                Reach a niche audience of AI developers actively building with
                Claude Code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Claude Code Marketplaces is the go-to directory for developers
                discovering and building Claude Code plugins and extensions. Our
                audience isn&apos;t casual browsers — they&apos;re developers
                actively working with AI tools every day.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>Targeted reach</strong> to developers actively
                    building with AI
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>Growing community</strong> as Claude Code adoption
                    accelerates
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>High engagement</strong> niche audience with strong
                    intent
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Our Traffic */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary" />
                <CardTitle>Our Traffic</CardTitle>
              </div>
              <CardDescription>
                Live, public analytics data — fully transparent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full overflow-hidden rounded-lg border">
                <iframe
                  src="https://analytics.vinena.studio/share/overview/hwyH1d"
                  className="w-full border-0"
                  style={{ height: "600px" }}
                  title="Claude Code Marketplaces Analytics"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This is live, public analytics data powered by OpenPanel. What
                you see above is real-time traffic to claudemarketplaces.com.
              </p>
            </CardContent>
          </Card>

          {/* Ad Types & Pricing */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Megaphone className="h-6 w-6 text-primary" />
                <CardTitle>Ad Types &amp; Pricing</CardTitle>
              </div>
              <CardDescription>
                Simple, transparent pricing with no hidden fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {/* All Placements */}
                <div className="rounded-lg border border-primary bg-primary/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">All Placements</h4>
                    <span className="text-lg font-bold text-primary">$500/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Includes every ad type below. Maximum visibility across the entire site.
                  </p>
                  <p className="text-xs font-medium text-primary">
                    Best value — save over 40% vs. individual placements
                  </p>
                </div>

                {/* Floating Banner */}
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Floating Banner</h4>
                    <span className="text-lg font-bold text-primary">$300/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Persistent banner visible across all pages. Always in view as users browse.
                  </p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Preview</p>
                    <div className="pointer-events-none">
                      <div className="bg-primary/10 border border-primary/30 rounded-md p-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-medium text-foreground">Supercharge your AI workflow with AcmeAI — the fastest way to build agents.</p>
                        <span className="shrink-0 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-medium">Try Free</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pinned Cards */}
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Pinned Cards</h4>
                    <span className="text-lg font-bold text-primary">$250/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Featured cards at the top of listings. First thing users see when browsing.
                  </p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Preview</p>
                    <div className="pointer-events-none">
                      <div className="grid grid-cols-3 gap-2">
                        {/* Featured/pinned card — first position, highlighted */}
                        <div className="rounded-lg border border-primary bg-primary/5 p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">acme/ai-toolkit</p>
                            <Badge variant="outline" className="text-[10px] shrink-0 border-primary text-primary">Featured</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Build AI agents faster with pre-built components and templates.</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-[10px]">ai</Badge>
                            <Badge variant="secondary" className="text-[10px]">agents</Badge>
                          </div>
                        </div>
                        {/* Placeholder cards */}
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                          <div className="h-2 w-3/4 bg-muted rounded mb-2" />
                          <div className="h-2 w-full bg-muted/60 rounded mb-1" />
                          <div className="h-2 w-2/3 bg-muted/60 rounded" />
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                          <div className="h-2 w-2/3 bg-muted rounded mb-2" />
                          <div className="h-2 w-full bg-muted/60 rounded mb-1" />
                          <div className="h-2 w-1/2 bg-muted/60 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* In-Feed Cards */}
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">In-Feed Cards</h4>
                    <span className="text-lg font-bold text-primary">$200/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Native cards mixed into marketplace listings. Blends naturally with content.
                  </p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Preview</p>
                    <div className="pointer-events-none">
                      <div className="grid grid-cols-3 gap-2">
                        {/* Sponsored card — spans 2 rows */}
                        <div className="row-span-2 rounded-lg border border-border p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">acme/ai-toolkit</p>
                            <Badge variant="outline" className="text-[10px] shrink-0">Sponsored</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Build AI agents faster with pre-built components and templates for Claude Code.</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-[10px]">ai</Badge>
                            <Badge variant="secondary" className="text-[10px]">agents</Badge>
                            <Badge variant="secondary" className="text-[10px]">toolkit</Badge>
                          </div>
                        </div>
                        {/* Placeholder cards */}
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                          <div className="h-2 w-3/4 bg-muted rounded mb-2" />
                          <div className="h-2 w-full bg-muted/60 rounded mb-1" />
                          <div className="h-2 w-2/3 bg-muted/60 rounded" />
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                          <div className="h-2 w-2/3 bg-muted rounded mb-2" />
                          <div className="h-2 w-full bg-muted/60 rounded mb-1" />
                          <div className="h-2 w-1/2 bg-muted/60 rounded" />
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                          <div className="h-2 w-3/5 bg-muted rounded mb-2" />
                          <div className="h-2 w-full bg-muted/60 rounded mb-1" />
                          <div className="h-2 w-3/4 bg-muted/60 rounded" />
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                          <div className="h-2 w-1/2 bg-muted rounded mb-2" />
                          <div className="h-2 w-full bg-muted/60 rounded mb-1" />
                          <div className="h-2 w-2/3 bg-muted/60 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Listings */}
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Job Listings</h4>
                    <span className="text-lg font-bold text-primary">$49/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Post AI and developer job openings to reach qualified candidates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Started */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <CardTitle>Get Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ready to reach AI developers? Get in touch and we&apos;ll set up
                your campaign. We&apos;re happy to discuss custom packages and
                answer any questions about our audience.
              </p>
              <Button variant="default" asChild>
                <a
                  href="mailto:mert@duzgun.dev?subject=Advertising on Claude Code Marketplaces"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact: mert@duzgun.dev
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
