#!/usr/bin/env bun
/**
 * Generate LLM editorial summaries for skills
 *
 * Fetches top N skills by installs, grabs their SKILL.md from GitHub,
 * sends to Claude Sonnet for an editorial summary, and upserts to Supabase.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... bun run scripts/generate-summaries.ts
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

async function fetchSkillMarkdown(
  repo: string,
  skillName: string
): Promise<string | null> {
  const branches = ["main", "master"];
  const [org, repoName] = repo.split("/");
  const prefixCandidates = new Set<string>();
  if (org) {
    prefixCandidates.add(org);
    prefixCandidates.add(org.split("-")[0]);
  }
  if (repoName) {
    prefixCandidates.add(repoName);
    prefixCandidates.add(repoName.split("-")[0]);
  }
  const nameVariants = new Set<string>([skillName]);
  for (const prefix of prefixCandidates) {
    if (skillName.startsWith(prefix + "-")) {
      nameVariants.add(skillName.slice(prefix.length + 1));
    }
  }

  const dirPatterns = ["skills", "", ".claude/skills"];

  for (const branch of branches) {
    for (const name of nameVariants) {
      for (const dir of dirPatterns) {
        const filePath = dir ? `${dir}/${name}/SKILL.md` : `${name}/SKILL.md`;
        const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
        try {
          const res = await fetch(url);
          if (res.ok) return await res.text();
        } catch {
          continue;
        }
      }
    }
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${repo}/${branch}/SKILL.md`
      );
      if (res.ok) return await res.text();
    } catch {
      // continue
    }
  }
  return null;
}

async function generateSummary(
  anthropic: Anthropic,
  skillName: string,
  skillDescription: string,
  skillMd: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Write an editor's note for a Claude Code skill on claudemarketplaces.com.

Skill: ${skillName}
Description: ${skillDescription}

<skill_md>
${skillMd.slice(0, 8000)}
</skill_md>

Write a single short paragraph, 80-120 words. This is an editor's note, not a product description.

Rules:
- Be direct and specific. Say what it does, when you'd use it, and one honest take.
- Write like a developer telling another developer about a tool over coffee.
- Mention concrete things: specific checks it runs, specific files it generates, specific problems it solves.
- No filler. No "developers will find this valuable". No "what sets this apart". No "particularly useful".
- No em dashes. Use periods and commas.
- No markdown formatting. Just a plain paragraph.
- Don't start with "This skill" or the skill name.`,
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
  log("  Generate Editorial Summaries for Skills", c.bright);
  log("".padEnd(60, "="), c.cyan);

  // Validate env
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

  // Fetch top skills by installs that don't have a summary yet
  log(`\n  Fetching top ${LIMIT} skills by installs (without summary)...`, c.cyan);

  const { data: skills, error } = await supabase
    .from("skills")
    .select("id, name, description, repo, summary")
    .is("summary", null)
    .order("installs", { ascending: false })
    .limit(LIMIT);

  if (error) {
    log(`  ERR Fetching skills: ${error.message}`, c.red);
    process.exit(1);
  }

  if (!skills || skills.length === 0) {
    log("  All top skills already have summaries!", c.green);
    return;
  }

  log(`  Found ${skills.length} skills to process\n`, c.gray);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const label = `[${i + 1}/${skills.length}]`;

    // Fetch SKILL.md
    const skillMd = await fetchSkillMarkdown(skill.repo, skill.name);
    if (!skillMd) {
      log(`${label} ${c.yellow}SKIP${c.reset} ${skill.name} — no SKILL.md found`);
      skipped++;
      continue;
    }

    // Generate summary
    try {
      const summary = await generateSummary(
        anthropic,
        skill.name,
        skill.description,
        skillMd
      );

      // Upsert to Supabase
      const { error: updateError } = await supabase
        .from("skills")
        .update({ summary })
        .eq("id", skill.id);

      if (updateError) {
        log(`${label} ${c.red}ERR${c.reset}  ${skill.name} — ${updateError.message}`);
        failed++;
        continue;
      }

      log(`${label} ${c.green}OK${c.reset}   ${skill.name} (${summary.length} chars)`);
      success++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`${label} ${c.red}ERR${c.reset}  ${skill.name} — ${msg}`);
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
