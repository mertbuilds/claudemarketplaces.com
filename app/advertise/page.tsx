import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Mail, ExternalLink } from "lucide-react";

const OP_API = "https://analytics.vinena.studio/api";
const OP_PROJECT = "claudemarketplacescom";

function formatNumber(n: number): string {
  const floored = Math.floor(n / 1_000) * 1_000;
  return floored.toLocaleString();
}

async function getTrafficStats() {
  try {
    const res = await fetch(
      `${OP_API}/insights/${OP_PROJECT}/metrics?range=30d`,
      {
        headers: {
          "openpanel-client-id":
            process.env.OPENPANEL_EXPORT_CLIENT_ID!,
          "openpanel-client-secret":
            process.env.OPENPANEL_EXPORT_CLIENT_SECRET!,
          "User-Agent": "Mozilla/5.0",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const m = data.metrics;
    const series: { unique_visitors: number; total_screen_views: number }[] =
      data.series ?? [];
    const last7 = series.slice(-7);
    const avgDailyVisitors =
      last7.length > 0
        ? Math.round(
            last7.reduce((s, d) => s + d.unique_visitors, 0) / last7.length,
          )
        : 0;
    const avgDailyPageViews =
      last7.length > 0
        ? Math.round(
            last7.reduce((s, d) => s + d.total_screen_views, 0) / last7.length,
          )
        : 0;
    return [
      { label: "Monthly Visitors", value: `${formatNumber(m.unique_visitors)}+` },
      { label: "Daily Visitors", value: "5,000+" },
      { label: "Daily Page Views", value: "25,000+" },
    ];
  } catch {
    return null;
  }
}

const FALLBACK_STATS = [
  { label: "Monthly Visitors", value: "105,000+" },
  { label: "Daily Visitors", value: "5,000+" },
  { label: "Daily Page Views", value: "25,000+" },
];

const ADVERTISERS = [
  { name: "1inch", logo: "/1inch.png", href: "https://1inch.io" },
  {
    name: "AppSignal",
    logo: "/appsignal.svg",
    href: "https://appsignal.com",
  },
  {
    name: "IdeaBrowser",
    logo: "/ideabrowser-symbol.webp",
    href: "https://ideabrowser.com",
  },
  { name: "MockHero", logo: "/mockhero.png", href: "https://mockhero.dev" },
];

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">
        {title}
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

export default async function AdvertisePage() {
  const TRAFFIC_STATS = (await getTrafficStats()) ?? FALLBACK_STATS;
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
                Put your product in front of 5,000+ developers who visit every
                day to find Claude Code plugins, skills, and MCP servers.
                Not casual browsers &mdash; builders actively shipping with AI.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">
                    Growing every month
                  </span>{" "}
                  &mdash; traffic doubled in the last 90 days
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    4 advertisers already on board
                  </span>{" "}
                  &mdash; 1inch, AppSignal, IdeaBrowser, MockHero
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    US-heavy global traffic
                  </span>{" "}
                  &mdash; #1 country by sessions, 120+ countries total
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Live public analytics
                  </span>{" "}
                  &mdash; verify every number yourself
                </li>
              </ul>
            </div>

            {/* Right column — traffic stats */}
            <div className="border border-border flex flex-col">
              {/* Hero stat */}
              <div className="px-6 pt-6 pb-5 border-b border-border">
                <span className="text-[10px] uppercase tracking-[0.12em] font-mono text-muted-foreground">
                  Monthly visitors
                </span>
                <p className="font-mono text-5xl md:text-6xl font-medium tracking-tight mt-2 leading-none">
                  {TRAFFIC_STATS[0].value}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  100% organic &mdash; zero paid traffic
                </p>
              </div>
              {/* Secondary stats */}
              <div className="grid grid-cols-2 gap-px bg-border flex-1">
                {TRAFFIC_STATS.slice(1).map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-background px-6 py-4"
                  >
                    <p className="font-mono text-2xl font-medium">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <a
                href="#analytics"
                className="px-6 py-2.5 border-t border-border flex items-center justify-between group"
              >
                <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                  Verify every number
                </span>
                <span className="text-[10px] text-primary group-hover:underline">
                  See live analytics &darr;
                </span>
              </a>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mt-8">
            <div className="p-4 bg-background">
              <p className="font-mono text-lg font-medium">&lt; $0.50</p>
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                Effective CPC
              </p>
            </div>
            <div className="p-4 bg-background">
              <p className="font-mono text-lg font-medium">10&ndash;14x</p>
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                Cheaper than Google Ads
              </p>
            </div>
            <div className="p-4 bg-background">
              <p className="font-mono text-lg font-medium">2x</p>
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                Traffic growth in 90 days
              </p>
            </div>
            <div className="p-4 bg-background">
              <p className="font-mono text-lg font-medium">Same day</p>
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                Go live after payment
              </p>
            </div>
          </div>
        </section>

        {/* Trusted by */}
        <section className="container mx-auto px-4 py-10">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground text-center mb-6">
            Trusted by
          </p>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {ADVERTISERS.map((a) => (
              <a
                key={a.name}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.logo}
                  alt={a.name}
                  className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                />
              </a>
            ))}
          </div>
        </section>

        {/* Section 01 / Live Analytics */}
        <section id="analytics" className="container mx-auto px-4 pb-16">
          <SectionLabel title="Live Analytics" />
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

        {/* Section 02 / Placements + Performance + Comparison */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column — Placements */}
            <div>
              <SectionLabel title="Placements" />

              {/* All Placements — featured tier */}
              <div className="border border-primary bg-primary/5 p-6 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium">All Placements</h3>
                  </div>
                  <div>
                    <span className="font-mono text-xl">$1,099</span>
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
              <div className="grid grid-cols-1 gap-px bg-border border border-border">
                {/* Pinned Cards */}
                <div className="p-6 bg-background flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-medium">Pinned Cards</h3>
                    </div>
                    <div>
                      <span className="font-mono text-lg">$799</span>
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
                        {/* Real pinned card */}
                        <div className="border border-primary bg-primary/5 p-3 flex flex-col gap-2">
                          <div className="flex gap-2 items-start">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/1inch.png" alt="1inch" className="h-3.5 w-3.5 shrink-0 mt-[0.15rem]" />
                            <p className="text-sm font-medium leading-snug">
                              Make your agent a DeFi expert
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            Real-time data across 13 networks, powered by 1inch.
                          </p>
                          <span className="text-xs font-medium text-primary mt-auto">
                            Install now &rarr;
                          </span>
                        </div>
                        {/* Placeholder cards */}
                        <div className="border border-border/50 bg-muted/30 p-3 flex flex-col gap-2">
                          <div className="h-2 w-3/4 bg-muted rounded" />
                          <div className="h-2 w-full bg-muted/60 rounded" />
                          <div className="h-2 w-2/3 bg-muted/60 rounded" />
                        </div>
                        <div className="border border-border/50 bg-muted/30 p-3 flex flex-col gap-2">
                          <div className="h-2 w-2/3 bg-muted rounded" />
                          <div className="h-2 w-full bg-muted/60 rounded" />
                          <div className="h-2 w-1/2 bg-muted/60 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Buy row */}
                  <div className="flex items-center justify-end gap-4 mt-auto pt-4">
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
                      <span className="font-mono text-lg">$499</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Native cards mixed into marketplace, skill, and MCP listings.
                    Blends naturally with content.
                  </p>
                  {/* Preview */}
                  <div className="mt-4 pt-4 border-t border-border hidden md:block">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                      Preview
                    </p>
                    <div className="bg-muted/20 border border-border p-4">
                      <div className="grid grid-cols-3 gap-2">
                        {/* Row 1 */}
                        <div className="border border-border/50 bg-muted/30 p-3 flex flex-col gap-2">
                          <div className="h-2 w-3/4 bg-muted rounded" />
                          <div className="h-2 w-full bg-muted/60 rounded" />
                          <div className="h-2 w-2/3 bg-muted/60 rounded" />
                        </div>
                        <div className="border border-border/50 bg-muted/30 p-3 flex flex-col gap-2">
                          <div className="h-2 w-2/3 bg-muted rounded" />
                          <div className="h-2 w-full bg-muted/60 rounded" />
                          <div className="h-2 w-1/2 bg-muted/60 rounded" />
                        </div>
                        <div className="border border-border/50 bg-muted/30 p-3 flex flex-col gap-2">
                          <div className="h-2 w-3/5 bg-muted rounded" />
                          <div className="h-2 w-full bg-muted/60 rounded" />
                          <div className="h-2 w-3/4 bg-muted/60 rounded" />
                        </div>
                        {/* Row 2 — sponsored card sits in the grid like any other card */}
                        <div className="border border-primary bg-white p-3 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/1inch.png" alt="1inch" className="h-4 w-4 shrink-0" />
                            <p className="text-sm font-medium">DeFi MCP</p>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            Connect your Claude agent to onchain data via 1inch: prices, trade routes and wallet activity.
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-[9px]">
                              defi
                            </Badge>
                            <Badge variant="secondary" className="text-[9px]">
                              mcp
                            </Badge>
                            <Badge variant="secondary" className="text-[9px]">
                              crypto
                            </Badge>
                          </div>
                          <span className="text-[11px] font-medium mt-auto">
                            Install now &rarr;
                          </span>
                          <Badge variant="outline" className="text-[9px] w-fit">
                            Sponsored
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex-1 border border-border/50 bg-muted/30 p-2 flex flex-col gap-1.5">
                            <div className="h-2 w-1/2 bg-muted rounded" />
                            <div className="h-2 w-full bg-muted/60 rounded" />
                          </div>
                          <div className="flex-1 border border-border/50 bg-muted/30 p-2 flex flex-col gap-1.5">
                            <div className="h-2 w-2/3 bg-muted rounded" />
                            <div className="h-2 w-full bg-muted/60 rounded" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex-1 border border-border/50 bg-muted/30 p-2 flex flex-col gap-1.5">
                            <div className="h-2 w-3/4 bg-muted rounded" />
                            <div className="h-2 w-full bg-muted/60 rounded" />
                          </div>
                          <div className="flex-1 border border-border/50 bg-muted/30 p-2 flex flex-col gap-1.5">
                            <div className="h-2 w-1/2 bg-muted rounded" />
                            <div className="h-2 w-full bg-muted/60 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Buy row */}
                  <div className="flex items-center justify-end gap-4 mt-auto pt-4">
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

                {/* Job Listings */}
                <div className="p-6 bg-background flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                    <h3 className="text-sm font-medium">Job Listings</h3>
                    <div>
                      <span className="font-mono text-lg">$199</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Post AI and developer job openings to reach qualified candidates.
                  </p>
                  {/* Buy row */}
                  <div className="flex items-center justify-end gap-4 mt-auto pt-4">
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
            </div>

            {/* Right column — Performance & Comparison */}
            <div className="space-y-8">
              {/* Expected Performance */}
              <div>
                <SectionLabel title="Expected Performance" />
                <div className="grid grid-cols-3 gap-px bg-border border border-border">
                  <div className="p-4 bg-background">
                    <p className="font-mono text-xl font-medium">2,000+</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Clicks/mo (All Placements)
                    </p>
                  </div>
                  <div className="p-4 bg-background">
                    <p className="font-mono text-xl font-medium">&lt; $0.50</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Effective CPC
                    </p>
                  </div>
                  <div className="p-4 bg-background">
                    <p className="font-mono text-xl font-medium">100%</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Organic, high-intent
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on real advertiser data from the last 7 days. All traffic
                  numbers verifiable via the live analytics above. Add UTM links to
                  track performance from your own dashboard.
                </p>
              </div>

              {/* vs. Google Ads */}
              <div>
                <SectionLabel title="vs. Google Ads" />
                <div className="grid grid-cols-3 gap-px bg-border border border-border">
                  <div className="p-4 bg-background">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      Google Ads avg CPC
                    </p>
                    <p className="font-mono text-xl font-medium">$5.26</p>
                    <a
                      href="https://www.wordstream.com/blog/2025-google-ads-benchmarks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      WordStream 2025 <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                  <div className="p-4 bg-background">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      B2B SaaS avg CPC
                    </p>
                    <p className="font-mono text-xl font-medium">$5.70</p>
                    <a
                      href="https://www.adlabz.co/b2b-saas-google-ads-benchmarks-for-2025"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      AdLabz 2025 <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                  <div className="p-4 bg-background">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      DevTools avg CPC
                    </p>
                    <p className="font-mono text-xl font-medium">$7.50</p>
                    <a
                      href="https://www.growthspreeofficial.com/blogs/saas-google-ads-benchmarks-2026-cpc-cpl-ctr-conversion-rate-by-vertical"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      GrowthSpree 2026 <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>

                {/* Comparison callout */}
                <div className="border border-border border-t-0 p-4 bg-background">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Our effective CPC: &lt; $0.50
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        At $1,099/mo for 2,000+ clicks, that&apos;s roughly{" "}
                        <span className="font-medium text-foreground">10&ndash;14x cheaper</span>{" "}
                        than Google Ads for the same developer audience. B2B SaaS
                        non-branded search CPC rose 29% year-over-year to $5.34{" "}
                        <a
                          href="https://dreamdata.io/blog/benchmark-google-search-non-branded-ads"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          (Dreamdata) <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                        , and high-intent software keywords like &ldquo;monitoring
                        software&rdquo; cost $65+/click{" "}
                        <a
                          href="https://ppc.io/blog/high-cpc-keywords"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          (PPC.io 2026) <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                        .
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Plus: our traffic is 100% organic and high-intent. No wasted
                        spend on casual searchers.
                      </p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                        Don&apos;t take our word for it
                      </p>
                      <a
                        href={`https://chatgpt.com/?q=${encodeURIComponent(
                          `I'm evaluating an advertising opportunity on claudemarketplaces.com, a developer tools directory for Claude Code plugins, skills, and MCP servers. They have 105,000+ monthly visitors (100% organic, zero paid traffic) and public analytics at https://analytics.vinena.studio/share/overview/hwyH1d.

Their pricing:
- All Placements (pinned + in-feed + jobs): $1,099/mo
- Pinned Cards only: $799/mo
- In-Feed Cards only: $499/mo
- Job Listings only: $199/mo

They claim 2,000+ clicks/month for the All Placements tier, which works out to ~$0.55 effective CPC.

For context, industry benchmarks show:
- Google Ads overall average CPC: $5.26 (WordStream 2025)
- B2B SaaS search CPC: $5.70 (AdLabz 2025)
- DevTools vertical CPC: $7.50 (GrowthSpree 2026)
- Non-branded B2B search CPC: $5.34, up 29% YoY (Dreamdata 2025)

Is this good value for reaching developers compared to Google Ads? What should I look out for?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium border border-border px-4 py-2 hover:bg-muted/50 transition-colors"
                      >
                        Ask ChatGPT if these prices are good
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        Opens ChatGPT with our real pricing data pre-filled
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <SectionLabel title="FAQ" />
                <div className="grid grid-cols-1 gap-px bg-border border border-border">
                  <div className="p-4 bg-background">
                    <h3 className="text-sm font-medium mb-1">
                      Who&apos;s your audience?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Developers actively building with Claude Code, AI tools, and
                      MCP servers. 100% organic traffic from search and direct
                      visits. No bots, no paid traffic.
                    </p>
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="text-sm font-medium mb-1">
                      How do ads rotate?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      In-feed cards rotate daily across Skills, MCP, and Marketplaces
                      pages. Floating banners rotate every few seconds. Pinned cards
                      auto-rotate in groups of 3.
                    </p>
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="text-sm font-medium mb-1">
                      How fast can I go live?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Same day. After payment you fill in your ad copy and links.
                      Your ads go live within hours.
                    </p>
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="text-sm font-medium mb-1">
                      What reporting do I get?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Impressions, clicks, and CTR per advertiser across every ad
                      surface. Plus our analytics are public so you can verify
                      traffic anytime.
                    </p>
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="text-sm font-medium mb-1">
                      Can I update my ad copy?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Yes. Email us your updated headline, body, and links and
                      we&apos;ll swap them in anytime.
                    </p>
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="text-sm font-medium mb-1">
                      How do I cancel?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Cancel anytime from your billing dashboard or email us.
                      Your ad runs until the end of the paid period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 05 / Get Started */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="Get Started" />
          <div className="max-w-xl">
            <p className="text-sm text-muted-foreground mb-4">
              Pick a placement above and buy directly, or email us for a
              custom package.
            </p>
            <a
              href="mailto:mert@vinena.studio?subject=Advertising on Claude Code Marketplaces"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email us at mert@vinena.studio
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
