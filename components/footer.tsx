import Link from "next/link";
import { SKILL_CATEGORIES } from "@/lib/data/skill-categories";
import { MCP_CATEGORIES } from "@/lib/data/mcp-categories";
import { MARKETPLACE_CATEGORIES } from "@/lib/data/marketplace-categories";
import { CategoryChips } from "@/components/category-chips";

export function Footer({ hideCategories = false }: { hideCategories?: boolean } = {}) {
  const skillChips = SKILL_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    href: `/skills/category/${cat.slug}`,
  }));

  const mcpChips = MCP_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    href: `/mcp/category/${cat.slug}`,
  }));

  const marketplaceChips = MARKETPLACE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    href: `/marketplaces/category/${cat.slug}`,
  }));

  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        {!hideCategories && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-border">
            {/* Skills categories */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Link
                  href="/skills"
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Skills by Category
                </Link>
              </div>
              <CategoryChips categories={skillChips} />
            </div>

            {/* MCP Server categories */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Link
                  href="/mcp"
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  MCP Servers by Category
                </Link>
              </div>
              <CategoryChips categories={mcpChips} />
            </div>

            {/* Marketplace categories */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Link
                  href="/marketplaces"
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Marketplaces by Category
                </Link>
              </div>
              <CategoryChips categories={marketplaceChips} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div>
            <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">Claude Code Marketplaces</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Discover Claude Code plugins, extensions, and tools. Automatically
              updated directory of Anthropic Claude AI marketplaces with
              development tools, productivity plugins, and integrations.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">Resources</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/skills"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link
                  href="/mcp"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse MCP Servers
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplaces"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Marketplaces
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.claude.com/en/docs/claude-code/plugins-reference"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plugins Reference
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mert-duzgun/claudemarketplaces.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">Community</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Learn
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Feedback
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Advertise
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>Built for the Claude Code community with Claude Code by <a href="https://x.com/mertduzgun" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">@mertduzgun</a></p>
            <span>Independent project, not affiliated with Anthropic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
