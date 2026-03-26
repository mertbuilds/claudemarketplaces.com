import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Article } from "@/lib/types";
import Image from "next/image";

interface ArticleCardProps {
  article: Article;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="pt-0 h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader className="p-0 space-y-0">
          {article.image ? (
            <div className="relative w-full aspect-video">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-muted flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-12 w-12 text-foreground/70"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          )}
          <div className="p-6 space-y-2">
            <CardTitle className="text-xl line-clamp-2 leading-7">
              {article.title}
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {article.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={article.author.image}
                  alt={article.author.name}
                />
                <AvatarFallback>
                  {getInitials(article.author.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {article.author.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(article.date)}
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
