#!/usr/bin/env bun
/**
 * Generate LLM editorial summaries for MCP servers
 *
 * Fetches top N MCP servers by stars, grabs their README.md from GitHub,
 * sends to Claude Sonnet for an editorial summary, and upserts to Supabase.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... bun run scripts/generate-summaries-mcp.ts
 *
 * Requires:
 *   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - ANTHROPIC_API_KEY env var
 */

import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "../lib/supabase/admin";

const LIMIT = parseInt(process.env.LIMIT || "50", 10);
const MODEL = "claude-sonnet-4-20250514";

const c = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(msg: string, color = c.reset) {
  console.log(`${color}${msg}${c.reset}`);
}

async function fetchReadme(slug: string): Promise<string | null> {
  // slug is org/repo format, which maps directly to GitHub
  for (const branch of ["main", "master"]) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${slug}/${branch}/README.md`
      );
      if (res.ok) return await res.text();
    } catch {
      continue;
    }
  }
  return null;
}

async function generateSummary(
  anthropic: Anthropic,
  name: string,
  description: string,
  readme: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Write an editor's note for an MCP server listed on claudemarketplaces.com.

MCP Server: ${name}
Description: ${description}

<readme>
${readme.slice(0, 8000)}
</readme>

Write a single short paragraph, 80-120 words. This is an editor's note, not a product description.

Rules:
- Be direct and specific. Say what it connects to, what operations it exposes, and when you'd reach for it.
- Write like a developer telling another developer about a tool over coffee.
- Mention concrete things: specific APIs it wraps, specific actions you can take, specific integrations it enables.
- No filler. No "developers will find this valuable". No "what sets this apart". No "particularly useful".
- No em dashes. Use periods and commas.
- No markdown formatting. Just a plain paragraph.
- Don't start with "This MCP server" or the server name.`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text.trim();
}

async function main() {
  const startTime = Date.now();

  log("\n" + "".padEnd(60, "="), c.cyan);
  log("  Generate Editorial Summaries for MCP Servers", c.bright);
  log("".padEnd(60, "="), c.cyan);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    log("  ERR Missing ANTHROPIC_API_KEY env var", c.red);
    process.exit(1);
  }
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    log("  ERR Missing Supabase env vars", c.red);
    process.exit(1);
  }

  const anthropic = new Anthropic({ apiKey });
  const supabase = createAdminClient();

  log(
    `\n  Fetching top ${LIMIT} MCP servers by stars (without summary)...`,
    c.cyan
  );

  const { data: servers, error } = await supabase
    .from("mcp_servers")
    .select("slug, name, description, summary")
    .is("summary", null)
    .order("stars", { ascending: false })
    .limit(LIMIT);

  if (error) {
    log(`  ERR Fetching MCP servers: ${error.message}`, c.red);
    process.exit(1);
  }

  if (!servers || servers.length === 0) {
    log("  All top MCP servers already have summaries!", c.green);
    return;
  }

  log(`  Found ${servers.length} MCP servers to process\n`, c.gray);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    const label = `[${i + 1}/${servers.length}]`;

    const readme = await fetchReadme(server.slug);
    if (!readme) {
      log(
        `${label} ${c.yellow}SKIP${c.reset} ${server.slug} — no README.md found`
      );
      skipped++;
      continue;
    }

    try {
      const summary = await generateSummary(
        anthropic,
        server.name,
        server.description,
        readme
      );

      const { error: updateError } = await supabase
        .from("mcp_servers")
        .update({ summary })
        .eq("slug", server.slug);

      if (updateError) {
        log(
          `${label} ${c.red}ERR${c.reset}  ${server.slug} — ${updateError.message}`
        );
        failed++;
        continue;
      }

      log(
        `${label} ${c.green}OK${c.reset}   ${server.slug} (${summary.length} chars)`
      );
      success++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`${label} ${c.red}ERR${c.reset}  ${server.slug} — ${msg}`);
      failed++;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log(`\n${"".padEnd(60, "=")}`, c.cyan);
  log(
    `  Done in ${elapsed}s — ${c.green}${success} generated${c.reset}, ${c.yellow}${skipped} skipped${c.reset}, ${c.red}${failed} failed${c.reset}`
  );
  log("".padEnd(60, "="), c.cyan);
}

main().catch((err) => {
  log(`  ERR ${err.message ?? err}`, c.red);
  process.exit(1);
});
