import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center mb-4">
          <iframe
            src="https://mertbuilds.substack.com/embed"
            width="480"
            height="320"
            style={{
              border: "none",
              background: "#fdfdf7",
            }}
          ></iframe>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Claude Code Marketplaces</h3>
            <p className="text-sm text-muted-foreground">
              Discover Claude Code plugins, extensions, and tools. Automatically
              updated directory of Anthropic Claude AI marketplaces with
              development tools, productivity plugins, and integrations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://docs.claude.com/en/docs/claude-code/plugin-marketplaces#marketplace-schema"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plugin Marketplaces
                </a>
              </li>
              <li>
                <a
                  href="https://www.anthropic.com/news/claude-code-plugins"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Announcement (Blog)
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/AnthropicAI/status/1878133858093199712"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Announcement (X)
                </a>
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
            <h3 className="font-semibold mb-3">Community</h3>
            <ul className="space-y-2 text-sm">
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
                <a
                  href="https://github.com/mert-duzgun/claudemarketplaces.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Star on GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mert-duzgun/claudemarketplaces.com/issues"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>Built for the Claude Code community with Claude Code</p>
            <div className="flex items-center gap-3">
              <span>Independent project, not affiliated with Anthropic</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
