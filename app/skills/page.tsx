import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
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
};

async function SkillsData() {
  const skills = await getAllSkills({ includeEmpty: false });
  return <SkillsContent skills={skills} />;
}

export default function SkillsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Navigation />
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-9 bg-muted rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
