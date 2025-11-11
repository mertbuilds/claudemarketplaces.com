import { cn } from "@/lib/utils";
import Link from "next/link";

export function Header({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      className={cn("w-full border-b border-border bg-secondary", className)}
      {...props}
    >
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div
            className={cn(
              "rounded-full bg-primary size-4 mt-1 shadow-md shadow-primary-foreground/5",
              "max-md:mt-0.5 max-md:size-3.5"
            )}
          />

          <h1
            className={cn(
              "text-4xl font-display text-primary-foreground tracking-tight font-[450] transition-opacity",
              "max-md:text-3xl",
              "hover:opacity-80"
            )}
          >
            Claude Marketplaces
          </h1>
        </Link>
      </div>
    </header>
  );
}
