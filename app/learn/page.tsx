import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VideoCard } from "@/components/video-card";
import { videos } from "@/lib/data/learn-content";

export const metadata: Metadata = {
  title: "Learn - Claude Code Videos & Tutorials",
  description:
    "Learn about Claude Code through video tutorials and guides. Discover tips, tricks, and best practices from the community.",
  openGraph: {
    title: "Learn - Claude Code Videos & Tutorials",
    description:
      "Learn about Claude Code through video tutorials and guides from the community.",
    url: "https://claudemarketplaces.com/learn",
    type: "website",
  },
};

export default function LearnPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        subtitle="Learn about Claude Code through video tutorials"
        showAboutLink={true}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.url} video={video} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
