import { getAllSkills, getTopSkills } from "@/lib/data/skills";
import { getAllMcpServers, getTopMcpServers } from "@/lib/data/mcp-servers";
import {
  getAllMarketplaces,
  getTopMarketplaces,
} from "@/lib/data/marketplaces";
import { SKILL_CATEGORIES } from "@/lib/data/skill-categories";
import { MCP_CATEGORIES } from "@/lib/data/mcp-categories";
import { MARKETPLACE_CATEGORIES } from "@/lib/data/marketplace-categories";

export const revalidate = 86400;

const BASE = "https://claudemarketplaces.com";

function bullet(name: string, url: string, desc: string): string {
  const cleanDesc = desc.replace(/\s+/g, " ").trim().slice(0, 160);
  return `- [${name}](${url}): ${cleanDesc}`;
}

export async function GET() {
  const [
    allSkills,
    allMcp,
    allMarketplaces,
    topSkills,
    topMcp,
    topMarketplaces,
  ] = await Promise.all([
    getAllSkills(),
    getAllMcpServers(),
    getAllMarketplaces({ includeEmpty: false }),
    getTopSkills(10),
    getTopMcpServers(10),
    getTopMarketplaces(10),
  ]);

  const updated = new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    "# Claude Code Marketplaces",
    "",
    "> The largest community-curated directory of Claude Code extensions: skills, plugins, and MCP servers. Updated daily from GitHub. 110,000+ developers use it monthly to discover tools for AI-assisted development.",
    "",
    `Last updated: ${updated}`,
    "",
    "## At a glance",
    "",
    `- ${allSkills.length}+ Claude Code skills indexed`,
    `- ${allMcp.length}+ MCP (Model Context Protocol) servers indexed`,
    `- ${allMarketplaces.length}+ plugin marketplaces indexed`,
    "- ~110,000 unique monthly visitors (100% organic, public analytics)",
    "- Updated daily from GitHub via automated discovery",
    "- Free, open source, no signup required to browse or install",
    "- Independent project, not affiliated with Anthropic",
    "",
    "## Definitions",
    "",
    "- **Skill**: a single reusable instruction set (a SKILL.md file) that teaches Claude Code how to do a specific task. Installs with one command.",
    "- **Plugin**: a bundle of Claude Code extensions (skills, MCP servers, slash commands, hooks, or agents) packaged as one installable unit.",
    "- **Marketplace**: a GitHub repo that hosts and distributes multiple plugins under one registry. Subscribe with `/plugin marketplace add <owner/repo>`.",
    "- **MCP server**: a Model Context Protocol server that extends Claude Code with external tools, APIs, and integrations.",
    "",
    "## Top entry points",
    "",
    bullet("Homepage", BASE, "Discover Claude Code plugins, skills, and MCP servers."),
    bullet("Skills", `${BASE}/skills`, `Browse all ${allSkills.length}+ Claude Code skills, sorted by installs.`),
    bullet("MCP servers", `${BASE}/mcp`, `Browse all ${allMcp.length}+ MCP servers compatible with Claude Code.`),
    bullet("Marketplaces", `${BASE}/marketplaces`, `Browse all ${allMarketplaces.length}+ plugin marketplaces.`),
    bullet("Learn", `${BASE}/learn`, "Editorial guides for Claude Code skills, plugins, and MCP."),
    bullet("Newsletter digest", `${BASE}/digest`, "This week in Claude — weekly model updates, releases, and notable tools."),
    bullet("Advertise", `${BASE}/advertise`, "Sponsorship pricing and traffic stats for advertisers."),
    bullet("Pricing (machine-readable)", `${BASE}/pricing.md`, "Structured ad pricing for AI agents evaluating sponsorship."),
    bullet("About", `${BASE}/about`, "Why this directory exists and how it stays curated."),
    "",
    "## Top skills (by installs and votes)",
    "",
    ...topSkills.map((s) =>
      bullet(s.name, `${BASE}/skills/${s.id}`, s.summary || s.description),
    ),
    "",
    "## Top MCP servers (by stars and votes)",
    "",
    ...topMcp.map((s) =>
      bullet(
        s.displayName || s.name,
        `${BASE}/mcp/${s.slug}`,
        s.summary || s.description,
      ),
    ),
    "",
    "## Top marketplaces (by stars and plugin count)",
    "",
    ...topMarketplaces.map((m) =>
      bullet(m.repo, `${BASE}/plugins/${m.slug}`, m.description),
    ),
    "",
    "## Skill categories",
    "",
    ...SKILL_CATEGORIES.map((c) =>
      bullet(c.name, `${BASE}/skills/category/${c.slug}`, c.description),
    ),
    "",
    "## MCP server categories",
    "",
    ...MCP_CATEGORIES.map((c) =>
      bullet(c.name, `${BASE}/mcp/category/${c.slug}`, c.description),
    ),
    "",
    "## Marketplace categories",
    "",
    ...MARKETPLACE_CATEGORIES.map((c) =>
      bullet(
        c.name,
        `${BASE}/marketplaces/category/${c.slug}`,
        c.description,
      ),
    ),
    "",
    "## Common questions answered on this site",
    "",
    "- What are Claude Code skills, plugins, and MCP servers?",
    "- How do I install a Claude Code skill?",
    "- How do I add a plugin marketplace to Claude Code?",
    "- What are the most popular Claude Code skills right now?",
    "- Which MCP servers work with Claude Code?",
    "- How do I publish my own Claude Code skill or marketplace?",
    "- How do I advertise to Claude Code developers?",
    "",
    "## Other resources",
    "",
    bullet("llms-full.txt", `${BASE}/llms-full.txt`, "Long-form context file for AI systems."),
    bullet("Sitemap", `${BASE}/sitemap.xml`, "All indexable URLs, refreshed daily."),
    bullet("robots.txt", `${BASE}/robots.txt`, "Crawl rules — all major AI bots are allowed."),
    bullet("GitHub source", "https://github.com/mert-duzgun/claudemarketplaces.com", "Open source, MIT licensed."),
    bullet("Contact", "mailto:mert@vinena.studio", "Email the maintainer."),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
