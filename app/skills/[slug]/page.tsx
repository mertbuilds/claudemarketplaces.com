import { Suspense } from "react";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkillCard } from "@/components/skill-card";
import {
  getAllSkillRepos,
  getSkillRepoBySlug,
  getSkillsByRepo,
} from "@/lib/data/skills";
import { slugToRepo } from "@/lib/utils/slug";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all skill repos
export async function generateStaticParams() {
  const skillRepos = await getAllSkillRepos();
  return skillRepos.map((repo) => ({
    slug: repo.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const skillRepo = await getSkillRepoBySlug(slug);

  if (!skillRepo) {
    return {
      title: "Skill Repository Not Found",
    };
  }

  const title = `${skillRepo.repo} Skills | Claude Code Skills`;
  const description =
    skillRepo.description ||
    `Discover ${skillRepo.skillCount}+ skills from ${skillRepo.repo}. Enhance your Claude Code workflow with reusable skills.`;

  return {
    title,
    description,
    keywords: [
      `${skillRepo.repo} skills`,
      "Claude Code skills",
      "Claude skills marketplace",
      "AI development tools",
      "Claude extensions",
    ],
    openGraph: {
      title,
      description,
      url: `https://claudemarketplaces.com/skills/${slug}`,
      siteName: "Claude Code Marketplaces",
      type: "website",
      images: [
        {
          url: "https://claudemarketplaces.com/og-image.png",
          width: 1200,
          height: 630,
          alt: `${skillRepo.repo} Skills`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://claudemarketplaces.com/og-image.png"],
    },
  };
}

async function SkillData({ slug }: { slug: string }) {
  const skillRepo = await getSkillRepoBySlug(slug);

  if (!skillRepo) {
    notFound();
  }

  const repoName = slugToRepo(slug);
  const skills = await getSkillsByRepo(repoName);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/?tab=skills">Skills</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{skillRepo.repo}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Skill Repo Header */}
      <div className="container mx-auto px-4 pb-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold font-serif mb-2">
            {skillRepo.repo}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {skillRepo.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{skillRepo.skillCount} skills</span>
            {skillRepo.stars !== undefined && skillRepo.stars > 0 && (
              <span>* {skillRepo.stars} stars</span>
            )}
            <a
              href={`https://github.com/${skillRepo.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="container mx-auto px-4 py-8">
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">
              Skills are currently being indexed.
            </p>
            <p className="text-sm text-muted-foreground">
              This repository has {skillRepo.skillCount}{" "}
              {skillRepo.skillCount === 1 ? "skill" : "skills"} that will appear
              shortly.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default async function SkillRepoPage({ params }: PageProps) {
  const { slug } = await params;
  const skillRepo = await getSkillRepoBySlug(slug);

  // Generate structured data for SEO
  const structuredData = skillRepo
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${skillRepo.repo} Skills`,
        description: skillRepo.description,
        url: `https://claudemarketplaces.com/skills/${slug}`,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://claudemarketplaces.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Skills",
              item: "https://claudemarketplaces.com/?tab=skills",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: skillRepo.repo,
              item: `https://claudemarketplaces.com/skills/${slug}`,
            },
          ],
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: skillRepo.skillCount,
        },
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {structuredData && (
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(structuredData)}
        </Script>
      )}
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-9 bg-muted rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <SkillData slug={slug} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
