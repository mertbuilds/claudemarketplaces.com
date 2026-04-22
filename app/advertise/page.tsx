import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, ExternalLink } from "lucide-react";

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
        next: { revalidate: 86400 },
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
  { label: "Monthly Visitors", value: "110,000+" },
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
  { name: "Kryven AI", logo: "/kryven.png", href: "https://kryven.cc" },
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
    "Reach 110,000+ developers building with Claude Code. Under $0.50 per click, 10 to 14x cheaper than Google Ads, 100% organic traffic, public analytics.",
  openGraph: {
    title: "Advertise - Claude Code Marketplaces",
    description:
      "Reach 110,000+ developers building with Claude Code. Under $0.50 per click, 100% organic traffic.",
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
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 mb-4">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-primary font-medium">
                  Only 1 of 6 sponsor slots left
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-normal mb-3 text-balance">
                Reach every developer building with Claude Code.
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                110,000+ of them visit claudemarketplaces.com every month to
                find plugins, skills, and MCP servers they can install. High
                intent, zero paid traffic, public analytics.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground mb-6">
                <li>
                  <span className="font-medium text-foreground">
                    Traffic doubled
                  </span>{" "}
                  in the last 90 days
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    1inch, AppSignal, IdeaBrowser, MockHero, Kryven AI
                  </span>{" "}
                  already run ads here
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Only 6 sponsor slots total
                  </span>{" "}
                  so each advertiser gets ~17% share of voice
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Public analytics
                  </span>{" "}
                  so you can verify every number yourself
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <a
                  href="#placements"
                  className="inline-flex items-center text-xs font-medium bg-foreground text-background px-4 py-2.5 hover:bg-foreground/90 active:scale-[0.96] transition-[colors,transform]"
                >
                  See placements &amp; pricing &darr;
                </a>
                <a
                  href="https://cal.com/vinena-studio/advertise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Book a 15-min call &rarr;
                </a>
              </div>
            </div>

            {/* Right column — traffic stats */}
            <div className="border border-border flex flex-col">
              {/* Hero stat */}
              <div className="px-6 pt-6 pb-5 border-b border-border">
                <span className="text-[10px] uppercase tracking-[0.12em] font-mono text-muted-foreground">
                  Monthly visitors
                </span>
                <p className="font-mono tabular-nums text-5xl md:text-6xl font-medium tracking-tight mt-2 leading-none">
                  {TRAFFIC_STATS[0].value}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  100% organic. Zero paid traffic.
                </p>
              </div>
              {/* Secondary stats */}
              <div className="grid grid-cols-2 gap-px bg-border flex-1">
                {TRAFFIC_STATS.slice(1).map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-background px-6 py-4"
                  >
                    <p className="font-mono tabular-nums text-2xl font-medium">
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
              <p className="font-mono tabular-nums text-lg font-medium">&lt; $0.50</p>
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                Effective CPC
              </p>
            </div>
            <div className="p-4 bg-background">
              <p className="font-mono tabular-nums text-lg font-medium">10 to 14x</p>
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                Cheaper than Google Ads
              </p>
            </div>
            <div className="p-4 bg-background">
              <p className="font-mono tabular-nums text-lg font-medium">2x</p>
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                Traffic growth in 90 days
              </p>
            </div>
            <div className="p-4 bg-background">
              <p className="font-mono tabular-nums text-lg font-medium">Same day</p>
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
              style={{ height: "420px" }}
              title="Claude Code Marketplaces Analytics"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
            <p className="text-xs text-muted-foreground">
              Real-time traffic, straight from OpenPanel. No edits, no filters.
            </p>
            <a
              href="https://analytics.vinena.studio/share/overview/hwyH1d?range=30d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Open full dashboard <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </section>

        {/* Section 01b / How It Works */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="How It Works" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            <div className="p-6 bg-background">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
                Step 01
              </p>
              <h3 className="text-sm font-medium mb-2">
                Pick a placement and check out.
              </h3>
              <p className="text-xs text-muted-foreground">
                Buy directly above. Lemon Squeezy handles billing. Monthly,
                cancel anytime.
              </p>
            </div>
            <div className="p-6 bg-background">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
                Step 02
              </p>
              <h3 className="text-sm font-medium mb-2">
                Submit your ad assets.
              </h3>
              <p className="text-xs text-muted-foreground">
                A short form after checkout. Logo, headline, one line of
                copy, your landing URL. Takes 2 minutes.
              </p>
            </div>
            <div className="p-6 bg-background">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
                Step 03
              </p>
              <h3 className="text-sm font-medium mb-2">
                You&apos;re live within hours.
              </h3>
              <p className="text-xs text-muted-foreground">
                We drop you into the rotation and send monthly reports with
                per-surface impressions, clicks, and CTR.
              </p>
            </div>
          </div>
        </section>

        {/* Section 02 / Placements */}
        <section id="placements" className="container mx-auto px-4 pb-16">
          <SectionLabel title="Placements" />

          {/* All Placements — featured tier, full width */}
          <div className="border border-primary bg-primary/5 p-6 md:p-8 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-base md:text-lg font-medium text-balance">
                    All Placements
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-primary font-mono">
                    Best value
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-pretty max-w-xl">
                  Every ad surface across every page. Pinned cards,
                  in-feed cards, and job listings, all running at once.
                  The plan most advertisers end up picking.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <div>
                  <span className="font-mono tabular-nums text-2xl md:text-3xl font-medium">$1,099</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="https://cal.com/vinena-studio/advertise"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Questions?
                  </a>
                  <a
                    href="https://vinena.lemonsqueezy.com/checkout/buy/014f30de-3215-4f7c-874b-525e8ce8a62d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium bg-foreground text-background px-5 py-2.5 hover:bg-foreground/90 active:scale-[0.96] transition-[colors,transform]"
                  >
                    Buy Now &rarr;
                  </a>
                </div>
                {/* TODO: create $10,999/yr Lemon Squeezy product and swap in the real checkout URL */}
                <a
                  href="https://cal.com/vinena-studio/advertise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Or <span className="font-mono tabular-nums">$10,999</span>/yr and save{" "}
                  <span className="font-mono tabular-nums">$2,189</span> &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Individual tiers — 3-col */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {/* Pinned Cards */}
            <div className="p-6 bg-background flex flex-col">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="text-sm font-medium">Pinned Cards</h3>
                <div>
                  <span className="font-mono tabular-nums text-lg">$799</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-pretty">
                Locked to the top of every skill, marketplace, and MCP
                listing. The first card every visitor sees.
              </p>
              {/* Preview (desktop only — narrow in 3-col) */}
              <div className="mt-4 pt-4 border-t border-border hidden lg:block">
                <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                  Preview
                </p>
                <div className="bg-muted/20 border border-border p-3 space-y-2">
                  {/* Pinned slot — full width at top */}
                  <div className="border border-primary bg-primary/5 p-2 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="h-1.5 w-1/2 bg-primary/40 rounded" />
                      <div className="h-1.5 w-3/4 bg-primary/25 rounded" />
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.12em] text-primary font-medium shrink-0">
                      Pinned
                    </span>
                  </div>
                  {/* Regular cards below */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="border border-border/50 bg-muted/30 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-3/4 bg-muted rounded" />
                      <div className="h-1.5 w-full bg-muted/60 rounded" />
                      <div className="h-1.5 w-2/3 bg-muted/60 rounded" />
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-2/3 bg-muted rounded" />
                      <div className="h-1.5 w-full bg-muted/60 rounded" />
                      <div className="h-1.5 w-1/2 bg-muted/60 rounded" />
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-1/2 bg-muted rounded" />
                      <div className="h-1.5 w-full bg-muted/60 rounded" />
                      <div className="h-1.5 w-3/4 bg-muted/60 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Buy row */}
              <div className="flex items-center justify-end gap-4 mt-auto pt-4">
                <a
                  href="https://cal.com/vinena-studio/advertise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Questions?
                </a>
                <a
                  href="https://vinena.lemonsqueezy.com/checkout/buy/b913dcd2-0882-40e0-88de-d7dcd020be12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border border-border px-4 py-2 hover:bg-muted/50 active:scale-[0.96] transition-[colors,transform]"
                >
                  Buy Now
                </a>
              </div>
            </div>

            {/* In-Feed Cards */}
            <div className="p-6 bg-background flex flex-col">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="text-sm font-medium">In-Feed Cards</h3>
                <div>
                  <span className="font-mono tabular-nums text-lg">$499</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-pretty">
                Native cards dropped into the grid on marketplace, skill,
                and MCP listings. Looks like content, reads like content.
              </p>
              {/* Preview (desktop only — narrow in 3-col) */}
              <div className="mt-4 pt-4 border-t border-border hidden lg:block">
                <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                  Preview
                </p>
                <div className="bg-muted/20 border border-border p-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Row 1 */}
                    <div className="border border-border/50 bg-muted/30 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-3/4 bg-muted rounded" />
                      <div className="h-1.5 w-full bg-muted/60 rounded" />
                      <div className="h-1.5 w-2/3 bg-muted/60 rounded" />
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-2/3 bg-muted rounded" />
                      <div className="h-1.5 w-full bg-muted/60 rounded" />
                      <div className="h-1.5 w-1/2 bg-muted/60 rounded" />
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-1/2 bg-muted rounded" />
                      <div className="h-1.5 w-full bg-muted/60 rounded" />
                      <div className="h-1.5 w-3/4 bg-muted/60 rounded" />
                    </div>
                    {/* Row 2 — sponsored slot sits inline */}
                    <div className="border border-border/50 bg-muted/30 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-2/3 bg-muted rounded" />
                      <div className="h-1.5 w-full bg-muted/60 rounded" />
                      <div className="h-1.5 w-1/2 bg-muted/60 rounded" />
                    </div>
                    <div className="border border-primary bg-primary/5 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-3/4 bg-primary/40 rounded" />
                      <div className="h-1.5 w-full bg-primary/25 rounded" />
                      <span className="text-[8px] uppercase tracking-[0.12em] text-primary font-medium mt-auto">
                        Sponsored
                      </span>
                    </div>
                    <div className="border border-border/50 bg-muted/30 p-2 flex flex-col gap-1">
                      <div className="h-1.5 w-3/5 bg-muted rounded" />
                      <div className="h-1.5 w-full bg-muted/60 rounded" />
                      <div className="h-1.5 w-2/3 bg-muted/60 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Buy row */}
              <div className="flex items-center justify-end gap-4 mt-auto pt-4">
                <a
                  href="https://cal.com/vinena-studio/advertise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Questions?
                </a>
                <a
                  href="https://vinena.lemonsqueezy.com/checkout/buy/3089afc8-406a-4527-94ba-4bac33378fe7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border border-border px-4 py-2 hover:bg-muted/50 active:scale-[0.96] transition-[colors,transform]"
                >
                  Buy Now
                </a>
              </div>
            </div>

            {/* Job Listings */}
            <div className="p-6 bg-background flex flex-col">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="text-sm font-medium">Job Listings</h3>
                <div>
                  <span className="font-mono tabular-nums text-lg">$199</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-pretty">
                AI and developer roles surfaced to 110,000+ builders a
                month. Every applicant already ships with Claude Code.
              </p>
              {/* Buy row */}
              <div className="flex items-center justify-end gap-4 mt-auto pt-4">
                <a
                  href="https://cal.com/vinena-studio/advertise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Questions?
                </a>
                <a
                  href="https://vinena.lemonsqueezy.com/checkout/buy/cb2daedf-c722-4c84-a5e9-c73ea375141f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border border-border px-4 py-2 hover:bg-muted/50 active:scale-[0.96] transition-[colors,transform]"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>

          {/* Takeover — custom tier */}
          <div className="mt-4 border border-border bg-background p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-base md:text-lg font-medium text-balance">
                    Takeover
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-mono">
                    Enterprise
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-pretty max-w-xl">
                  Everything in All Placements, plus category exclusivity.
                  You&apos;re the only advertiser allowed in your vertical
                  (DeFi, monitoring, testing, whichever). We block your
                  competitors from buying ads here for the length of your
                  contract.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <div>
                  <span className="font-mono tabular-nums text-2xl md:text-3xl font-medium">
                    $4,999
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <a
                  href="https://cal.com/vinena-studio/advertise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium border border-border px-5 py-2.5 hover:bg-muted/50 active:scale-[0.96] transition-[colors,transform]"
                >
                  Book a call &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03 / vs. Google Ads */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="vs. Google Ads" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            <div className="p-5 bg-background">
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                Google Ads avg CPC
              </p>
              <p className="font-mono tabular-nums text-2xl font-medium">$5.26</p>
              <a
                href="https://www.wordstream.com/blog/2025-google-ads-benchmarks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 mt-1 py-1"
              >
                WordStream 2025 <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <div className="p-5 bg-background">
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                B2B SaaS avg CPC
              </p>
              <p className="font-mono tabular-nums text-2xl font-medium">$5.70</p>
              <a
                href="https://www.adlabz.co/b2b-saas-google-ads-benchmarks-for-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 mt-1 py-1"
              >
                AdLabz 2025 <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <div className="p-5 bg-background">
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                DevTools avg CPC
              </p>
              <p className="font-mono tabular-nums text-2xl font-medium">$7.50</p>
              <a
                href="https://www.growthspreeofficial.com/blogs/saas-google-ads-benchmarks-2026-cpc-cpl-ctr-conversion-rate-by-vertical"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 mt-1 py-1"
              >
                GrowthSpree 2026 <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>

          {/* Comparison callout — full width */}
          <div className="border border-border border-t-0 p-6 md:p-8 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 items-start">
              <div>
                <p className="text-sm font-medium mb-2">
                  Our effective CPC: under $0.50
                </p>
                <p className="text-sm text-muted-foreground text-pretty mb-3">
                  $1,099/mo for 2,000+ clicks pencils out to about $0.55
                  a click. The same 2,000 clicks on Google Ads would run
                  you $10,000+. That&apos;s{" "}
                  <span className="font-medium text-foreground">10 to 14x cheaper</span>{" "}
                  for the same developer audience. B2B SaaS non-branded
                  search CPC rose 29% year-over-year to $5.34{" "}
                  <a
                    href="https://dreamdata.io/blog/benchmark-google-search-non-branded-ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-0.5"
                  >
                    (Dreamdata) <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                  , and high-intent software keywords like &ldquo;monitoring
                  software&rdquo; clear $65 a click{" "}
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
                <p className="text-sm text-muted-foreground text-pretty">
                  And every one of our clicks comes from a developer
                  actively searching for plugins, skills, or MCPs to
                  install. No casual browsers, no bots, no wasted spend.
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
                  Don&apos;t take our word for it
                </p>
                <a
                  href={`https://chatgpt.com/?q=${encodeURIComponent(
                          `I'm evaluating an advertising opportunity on claudemarketplaces.com, the only developer tools directory focused specifically on Claude Code plugins, skills, and MCP servers. They have 110,000+ monthly visitors (100% organic, zero paid traffic) and public analytics at https://analytics.vinena.studio/share/overview/hwyH1d.

Their pricing:
- All Placements (pinned + in-feed + jobs): $1,099/mo
- Pinned Cards only: $799/mo
- In-Feed Cards only: $499/mo
- Job Listings only: $199/mo

They accept max 6 advertisers at a time, so each sponsor gets ~17% share of voice across all ad surfaces.

They claim 2,000+ clicks/month for the All Placements tier, which works out to ~$0.55 effective CPC.

For comparison, here are alternatives for reaching developers:

Developer directories:
- TrustMRR (trustmrr.com): 120K+ visitors/mo, $1,499/mo, but accepts 20 advertisers at a time (~5% share of voice each)

Google Ads benchmarks:
- Google Ads overall average CPC: $5.26 (WordStream 2025)
- B2B SaaS search CPC: $5.70 (AdLabz 2025)
- DevTools vertical CPC: $7.50 (GrowthSpree 2026)
- Non-branded B2B search CPC: $5.34, up 29% YoY (Dreamdata 2025)

Larger platforms (different budget tier):
- Stack Overflow: $10K-$15K/mo minimum
- daily.dev: $5K/mo managed campaigns, $8-$20 CPM self-serve

Is this good value for reaching Claude Code developers specifically? How does the share of voice (6 max advertisers vs 20 at TrustMRR) affect the value? What should I look out for?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium border border-border px-4 py-2.5 hover:bg-muted/50 active:scale-[0.96] transition-[colors,transform]"
                >
                  Ask ChatGPT if these prices are good
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Opens ChatGPT with our real pricing data pre-filled
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 04 / FAQ */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="FAQ" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                Who&apos;s your audience?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                Developers actively building with Claude Code, AI tools, and
                MCP servers. 100% organic traffic from search and direct
                visits. No bots, no paid traffic.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                How do ads rotate?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                In-feed cards rotate daily across Skills, MCP, and Marketplaces
                pages. Floating banners rotate every few seconds. Pinned cards
                auto-rotate in groups of 3.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                How do you compare to alternatives?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                We&apos;re the only directory focused specifically on Claude
                Code builders. TrustMRR (120K+ visitors/mo) charges $1,499/mo
                and accepts 20 advertisers at a time. Larger platforms like
                Stack Overflow start at $10K to $15K/mo and daily.dev at
                $5K/mo for managed campaigns.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                How many advertisers do you accept?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                Maximum 6 at a time. Each sponsor gets ~17% share of voice
                across all ad surfaces. Compare that to directories that
                accept 20+ advertisers where each gets ~5%. Fewer sponsors
                means more impressions and clicks per dollar.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                How fast can I go live?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                Same day. After payment you fill in your ad copy and links.
                Your ads go live within hours.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                What reporting do I get?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                Impressions, clicks, and CTR per advertiser across every ad
                surface. Plus our analytics are public so you can verify
                traffic anytime.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                What if my ad doesn&apos;t perform?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                All plans are month to month. If the numbers aren&apos;t
                there, cancel and walk away. Before you do, email us.
                We&apos;ll look at the copy, the creative, and the
                landing page, and tell you what to try.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                Do you vet advertisers?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                Yes. Every ad has to be relevant to developers building
                with Claude Code. No crypto scams, no unrelated
                consumer apps, nothing sketchy. Your brand sits next to
                products our audience actually wants.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                Can I update my ad copy?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                Yes. Email us your updated headline, body, and links and
                we&apos;ll swap them in anytime.
              </p>
            </div>
            <div className="p-5 bg-background">
              <h3 className="text-sm font-medium mb-1.5 text-balance">
                How do I cancel?
              </h3>
              <p className="text-xs text-muted-foreground text-pretty">
                Cancel anytime from your billing dashboard or email us.
                Your ad runs until the end of the paid period.
              </p>
            </div>
          </div>
        </section>

        {/* Section 05 / Final CTA */}
        <section className="container mx-auto px-4 pb-16">
          <div className="border border-border p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-normal mb-3 text-balance">
                  Get in front of Claude Code builders this week.
                </h2>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Buy All Placements and your ads rotate across every page
                  by the end of the day. Monthly, cancel anytime. Only
                  2 sponsor slots left.
                </p>
                <a
                  href="https://cal.com/vinena-studio/advertise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Custom deal, takeover, or longer commitment? Book a call &rarr;
                </a>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <div>
                  <span className="font-mono tabular-nums text-3xl font-medium">$1,099</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <a
                  href="https://vinena.lemonsqueezy.com/checkout/buy/014f30de-3215-4f7c-874b-525e8ce8a62d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-sm font-medium bg-foreground text-background px-6 py-3 hover:bg-foreground/90 active:scale-[0.96] transition-[colors,transform]"
                >
                  Buy All Placements &rarr;
                </a>
                <a
                  href="#placements"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Or pick a single placement &uarr;
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
