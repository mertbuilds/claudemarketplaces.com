import Link from "next/link";
import { Suspense } from "react";

import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FeaturedCards } from "@/components/featured-cards";
import {
  getAllMarketplaces,
  getTopMarketplaces,
  getLatestMarketplaces,
} from "@/lib/data/marketplaces";
import {
  getAllSkills,
  getTopSkills,
  getLatestSkills,
} from "@/lib/data/skills";
import {
  getAllMcpServers,
  getTopMcpServers,
  getLatestMcpServers,
} from "@/lib/data/mcp-servers";
import type { Skill, McpServer, Marketplace } from "@/lib/types";

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

export const revalidate = 3600;

type ItemType = "skill" | "mcp" | "marketplace";

type MixedItem = {
  type: ItemType;
  id: string;
  href: string;
  name: string;
  description: string;
  voteCount: number;
  createdAt?: string;
};

function toMixedFromSkill(s: Skill): MixedItem {
  return {
    type: "skill",
    id: s.id,
    href: `/skills/${s.id}`,
    name: s.name,
    description: s.description,
    voteCount: s.voteCount,
    createdAt: s.createdAt,
  };
}

function toMixedFromMcp(m: McpServer): MixedItem {
  return {
    type: "mcp",
    id: m.slug,
    href: `/mcp/${m.slug}`,
    name: m.displayName || m.name,
    description: m.description,
    voteCount: m.voteCount,
    createdAt: m.createdAt,
  };
}

function toMixedFromMarketplace(mp: Marketplace): MixedItem {
  return {
    type: "marketplace",
    id: mp.slug,
    href: `/plugins/${mp.slug}`,
    name: mp.repo,
    description: mp.description,
    voteCount: mp.voteCount,
    createdAt: mp.createdAt,
  };
}

function formatRelativeDate(iso?: string): string {
  if (!iso) return "—";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "—";
  const now = Date.now();
  const diffMs = now - then.getTime();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  if (diffMs < hour) return "now";
  if (diffMs < day) {
    const hours = Math.max(1, Math.floor(diffMs / hour));
    return `${hours}h ago`;
  }
  const diffDays = Math.floor(diffMs / day);
  if (diffDays < 14) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
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

function TypeTag({ type }: { type: ItemType }) {
  const label =
    type === "mcp" ? "MCP" : type === "skill" ? "SKILL" : "MARKETPLACE";
  return (
    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-mono">
      {label}
    </span>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(Math.floor(n / 100) * 100).toLocaleString()}+`;
  if (n >= 100) return `${Math.floor(n / 10) * 10}+`;
  return `${n}`;
}

async function HeroCountStrip() {
  const [marketplaces, skills, mcpServers] = await Promise.all([
    getAllMarketplaces({ includeEmpty: false }),
    getAllSkills(),
    getAllMcpServers(),
  ]);
  const parts = [
    `${formatCount(skills.length)} skills`,
    `${formatCount(mcpServers.length)} MCP servers`,
    `${formatCount(marketplaces.length)} marketplaces`,
  ];
  return (
    <p className="mt-8 text-xs text-muted-foreground font-mono">
      {parts.map((p, i) => (
        <span key={p}>
          {i > 0 && <span className="mx-2 text-border">·</span>}
          {p}
        </span>
      ))}
    </p>
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

async function TrendingGrid() {
  const [skills, mcps, marketplaces] = await Promise.all([
    getTopSkills(2),
    getTopMcpServers(2),
    getTopMarketplaces(2),
  ]);
  const items: MixedItem[] = [
    ...skills.map(toMixedFromSkill),
    ...mcps.map(toMixedFromMcp),
    ...marketplaces.map(toMixedFromMarketplace),
  ].sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
      {items.map((item) => (
        <Link
          key={`${item.type}-${item.id}`}
          href={item.href}
          className="group flex flex-col p-6 bg-background hover:bg-muted/50 transition-colors min-h-[10rem]"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline pr-4">
              {item.name}
            </p>
            <TypeTag type={item.type} />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {item.description}
          </p>
          <span className="mt-auto pt-4 text-[10px] text-muted-foreground font-mono whitespace-nowrap">
            &uarr; <span className="font-mono">{item.voteCount ?? 0}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

async function RecentlyAddedList() {
  const [skills, mcps, marketplaces] = await Promise.all([
    getLatestSkills(3),
    getLatestMcpServers(3),
    getLatestMarketplaces(3),
  ]);
  const items: MixedItem[] = [
    ...skills.map(toMixedFromSkill),
    ...mcps.map(toMixedFromMcp),
    ...marketplaces.map(toMixedFromMarketplace),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 9);

  return (
    <div className="border border-border">
      {items.map((item, i) => (
        <Link
          key={`${item.type}-${item.id}`}
          href={item.href}
          className={`group grid grid-cols-[5rem_1fr] md:grid-cols-[6rem_1fr_7rem] items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors ${
            i > 0 ? "border-t border-border" : ""
          }`}
        >
          <span className="text-xs text-muted-foreground font-mono whitespace-nowrap self-start md:self-center pt-0.5 md:pt-0">
            {formatRelativeDate(item.createdAt)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate group-hover:underline">
              {item.name}
            </p>
            <p className="text-xs text-muted-foreground truncate leading-relaxed">
              {item.description}
            </p>
            <div className="md:hidden mt-1">
              <TypeTag type={item.type} />
            </div>
          </div>
          <div className="hidden md:block text-right">
            <TypeTag type={item.type} />
          </div>
        </Link>
      ))}
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

function TrendingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-6 min-h-[10rem] flex flex-col bg-background">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="h-4 w-3/4 bg-muted" />
            <div className="h-3 w-12 bg-muted" />
          </div>
          <div className="h-3 w-full bg-muted mb-1.5" />
          <div className="h-3 w-2/3 bg-muted" />
          <div className="h-3 w-10 bg-muted mt-auto" />
        </div>
      ))}
    </div>
  );
}

function RecentSkeleton() {
  return (
    <div className="border border-border">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className={`grid grid-cols-[5rem_1fr] md:grid-cols-[6rem_1fr_7rem] items-center gap-4 px-4 py-4 ${
            i > 0 ? "border-t border-border" : ""
          }`}
        >
          <div className="h-3 w-12 bg-muted" />
          <div>
            <div className="h-3.5 w-1/2 bg-muted mb-1" />
            <div className="h-3 w-3/4 bg-muted" />
          </div>
          <div className="hidden md:block h-3 w-16 bg-muted justify-self-end" />
        </div>
      ))}
    </div>
  );
}

function HeroCountSkeleton() {
  return <div className="mt-8 h-3 w-64 bg-muted" />;
}

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
        {/* Hero */}
        <section className="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <h1 className="font-serif text-2xl md:text-3xl font-normal max-w-xl mb-4">
            Curated plugins, skills, and MCP servers for Claude Code
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mb-8">
            A hand-picked directory of high-quality extensions with community
            voting and commenting.
          </p>
          <Suspense fallback={<HeroCountSkeleton />}>
            <HeroCountStrip />
          </Suspense>
        </section>

        {/* 01 / Browse */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel number="01" title="Browse" />
          <Suspense fallback={<DirectorySkeleton />}>
            <DirectoryCards />
          </Suspense>
        </section>

        {/* Sponsored (label lives inside FeaturedCards) */}
        <section className="container mx-auto px-4 pb-16">
          <FeaturedCards />
        </section>

        {/* 02 / Trending */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel number="02" title="Trending" />
          <Suspense fallback={<TrendingSkeleton />}>
            <TrendingGrid />
          </Suspense>
        </section>

        {/* 03 / Recently added */}
        <section className="container mx-auto px-4 pb-16">
          <SectionLabel number="03" title="Recently added" />
          <Suspense fallback={<RecentSkeleton />}>
            <RecentlyAddedList />
          </Suspense>
        </section>

        {/* FAQ */}
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
