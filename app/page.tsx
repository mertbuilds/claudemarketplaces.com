import Link from "next/link";
import { Suspense } from "react";
import { Star } from "lucide-react";

import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FeaturedCards } from "@/components/featured-cards";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  getAllMarketplaces,
  getTopMarketplaces,
} from "@/lib/data/marketplaces";
import { getAllSkills, getTopSkills } from "@/lib/data/skills";
import { getAllMcpServers, getTopMcpServers } from "@/lib/data/mcp-servers";
import { SKILL_CATEGORIES } from "@/lib/data/skill-categories";
import { MCP_CATEGORIES } from "@/lib/data/mcp-categories";
import { MARKETPLACE_CATEGORIES } from "@/lib/data/marketplace-categories";

export const revalidate = 86400; // 1 day ISR

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

/* ── Helpers ─────────────────────────────────────────────────────────── */

function SectionLabel({ title }: { title: string }) {
  return (
    <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-6">
      {title}
    </h2>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(Math.floor(n / 100) * 100).toLocaleString()}+`;
  if (n >= 100) return `${Math.floor(n / 10) * 10}+`;
  return `${n}`;
}

function formatStars(n?: number): string | null {
  if (!n) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
}

/* ── Async data sections ─────────────────────────────────────────────── */

async function CountStrip() {
  const [marketplaces, skills, mcpServers] = await Promise.all([
    getAllMarketplaces({ includeEmpty: false }),
    getAllSkills(),
    getAllMcpServers(),
  ]);

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground font-mono">
      <span>
        <span className="text-foreground font-medium">
          {formatCount(skills.length)}
        </span>{" "}
        skills
      </span>
      <span>
        <span className="text-foreground font-medium">
          {formatCount(mcpServers.length)}
        </span>{" "}
        MCP servers
      </span>
      <span>
        <span className="text-foreground font-medium">
          {formatCount(marketplaces.length)}
        </span>{" "}
        marketplaces
      </span>
    </div>
  );
}

async function DirectoryCards() {
  const [marketplaces, skills, mcpServers] = await Promise.all([
    getAllMarketplaces({ includeEmpty: false }),
    getAllSkills(),
    getAllMcpServers(),
  ]);

  const counts = {
    skills: formatCount(skills.length),
    mcp: formatCount(mcpServers.length),
    marketplaces: formatCount(marketplaces.length),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border">
      <Link
        href="/skills"
        className="group p-6 hover:bg-muted/50 transition-colors"
      >
        <p className="text-sm font-medium mb-1.5">Agent Skills</p>
        <p className="text-xs text-muted-foreground mb-4">
          Reusable instructions that teach your agent specific tasks. Install
          with a single command.
        </p>
        <span className="text-xs text-primary group-hover:underline">
          {counts.skills} skills &rarr;
        </span>
      </Link>
      <Link
        href="/marketplaces"
        className="group p-6 border-t md:border-t-0 md:border-l border-border hover:bg-muted/50 transition-colors"
      >
        <p className="text-sm font-medium mb-1.5">Plugin Marketplaces</p>
        <p className="text-xs text-muted-foreground mb-4">
          Curated GitHub repositories containing collections of plugins and
          tools for AI agents.
        </p>
        <span className="text-xs text-primary group-hover:underline">
          {counts.marketplaces} marketplaces &rarr;
        </span>
      </Link>
      <Link
        href="/mcp"
        className="group p-6 border-t md:border-t-0 md:border-l border-border hover:bg-muted/50 transition-colors"
      >
        <p className="text-sm font-medium mb-1.5">MCP Servers</p>
        <p className="text-xs text-muted-foreground mb-4">
          Extend your agent with additional tools, APIs, and integrations via
          Model Context Protocol.
        </p>
        <span className="text-xs text-primary group-hover:underline">
          {counts.mcp} servers &rarr;
        </span>
      </Link>
    </div>
  );
}

async function TopSkills() {
  const skills = await getTopSkills(6);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
      {skills.map((s) => (
        <Link
          key={s.id}
          href={`/skills/${s.id}`}
          className="group flex flex-col p-6 bg-background hover:bg-muted/50 transition-colors"
        >
          <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline mb-2">
            {s.name}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {s.description}
          </p>
          <div className="mt-auto pt-4 flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
            {s.installs > 0 && <span>{formatCount(s.installs)} installs</span>}
            {formatStars(s.stars) && <span className="inline-flex items-center gap-0.5"><Star className="h-2.5 w-2.5" />{formatStars(s.stars)}</span>}
          </div>
        </Link>
      ))}
    </div>
  );
}

async function TopMarketplaces() {
  const marketplaces = await getTopMarketplaces(6);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
      {marketplaces.map((mp) => (
        <Link
          key={mp.slug}
          href={`/plugins/${mp.slug}`}
          className="group flex flex-col p-6 bg-background hover:bg-muted/50 transition-colors"
        >
          <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline mb-2">
            {mp.repo}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {mp.description}
          </p>
          <div className="mt-auto pt-4 flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
            {mp.pluginCount > 0 && (
              <span>{mp.pluginCount} plugins</span>
            )}
            {formatStars(mp.stars) && (
              <span className="inline-flex items-center gap-0.5"><Star className="h-2.5 w-2.5" />{formatStars(mp.stars)}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

async function TopMcpServers() {
  const mcps = await getTopMcpServers(6);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
      {mcps.map((m) => (
        <Link
          key={m.slug}
          href={`/mcp/${m.slug}`}
          className="group flex flex-col p-6 bg-background hover:bg-muted/50 transition-colors"
        >
          <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline mb-2">
            {m.displayName || m.name}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {m.description}
          </p>
          <div className="mt-auto pt-4 flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
            {formatStars(m.stars) && (
              <span className="inline-flex items-center gap-0.5"><Star className="h-2.5 w-2.5" />{formatStars(m.stars)}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Skeletons ───────────────────────────────────────────────────────── */

function CountStripSkeleton() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono">
      <span className="h-4 w-16 bg-muted rounded" />
      <span className="h-4 w-24 bg-muted rounded" />
      <span className="h-4 w-28 bg-muted rounded" />
    </div>
  );
}

function DirectorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`p-6 ${
            i > 0 ? "border-t md:border-t-0 md:border-l border-border" : ""
          }`}
        >
          <div className="h-4 w-24 bg-muted mb-1.5" />
          <div className="h-3 w-full bg-muted mb-4" />
          <div className="h-3 w-20 bg-muted" />
        </div>
      ))}
    </div>
  );
}

function ItemGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-6 flex flex-col bg-background">
          <div className="h-4 w-3/4 bg-muted mb-2" />
          <div className="h-3 w-full bg-muted mb-1.5" />
          <div className="h-3 w-2/3 bg-muted" />
          <div className="h-3 w-16 bg-muted mt-auto pt-4" />
        </div>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

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
            name: "What are plugin marketplaces?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Plugin marketplaces are GitHub repositories that collect and distribute plugins for Claude Code. Each marketplace acts as a registry you can subscribe to, making it easy to discover and install bundles of skills, MCP servers, commands, hooks, and agents from a single source.",
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
            name: "What is a plugin?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A plugin is a bundle of Claude Code extensions — skills, MCP servers, slash commands, hooks, or agents — packaged together as one installable unit. Plugins live inside marketplaces and can be installed with a single command.",
            },
          },
          {
            "@type": "Question",
            name: "What is the difference between a skill, a plugin, and a marketplace?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A skill is a single reusable instruction set. A plugin bundles one or more skills, MCP servers, or commands into an installable package. A marketplace is a GitHub repository that hosts and distributes multiple plugins under one registry.",
            },
          },
          {
            "@type": "Question",
            name: "How do I install a skill or plugin?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Copy the install command from any skill, plugin, or marketplace detail page and run it in your terminal. Most items install with a single command.",
            },
          },
          {
            "@type": "Question",
            name: "How is quality maintained?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We curate listings by install count, GitHub stars, and community votes. Only high-quality, actively used extensions are listed. Community features like voting and commenting help surface the best tools.",
            },
          },
          {
            "@type": "Question",
            name: "Is this free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, the directory is completely free and open. Browse and install any skills, MCP servers, plugins, or marketplaces at no cost.",
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
        {/* ── Hero + counts + Featured — all in initial viewport ────── */}
        <section className="container mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-normal max-w-xl mb-2">
            Find the best plugins, skills, and MCP servers for Claude Code
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mb-4">
            The largest directory of Claude Code extensions. Discover tools
            used by thousands of developers, sorted by installs and GitHub
            stars.
          </p>
          <div className="mb-6">
            <Suspense fallback={<CountStripSkeleton />}>
              <CountStrip />
            </Suspense>
          </div>
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">
              Get <span className="italic">This week in Claude</span>. Weekly digest of model updates, releases, and notable tools.
            </p>
            <NewsletterForm source="hero" className="max-w-md" />
          </div>
          <FeaturedCards />
        </section>

        {/* ── 01 / Browse ─────────────────────────────────────────── */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="Browse" />
          <Suspense fallback={<DirectorySkeleton />}>
            <DirectoryCards />
          </Suspense>
        </section>

        {/* ── 02 / Popular Skills ─────────────────────────────────── */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="Popular Skills" />
          <Suspense fallback={<ItemGridSkeleton />}>
            <TopSkills />
          </Suspense>
          <div className="mt-3 text-right">
            <Link
              href="/skills"
              className="text-xs text-primary hover:underline"
            >
              All skills &rarr;
            </Link>
          </div>
        </section>

        {/* ── 03 / Popular Marketplaces ───────────────────────────── */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="Popular Marketplaces" />
          <Suspense fallback={<ItemGridSkeleton />}>
            <TopMarketplaces />
          </Suspense>
          <div className="mt-3 text-right">
            <Link
              href="/marketplaces"
              className="text-xs text-primary hover:underline"
            >
              All marketplaces &rarr;
            </Link>
          </div>
        </section>

        {/* ── 04 / Popular MCP Servers ────────────────────────────── */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="Popular MCP Servers" />
          <Suspense fallback={<ItemGridSkeleton />}>
            <TopMcpServers />
          </Suspense>
          <div className="mt-3 text-right">
            <Link
              href="/mcp"
              className="text-xs text-primary hover:underline"
            >
              All MCP servers &rarr;
            </Link>
          </div>
        </section>

        {/* ── 05 / Browse by Category ─────────────────────────────── */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel title="Browse by Category" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-3">
                Skill categories
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/skills/category/${cat.slug}`}
                    className="inline-flex items-center px-3 py-1.5 border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-3">
                Marketplace categories
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MARKETPLACE_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/marketplaces/category/${cat.slug}`}
                    className="inline-flex items-center px-3 py-1.5 border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-3">
                MCP server categories
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MCP_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/mcp/category/${cat.slug}`}
                    className="inline-flex items-center px-3 py-1.5 border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Advertise CTA ───────────────────────────────────────── */}
        <section className="container mx-auto px-4 pb-16">
          <Link
            href="/advertise"
            className="group block border border-border hover:border-primary/60 p-8 md:p-10 bg-background hover:bg-primary/5 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 mb-4">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-primary font-medium">
                    Only 2 of 6 sponsor slots left
                  </span>
                </div>
                <p className="font-serif text-lg md:text-xl font-normal mb-2 text-balance">
                  Advertise to Claude Code builders.
                </p>
                <p className="text-xs text-muted-foreground text-pretty max-w-lg">
                  105,000+ developers visit here every month to find plugins,
                  skills, and MCP servers. 1inch, AppSignal, IdeaBrowser, and
                  MockHero already run ads. Display ads from{" "}
                  <span className="font-mono tabular-nums">$499</span>/mo, job
                  listings from{" "}
                  <span className="font-mono tabular-nums">$199</span>/mo.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center text-xs font-medium bg-foreground text-background px-4 py-2.5 group-hover:bg-primary transition-colors">
                See placements &amp; pricing &rarr;
              </span>
            </div>
          </Link>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-16 border-t border-border">
          <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-8">
            FAQ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            <div>
              <h3 className="text-sm font-medium mb-1.5">
                What are Claude Code skills?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reusable instruction sets that teach your agent specific tasks.
                Install with a single command.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">
                What are plugin marketplaces?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                GitHub repositories that collect and distribute plugins. Each
                marketplace acts as a registry you can subscribe to for skills,
                MCP servers, commands, hooks, and agents.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">
                What are MCP servers?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protocol servers that extend your agent with tools, APIs, and
                integrations to external services.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">What is a plugin?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A bundle of Claude Code extensions — skills, MCP servers,
                commands, hooks, or agents — packaged as one installable unit.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">
                Skill vs. plugin vs. marketplace?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A skill is a single instruction set. A plugin bundles multiple
                skills, MCP servers, or commands. A marketplace is a GitHub
                repo that distributes many plugins under one registry.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">
                How do I install something?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Copy the install command from any detail page and run it in
                your terminal. Most items install with a single command.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">
                How is quality maintained?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Curated by install count, GitHub stars, and community votes.
                Only actively used extensions are listed.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1.5">Is this free?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes. Completely free and open. Browse and install anything at
                no cost.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
