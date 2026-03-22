import { Badge } from "@/components/ui/badge";
import { LearnLink } from "@/lib/types";

interface LinkCardProps {
  link: LearnLink;
}

export function LinkCard({ link }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md hover:border-primary/50"
    >
      <div className="shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-foreground/70"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium leading-snug">{link.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
          {link.description}
        </p>
      </div>
      <Badge variant="secondary" className="shrink-0">
        {link.source}
      </Badge>
    </a>
  );
}
