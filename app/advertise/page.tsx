import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

const TRAFFIC_STATS = [
  { label: "Monthly Visitors", value: "100,000+" },
  { label: "Daily Sessions", value: "4,000+" },
  { label: "Daily Page Views", value: "20,000+" },
  { label: "Avg. Session", value: "3m 21s" },
  { label: "Bounce Rate", value: "< 45%" },
];

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
        {/* Hero */}
        <section className="container mx-auto px-4 pt-10 pb-4 md:pt-12 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left column */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-normal mb-3">
                Advertise
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Reach a niche audience of AI developers actively building with
                Claude Code. Our visitors aren&apos;t casual browsers &mdash;
                they&apos;re developers working with AI tools every day.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">
                    Targeted reach
                  </span>{" "}
                  &mdash; developers actively building with AI
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Growing community
                  </span>{" "}
                  &mdash; Claude Code adoption accelerating
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    High engagement
                  </span>{" "}
                  &mdash; niche audience with strong intent
                </li>
              </ul>
            </div>

            {/* Right column — traffic stats */}
            <div className="border border-border">
              <div className="px-4 py-2.5 border-b border-border">
                <span className="text-[10px] uppercase tracking-[0.12em] font-mono text-muted-foreground">
                  Monthly traffic
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-border">
                {TRAFFIC_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-background p-3 text-center"
                  >
                    <p className="font-mono text-base font-medium">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Growing monthly
                </span>
                <a
                  href="#analytics"
                  className="text-[10px] text-primary hover:underline"
                >
                  See live analytics &darr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 01 / Live Analytics */}
        <section id="analytics" className="container mx-auto px-4 pb-16">
          <SectionLabel number="01" title="Live Analytics" />
          <div className="border border-border overflow-hidden">
            <iframe
              src="https://analytics.vinena.studio/share/overview/hwyH1d?range=30d"
              className="w-full border-0"
              style={{ height: "600px" }}
              title="Claude Code Marketplaces Analytics"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Live, public analytics powered by OpenPanel. Real-time traffic data
            for claudemarketplaces.com. Fully organic traffic.
          </p>
        </section>

        {/* Section 02 / Placements */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel number="02" title="Placements" />

          {/* All Placements — featured tier */}
          <div className="border border-primary bg-primary/5 p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium">All Placements</h3>
              </div>
              <div>
                <span className="font-mono text-xl">$999</span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">
              Maximum visibility across the entire site. Includes every placement
              type below.
            </p>
            <p className="text-[10px] uppercase tracking-[0.08em] text-primary font-mono mb-4">
              Best value &mdash; includes every placement
            </p>
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-primary/20">
              <a
                href="mailto:mert@vinena.studio?subject=Question about All Placements on Claude Code Marketplaces"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Questions?
              </a>
              <a
                href="https://vinena.lemonsqueezy.com/checkout/buy/014f30de-3215-4f7c-874b-525e8ce8a62d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium bg-foreground text-background px-4 py-1.5 hover:bg-foreground/90 transition-colors"
              >
                Buy Now
              </a>
            </div>
          </div>

          {/* Individual tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            {/* Pinned Cards */}
            <div className="p-6 bg-background flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium">Pinned Cards</h3>
                </div>
                <div>
                  <span className="font-mono text-lg">$499</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Featured cards at the top of listings. First thing users see when
                browsing.
              </p>
              {/* Preview */}
              <div className="mt-4 pt-4 border-t border-border hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                  Preview
                </p>
                <div className="bg-muted/20 border border-border p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Featured/pinned card */}
                    <div className="border border-primary bg-primary/5 p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          acme/ai-toolkit
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0 border-primary text-primary"
                        >
                          Featured
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Build AI agents faster with pre-built components and
                        templates.
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-[10px]">
                          ai
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          agents
                        </Badge>
                      </div>
                    </div>
                    {/* Placeholder cards */}
                    <div className="border border-border/50 bg-muted/30 p-3">
                      <div className="h-2 w-3/4 bg-muted mb-2" />
                      <div className="h-2 w-full bg-muted/60 mb-1" />
                      <div className="h-2 w-2/3 bg-muted/60" />
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-3">
                      <div className="h-2 w-2/3 bg-muted mb-2" />
                      <div className="h-2 w-full bg-muted/60 mb-1" />
                      <div className="h-2 w-1/2 bg-muted/60" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Buy row */}
              <div className="flex items-center justify-end gap-4 mt-auto pt-4 border-t border-border">
                <a
                  href="mailto:mert@vinena.studio?subject=Question about Pinned Cards on Claude Code Marketplaces"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Questions?
                </a>
                <a
                  href="https://vinena.lemonsqueezy.com/checkout/buy/b913dcd2-0882-40e0-88de-d7dcd020be12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border border-border px-4 py-1.5 hover:bg-muted/50 transition-colors"
                >
                  Buy Now
                </a>
              </div>
            </div>

            {/* In-Feed Cards */}
            <div className="p-6 bg-background flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium">In-Feed Cards</h3>
                </div>
                <div>
                  <span className="font-mono text-lg">$349</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Native cards mixed into marketplace and skill listings. Blends
                naturally with content.
              </p>
              {/* Preview */}
              <div className="mt-4 pt-4 border-t border-border hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                  Preview
                </p>
                <div className="bg-muted/20 border border-border p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Sponsored card — spans 2 rows */}
                    <div className="row-span-2 border border-primary p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          acme/ai-toolkit
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0"
                        >
                          Sponsored
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Build AI agents faster with pre-built components and
                        templates for Claude Code.
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-[10px]">
                          ai
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          agents
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          toolkit
                        </Badge>
                      </div>
                    </div>
                    {/* Placeholder cards */}
                    <div className="border border-border/50 bg-muted/30 p-3">
                      <div className="h-2 w-3/4 bg-muted mb-2" />
                      <div className="h-2 w-full bg-muted/60 mb-1" />
                      <div className="h-2 w-2/3 bg-muted/60" />
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-3">
                      <div className="h-2 w-2/3 bg-muted mb-2" />
                      <div className="h-2 w-full bg-muted/60 mb-1" />
                      <div className="h-2 w-1/2 bg-muted/60" />
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-3">
                      <div className="h-2 w-3/5 bg-muted mb-2" />
                      <div className="h-2 w-full bg-muted/60 mb-1" />
                      <div className="h-2 w-3/4 bg-muted/60" />
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-3">
                      <div className="h-2 w-1/2 bg-muted mb-2" />
                      <div className="h-2 w-full bg-muted/60 mb-1" />
                      <div className="h-2 w-2/3 bg-muted/60" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Buy row */}
              <div className="flex items-center justify-end gap-4 mt-auto pt-4 border-t border-border">
                <a
                  href="mailto:mert@vinena.studio?subject=Question about In-Feed Cards on Claude Code Marketplaces"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Questions?
                </a>
                <a
                  href="https://vinena.lemonsqueezy.com/checkout/buy/3089afc8-406a-4527-94ba-4bac33378fe7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border border-border px-4 py-1.5 hover:bg-muted/50 transition-colors"
                >
                  Buy Now
                </a>
              </div>
            </div>

            {/* Floating Banner */}
            <div className="p-6 bg-background flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium">Floating Banner</h3>
                </div>
                <div>
                  <span className="font-mono text-lg">$299</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Compact floating banner pinned to the bottom-right corner.
                Always visible as users browse.
              </p>
              {/* Preview */}
              <div className="mt-4 pt-4 border-t border-border hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                  Preview
                </p>
                <div className="pointer-events-none relative bg-muted/20 border border-border h-32">
                  <div className="absolute bottom-2 right-2 max-w-[260px] bg-primary/10 border border-primary/30 p-2.5 flex items-center gap-2">
                    <p className="text-[11px] font-medium text-foreground leading-tight">
                      Supercharge your AI workflow with AcmeAI
                    </p>
                    <span className="shrink-0 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 font-medium">
                      Try Free
                    </span>
                  </div>
                </div>
              </div>
              {/* Buy row */}
              <div className="flex items-center justify-end gap-4 mt-auto pt-4 border-t border-border">
                <a
                  href="mailto:mert@vinena.studio?subject=Question about Floating Banner on Claude Code Marketplaces"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Questions?
                </a>
                <a
                  href="https://vinena.lemonsqueezy.com/checkout/buy/4e1e19ee-cf01-47ef-b648-0787e5d75824"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border border-border px-4 py-1.5 hover:bg-muted/50 transition-colors"
                >
                  Buy Now
                </a>
              </div>
            </div>

            {/* Job Listings */}
            <div className="p-6 bg-background flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                <h3 className="text-sm font-medium">Job Listings</h3>
                <div>
                  <span className="font-mono text-lg">$99</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Post AI and developer job openings to reach qualified candidates.
              </p>
              {/* Buy row */}
              <div className="flex items-center justify-end gap-4 mt-auto pt-4 border-t border-border">
                <a
                  href="mailto:mert@vinena.studio?subject=Question about Job Listings on Claude Code Marketplaces"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Questions?
                </a>
                <a
                  href="https://vinena.lemonsqueezy.com/checkout/buy/cb2daedf-c722-4c84-a5e9-c73ea375141f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border border-border px-4 py-1.5 hover:bg-muted/50 transition-colors"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03 / Get Started */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel number="03" title="Get Started" />
          <div className="max-w-xl">
            <p className="text-sm text-muted-foreground mb-4">
              Pick a placement above to get started instantly. Need a custom
              package or have questions about our audience?
            </p>
            <a
              href="mailto:mert@vinena.studio?subject=Advertising on Claude Code Marketplaces"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              mert@vinena.studio
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
