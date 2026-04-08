import { Suspense } from "react";
import { notFound } from "next/navigation";

import Link from "next/link";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Download, Calendar } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VoteButton } from "@/components/vote-button";
import { SkillInstallCommand } from "@/components/skill-install-command";
import { getSkillById, getAllSkills, getSkillsByRepo, getSkillsByCategory } from "@/lib/data/skills";
import { classifySkill, getCategoryBySlug } from "@/lib/data/skill-categories";
import { Skill } from "@/lib/types";
import { formatStarCount } from "@/lib/utils/format";
import { VoteProvider } from "@/lib/contexts/vote-context";
import { BookmarkProvider } from "@/lib/contexts/bookmark-context";
import { CommentSidebar } from "@/components/comment-sidebar";
import { CollapsibleReadme } from "@/components/collapsible-readme";
import { SkillCard } from "@/components/skill-card";

export const revalidate = 300;

function humanize(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((s) => ({
    slug: s.id.split("/"),
  }));
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug.length === 1) {
    // Org page
    const org = slug[0];
    const allSkills = await getAllSkills();
    const orgSkills = allSkills.filter((s) => s.repo.startsWith(org + "/"));
    if (!orgSkills.length) return { title: "Organization Not Found" };

    const repoSet = new Set(orgSkills.map((s) => s.repo));
    const title = `${org} | Claude Code Skills`;
    const description = `Browse ${repoSet.size} repos and ${orgSkills.length} skills from ${org} for Claude Code.`;

    return {
      title,
      description,
      alternates: { canonical: `/skills/${org}` },
      openGraph: {
        title,
        description,
        url: `https://claudemarketplaces.com/skills/${org}`,
        siteName: "Claude Code Plugin Marketplace",
        type: "website",
        images: [
          {
            url: "https://claudemarketplaces.com/opengraph-image",
            width: 1200,
            height: 630,
            alt: `${org} Skills`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["https://claudemarketplaces.com/opengraph-image"],
      },
    };
  }

  if (slug.length === 2) {
    // Repo page
    const repo = slug.join("/");
    const skills = await getSkillsByRepo(repo);

    if (!skills.length) return { title: "Repo Not Found" };

    const title = `${repo} Skills | Claude Code Skills`;
    const description = `Browse ${skills.length} skill${skills.length !== 1 ? "s" : ""} from ${repo} for Claude Code.`;

    return {
      title,
      description,
      alternates: { canonical: `/skills/${repo}` },
      openGraph: {
        title,
        description,
        url: `https://claudemarketplaces.com/skills/${repo}`,
        siteName: "Claude Code Plugin Marketplace",
        type: "website",
        images: [
          {
            url: "https://claudemarketplaces.com/opengraph-image",
            width: 1200,
            height: 630,
            alt: `${repo} Skills`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["https://claudemarketplaces.com/opengraph-image"],
      },
    };
  }

  // Skill detail page
  const id = slug.join("/");
  const skill = await getSkillById(id);

  if (!skill) {
    return { title: "Skill Not Found" };
  }

  const displayName = humanize(skill.name);
  const title = `${displayName} | Claude Code Skills`;
  const description =
    skill.summary?.slice(0, 160) ||
    skill.description ||
    `Install ${displayName} skill for Claude Code from ${skill.repo}.`;

  // Noindex detail pages that have zero original signal.
  // Pages graduate to indexable when they have an editorial summary (original content)
  // OR community signal (votes/comments).
  const hasOriginalSignal =
    !!skill.summary || skill.voteCount + skill.commentCount > 0;

  return {
    title,
    description,
    alternates: { canonical: `/skills/${id}` },
    robots: hasOriginalSignal ? undefined : { index: false, follow: true },
    keywords: [
      skill.name,
      "claude code skill",
      "agent skill",
      skill.repo,
      "claude code",
    ],
    openGraph: {
      title,
      description,
      url: `https://claudemarketplaces.com/skills/${id}`,
      siteName: "Claude Code Plugin Marketplace",
      type: "website",
      images: [
        {
          url: "https://claudemarketplaces.com/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${skill.name} Skill`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://claudemarketplaces.com/opengraph-image"],
    },
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchSkillMarkdown(repo: string, skillName: string): Promise<string | null> {
  const branches = ["main", "master"];
  const [org, repoName] = repo.split("/");
  const prefixCandidates = new Set<string>();
  if (org) {
    prefixCandidates.add(org);
    prefixCandidates.add(org.split("-")[0]);
  }
  if (repoName) {
    prefixCandidates.add(repoName);
    prefixCandidates.add(repoName.split("-")[0]);
  }
  const nameVariants = new Set<string>([skillName]);
  for (const prefix of prefixCandidates) {
    if (skillName.startsWith(prefix + "-")) {
      nameVariants.add(skillName.slice(prefix.length + 1));
    }
  }

  const dirPatterns = ["skills", "", ".claude/skills"];

  for (const branch of branches) {
    for (const name of nameVariants) {
      for (const dir of dirPatterns) {
        const filePath = dir ? `${dir}/${name}/SKILL.md` : `${name}/SKILL.md`;
        const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
        try {
          const res = await fetch(url, { next: { revalidate: 3600 } });
          if (res.ok) return await res.text();
        } catch {
          continue;
        }
      }
    }
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${repo}/${branch}/SKILL.md`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) return await res.text();
    } catch {
      // continue to next branch
    }
  }
  return null;
}

// ─── Org Page ────────────────────────────────────────────────

async function OrgContent({ org }: { org: string }) {
  const allSkills = await getAllSkills();
  const orgSkills = allSkills.filter((s) => s.repo.startsWith(org + "/"));

  if (!orgSkills.length) {
    notFound();
  }

  // Group by repo
  const repoMap = new Map<string, Skill[]>();
  orgSkills.forEach((s) => {
    const existing = repoMap.get(s.repo) || [];
    existing.push(s);
    repoMap.set(s.repo, existing);
  });

  // Sort repos by total installs descending
  const repos = Array.from(repoMap.entries())
    .map(([repo, skills]) => ({
      repo,
      repoName: repo.split("/")[1],
      skills,
      totalInstalls: skills.reduce((sum, s) => sum + s.installs, 0),
    }))
    .sort((a, b) => b.totalInstalls - a.totalInstalls);

  const totalInstalls = repos.reduce((sum, r) => sum + r.totalInstalls, 0);
  const totalSkillCount = orgSkills.length;

  return (
    <>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/skills">Skills</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{org}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header section */}
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-sm uppercase tracking-[0.12em] mb-3">{org}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>
            {repos.length} repo{repos.length !== 1 ? "s" : ""}
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>
            {totalSkillCount} skill{totalSkillCount !== 1 ? "s" : ""}
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>{formatStarCount(totalInstalls)} total installs</span>
          <span aria-hidden="true">&middot;</span>
          <Link
            href={`https://github.com/${org}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            GitHub
          </Link>
        </div>
      </div>

      {/* Repos list */}
      <div className="container mx-auto px-4 pb-12">
        <div className="border rounded-md divide-y">
          {repos.map(({ repo, repoName, skills, totalInstalls: repoInstalls }) => {
            const maxPreview = 2;
            const previewNames = skills
              .slice(0, maxPreview)
              .map((s) => s.name);
            const remaining = skills.length - maxPreview;
            const skillSummary =
              skills.length === 1
                ? `1 skill: ${previewNames[0]}`
                : remaining > 0
                  ? `${skills.length} skills: ${previewNames.join(", ")}, +${remaining} more`
                  : `${skills.length} skills: ${previewNames.join(", ")}`;

            return (
              <Link
                key={repo}
                href={`/skills/${repo}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors gap-4"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm">{repoName}</span>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {skillSummary}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5 shrink-0">
                  <Download className="h-3.5 w-3.5" />
                  {formatStarCount(repoInstalls)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Repo Page ───────────────────────────────────────────────

async function RepoContent({ repo }: { repo: string }) {
  const skills = await getSkillsByRepo(repo);

  if (!skills.length) {
    notFound();
  }

  const sorted = [...skills].sort((a, b) => b.installs - a.installs);
  const totalInstalls = skills.reduce((sum, s) => sum + s.installs, 0);
  const installCommand = `npx skills add https://github.com/${repo}`;
  const [org, repoName] = repo.split("/");

  return (
    <>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/skills">Skills</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/skills/${org}`}>{org}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{repoName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header section */}
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-sm uppercase tracking-[0.12em] mb-3">{repo}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
          <span>
            {skills.length} skill{skills.length !== 1 ? "s" : ""}
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>{formatStarCount(totalInstalls)} total installs</span>
          <span aria-hidden="true">&middot;</span>
          <Link
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            GitHub
          </Link>
        </div>

        <div className="max-w-2xl">
          <SkillInstallCommand command={installCommand} />
        </div>
      </div>

      {/* Skills list */}
      <div className="container mx-auto px-4 pb-12">
        <div className="border rounded-md divide-y">
          {sorted.map((skill) => (
            <Link
              key={skill.id}
              href={`/skills/${skill.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium text-sm">{skill.name}</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" />
                {formatStarCount(skill.installs)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Skill Detail Page ───────────────────────────────────────

async function SkillDetailContent({ id }: { id: string }) {
  const skill = await getSkillById(id);

  if (!skill) {
    notFound();
  }

  const skillMd = await fetchSkillMarkdown(skill.repo, skill.name);
  const [org, repoName] = skill.repo.split("/");

  const cats = classifySkill(skill).map(getCategoryBySlug).filter(Boolean);

  return (
    <>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/skills">Skills</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/skills/${org}`}>{org}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/skills/${skill.repo}`}>{repoName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{humanize(skill.name)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            <h1 className="font-serif text-2xl md:text-3xl font-normal mb-3">
              {humanize(skill.name)}
            </h1>

            {/* Editor's note */}
            {skill.summary ? (
              <div className="border-l-2 border-muted-foreground/20 pl-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60 block mb-1.5">Editor&apos;s Note</span>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                  {skill.summary}
                </p>
              </div>
            ) : skill.description ? (
              <p className="text-sm text-muted-foreground max-w-md">
                {skill.description.slice(0, 300)}{skill.description.length > 300 ? "..." : ""}
              </p>
            ) : null}

            {/* Installation */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Install
              </h2>
              <SkillInstallCommand command={skill.installCommand} />
            </div>

            {/* SKILL.md - collapsible (collapsed by default) */}
            {skillMd && <CollapsibleReadme content={skillMd} label="SKILL.md" />}
          </div>

          {/* Right column / sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-4">
              {/* Installs */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Download className="h-4 w-4" />
                  Installs
                </span>
                <span className="text-sm font-medium">
                  {formatStarCount(skill.installs)}
                </span>
              </div>

              {/* Stars */}
              {skill.stars !== undefined && skill.stars > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    GitHub Stars
                  </span>
                  <span className="text-sm font-medium">
                    {formatStarCount(skill.stars)}
                  </span>
                </div>
              )}

              {/* Votes */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Votes</span>
                <VoteProvider itemType="skill" itemIds={[skill.id]}>
                  <VoteButton
                    itemType="skill"
                    itemId={skill.id}
                    initialVoteCount={skill.voteCount}
                  />
                </VoteProvider>
              </div>

              {/* Categories */}
              {cats.length > 0 && (
                <div className="border-t pt-4">
                  <span className="text-sm text-muted-foreground block mb-2">Categories</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cats.map((cat) => (
                      <Link key={cat!.slug} href={`/skills/category/${cat!.slug}`}>
                        <Badge
                          variant="secondary"
                          className="hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          {cat!.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* First Seen + License */}
              {(skill.discoveredAt || skill.license) && (
                <div className="border-t pt-4 space-y-3">
                  {skill.discoveredAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        First Seen
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(skill.discoveredAt)}
                      </span>
                    </div>
                  )}
                  {skill.license && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        License
                      </span>
                      <Badge variant="secondary">{skill.license}</Badge>
                    </div>
                  )}
                </div>
              )}

              {/* GitHub link */}
              <div className="border-t pt-4">
                <Link
                  href={`https://github.com/${skill.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on GitHub
                </Link>
              </div>
            </div>
            <CommentSidebar itemType="skill" itemId={skill.id} initialCommentCount={skill.commentCount} />
          </div>
        </div>

        {/* Related skills — full width below the two-column layout */}
        <Suspense fallback={null}>
          <RelatedSkills skill={skill} />
        </Suspense>
      </div>
    </>
  );
}

// ─── Related Skills ─────────────────────────────────────────

async function RelatedSkills({ skill }: { skill: Skill }) {
  const cats = classifySkill(skill);
  if (!cats.length) return null;

  const primaryCat = cats[0];
  const category = getCategoryBySlug(primaryCat);
  const categorySkills = await getSkillsByCategory(primaryCat);
  const related = categorySkills
    .filter((s) => s.id !== skill.id)
    .slice(0, 6);

  if (!related.length) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Related {category?.name ?? ""} Skills
        </h2>
        {category && (
          <Link
            href={`/skills/category/${primaryCat}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all &rarr;
          </Link>
        )}
      </div>
      <VoteProvider itemType="skill" itemIds={related.map((s) => s.id)}>
        <BookmarkProvider itemType="skill" itemIds={related.map((s) => s.id)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        </BookmarkProvider>
      </VoteProvider>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1-segment: org page
  if (slug.length === 1) {
    const org = slug[0];
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                  <div className="h-4 w-48 bg-muted rounded-md" />
                  <div className="h-10 w-80 bg-muted rounded-md" />
                  <div className="h-5 w-64 bg-muted rounded-md" />
                  <div className="space-y-0 border rounded-md divide-y">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3">
                        <div className="h-4 w-48 bg-muted rounded-md" />
                        <div className="h-4 w-16 bg-muted rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <OrgContent org={org} />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
  }

  // 2-segment: repo page
  if (slug.length === 2) {
    const repo = slug.join("/");
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                  <div className="h-4 w-48 bg-muted rounded-md" />
                  <div className="h-10 w-80 bg-muted rounded-md" />
                  <div className="h-5 w-64 bg-muted rounded-md" />
                  <div className="h-12 w-full max-w-2xl bg-muted rounded-md" />
                  <div className="space-y-0 border rounded-md divide-y">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3">
                        <div className="h-4 w-48 bg-muted rounded-md" />
                        <div className="h-4 w-16 bg-muted rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <RepoContent repo={repo} />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
  }

  // 3+ segments: skill detail page
  const id = slug.join("/");
  const skill = await getSkillById(id);

  const breadcrumbSchema = skill
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Skills",
            item: "https://claudemarketplaces.com/skills",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: skill.name,
          },
        ],
      }
    : null;

  const softwareSchema = skill
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: skill.name,
        description: skill.summary || skill.description || `${skill.name} - a Claude Code skill`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        url: `https://claudemarketplaces.com/skills/${id}`,
        codeRepository: `https://github.com/${skill.repo}`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {softwareSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      )}
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="animate-pulse">
              {/* Breadcrumb */}
              <div className="container mx-auto px-4 pt-8 pb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-10 bg-muted" />
                  <div className="h-3 w-2 bg-muted" />
                  <div className="h-3 w-16 bg-muted" />
                  <div className="h-3 w-2 bg-muted" />
                  <div className="h-3 w-24 bg-muted" />
                  <div className="h-3 w-2 bg-muted" />
                  <div className="h-3 w-32 bg-muted" />
                </div>
              </div>
              {/* Two-column layout */}
              <div className="container mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left column */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <div className="h-7 w-2/5 bg-muted mb-3" />
                      <div className="h-3 w-3/5 bg-muted" />
                    </div>
                    {/* Install command */}
                    <div>
                      <div className="h-3 w-12 bg-muted mb-2" />
                      <div className="h-9 w-full bg-muted" />
                    </div>
                    {/* SKILL.md placeholder */}
                    <div className="h-10 w-full border border-border" />
                  </div>
                  {/* Sidebar */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="border border-border bg-card p-4 space-y-4">
                      <div className="flex justify-between">
                        <div className="h-3 w-20 bg-muted" />
                        <div className="h-3 w-12 bg-muted" />
                      </div>
                      <div className="flex justify-between">
                        <div className="h-3 w-24 bg-muted" />
                        <div className="h-3 w-12 bg-muted" />
                      </div>
                      <div className="flex justify-between">
                        <div className="h-3 w-12 bg-muted" />
                        <div className="h-5 w-14 bg-muted" />
                      </div>
                      <div className="border-t pt-4">
                        <div className="h-3 w-28 bg-muted" />
                      </div>
                    </div>
                    <div className="border border-border bg-card p-4 space-y-3">
                      <div className="h-3 w-20 bg-muted" />
                      <div className="h-16 w-full bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <SkillDetailContent id={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
