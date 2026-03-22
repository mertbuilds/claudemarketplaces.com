import { Suspense } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllSkills } from "@/lib/data/skills";
import { SkillsContent } from "@/components/skills-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code Skills | Discover Agent Skills",
  description:
    "Browse and discover Claude Code agent skills. Find reusable skill definitions to enhance your Claude Code workflows.",
  keywords: [
    "claude code skills",
    "agent skills",
    "claude skills",
    "ai skills",
    "claude code",
  ],
  openGraph: {
    title: "Claude Code Skills | Discover Agent Skills",
    description:
      "Browse and discover Claude Code agent skills. Find reusable skill definitions to enhance your Claude Code workflows.",
    url: "https://claudemarketplaces.com/skills",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Skills | Discover Agent Skills",
    description:
      "Browse and discover Claude Code agent skills. Find reusable skill definitions to enhance your Claude Code workflows.",
  },
};

async function SkillsData() {
  const skills = await getAllSkills();
  return (
    <SkillsContent
      skills={skills}
      newsletterSeed={[Math.random(), Math.random()]}
    />
  );
}

export default function SkillsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Claude Code Skills",
    description:
      "Browse and discover Claude Code agent skills. Find reusable skill definitions to enhance your Claude Code workflows.",
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
        <div className="container mx-auto px-4 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold">Claude Code Skills</h1>
        </div>
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-9 bg-muted rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded-lg" />
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
