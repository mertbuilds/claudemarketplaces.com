import { Suspense } from "react";

export const revalidate = 3600;

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllSkills, getCategoryCounts } from "@/lib/data/skills";
import { SkillsContent } from "@/components/skills-content";
import { getInFeedAdsForPage } from "@/lib/ads";
import { SKILL_CATEGORIES } from "@/lib/data/skill-categories";
import { CopyCommand } from "@/components/copy-command";
import { SkillsSearchBar } from "@/components/skills-search-bar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Skills Directory — Browse 2,500+ Claude Code Skills",
  description:
    "The largest directory of Claude Code skills. Browse by category — frontend, backend, testing, security, DevOps, and more. Install with one command.",
  keywords: [
    "claude skills",
    "claude code skills",
    "ai skills",
    "agent skills",
    "claude code",
    "claude code plugins",
  ],
  openGraph: {
    title: "Claude Skills Directory — Browse 2,500+ Claude Code Skills",
    description:
      "The largest directory of Claude Code skills. Browse by category — frontend, backend, testing, security, DevOps, and more.",
    url: "https://claudemarketplaces.com/skills",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Skills Directory — Browse 2,500+ Claude Code Skills",
    description:
      "The largest directory of Claude Code skills. Browse by category — frontend, backend, testing, security, DevOps, and more.",
  },
};

// ── Category navigation ────────────────────────────────────────────────

async function CategoryNav() {
  const counts = await getCategoryCounts();

  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1">
      {SKILL_CATEGORIES.map((cat) => {
        const count = counts[cat.slug] ?? 0;
        return (
          <Link
            key={cat.slug}
            href={`/skills/category/${cat.slug}`}
            className="group inline-flex items-center gap-2 px-3 py-1.5 border border-border text-xs uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            <span>{cat.name}</span>
            <span className="font-mono text-[10px] text-muted-foreground/60 group-hover:text-primary transition-colors">
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

// ── Skills grid with search/sort/pagination ────────────────────────────

async function SkillsData() {
  const skills = await getAllSkills();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Claude Code Skills",
    description: "Browse and discover Claude Code agent skills.",
    numberOfItems: skills.length,
    itemListElement: skills.slice(0, 10).map((skill, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://claudemarketplaces.com/skills/${skill.id}`,
      name: skill.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <SkillsContent
        skills={skills}
        newsletterSeed={[Math.random(), Math.random()]}
        infeedAds={getInFeedAdsForPage("skills")}
        hideSearch
      />
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────

export default function SkillsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Claude Skills Directory",
    description:
      "The largest directory of Claude Code skills. Browse by category — frontend, backend, testing, security, DevOps, and more.",
    url: "https://claudemarketplaces.com/skills",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      <main className="flex-1">
        {/* ── Hero: two-column layout ── */}
        <section className="container mx-auto px-4 pt-10 pb-4 md:pt-12 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: title + quick start */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-normal mb-3">
                Claude Code Skills
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Reusable instructions that teach your agent specific tasks.
                Browse the directory or install skills directly from your
                terminal.
              </p>

              {/* Quick-start install guidance */}
              <div className="border border-border">
                <div className="px-4 py-2 border-b border-border">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-mono">
                    Quick start
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Initialize skills in your project
                    </p>
                    <CopyCommand command="npx skills init" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Install any skill from this directory
                    </p>
                    <CopyCommand command="npx skills add https://github.com/vercel-labs/skills --skill find-skills" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right: search + categories */}
            <div>
              <SkillsSearchBar />
              <div className="flex items-center gap-4 mt-8 mb-3">
                <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">
                  Categories
                </span>
                <div className="flex-1 border-t border-border" />
              </div>
              <Suspense
                fallback={
                  <div className="flex flex-wrap gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="h-7 w-28 bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                }
              >
                <CategoryNav />
              </Suspense>
            </div>
          </div>
        </section>

        {/* ── All skills grid ── */}
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted" />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <SkillsData />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
