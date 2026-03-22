"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface SkillMarkdownProps {
  content: string;
}

function stripFrontmatter(md: string): string {
  return md.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
}

export function SkillMarkdown({ content }: SkillMarkdownProps) {
  const cleaned = stripFrontmatter(content);
  return (
    <div className="prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:text-left prose-img:rounded-md prose-strong:text-foreground prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-td:text-foreground prose-th:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{cleaned}</ReactMarkdown>
    </div>
  );
}
