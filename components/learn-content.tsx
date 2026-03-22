"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoCard } from "@/components/video-card";
import { ArticleCard } from "@/components/article-card";
import { LinkCard } from "@/components/link-card";
import { Video, Article, LearnLink } from "@/lib/types";

interface LearnContentProps {
  videos: Video[];
  articles: Article[];
  links: LearnLink[];
}

export function LearnContent({ videos, articles, links }: LearnContentProps) {
  return (
    <Tabs defaultValue="videos">
      <TabsList>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="articles">X Posts</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
      </TabsList>
      <TabsContent value="videos">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {videos.map((video) => (
            <VideoCard key={video.url} video={video} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="articles">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {articles.map((article) => (
            <ArticleCard key={article.url} article={article} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="links">
        <div className="flex flex-col gap-3 mt-4 max-w-3xl">
          {links.map((link) => (
            <LinkCard key={link.url} link={link} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
