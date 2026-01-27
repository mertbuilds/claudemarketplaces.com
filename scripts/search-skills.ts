#!/usr/bin/env bun
/**
 * Standalone search script for discovering and validating Claude Code skills
 *
 * Usage:
 *   bun run scripts/search-skills.ts                    # Run full search
 *   bun run scripts/search-skills.ts --limit 10         # Test with first 10 repos
 *   bun run scripts/search-skills.ts --dry-run          # Preview without saving
 *   bun run scripts/search-skills.ts --verbose          # Show detailed logs
 */

import { searchSkillFiles, fetchSkillFile } from "../lib/search/github-skills-search";
import { validateSkills } from "../lib/search/skills-validator";
import { mergeSkills, mergeSkillRepos } from "../lib/search/skills-storage";
import { batchFetchStars } from "../lib/search/github-stars";
import { repoToSlug } from "../lib/utils/slug";
import { SkillRepo } from "../lib/types";

// CLI argument parsing
interface CliArgs {
  limit?: number;
  dryRun: boolean;
  verbose: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    dryRun: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--limit" && i + 1 < args.length) {
      result.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg === "--verbose" || arg === "-v") {
      result.verbose = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
Usage: bun run scripts/search-skills.ts [options]

Options:
  --limit N       Limit results to first N repositories
  --dry-run       Run validation without saving results
  --verbose, -v   Show detailed logging
  --help, -h      Show this help message

Examples:
  bun run scripts/search-skills.ts                  # Full search
  bun run scripts/search-skills.ts --limit 10       # Test with 10 repos
  bun run scripts/search-skills.ts --dry-run        # Preview mode
`);
      process.exit(0);
    }
  }

  return result;
}

// ANSI color codes for CLI output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step: number | string, message: string) {
  log(`\n${colors.bright}[${step}/8]${colors.reset} ${colors.cyan}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  log(`  ${message}`, colors.green);
}

function logWarning(message: string) {
  log(`  ${message}`, colors.yellow);
}

function logError(message: string) {
  log(`  ${message}`, colors.red);
}

function logInfo(message: string) {
  log(`  ${message}`, colors.gray);
}

async function runSearch() {
  const args = parseArgs();
  const startTime = Date.now();

  // Banner
  log("".repeat(60), colors.cyan);
  log("  Claude Code Skills Search", colors.bright);
  log("".repeat(60), colors.cyan);

  if (args.limit) {
    logWarning(`Running in test mode (limit: ${args.limit} repos)`);
  }
  if (args.dryRun) {
    logWarning("Running in DRY RUN mode (no data will be saved)");
  }
  if (args.verbose) {
    logInfo("Verbose logging enabled");
  }

  try {
    // Step 1: Search GitHub for SKILL.md files
    logStep(1, "Searching GitHub for SKILL.md files...");
    const searchResults = await searchSkillFiles(args.verbose);
    logSuccess(`Found ${searchResults.length} potential skills`);

    if (searchResults.length === 0) {
      logWarning("No skills found. Exiting.");
      return;
    }

    // Apply limit if specified (by unique repos)
    const uniqueRepos = [...new Set(searchResults.map((r) => r.repo))];
    const reposToProcess = args.limit ? uniqueRepos.slice(0, args.limit) : uniqueRepos;
    const resultsToProcess = searchResults.filter((r) => reposToProcess.includes(r.repo));

    if (args.limit && reposToProcess.length < uniqueRepos.length) {
      logInfo(`Processing first ${reposToProcess.length} of ${uniqueRepos.length} repos`);
    }

    // Step 2: Fetch GitHub stars
    logStep(2, "Fetching GitHub star counts...");
    const starMap = await batchFetchStars(reposToProcess, args.verbose);
    const starsFetched = Array.from(starMap.values()).filter((s) => s !== null).length;
    logSuccess(`Fetched stars for ${starsFetched}/${reposToProcess.length} repos`);

    // Step 3: Apply quality filter (5+ stars)
    logStep(3, "Applying quality filter (5+ stars)...");
    const qualityRepos = reposToProcess.filter((repo) => {
      const stars = starMap.get(repo) ?? 0;
      return stars >= 5;
    });
    const filteredOutCount = reposToProcess.length - qualityRepos.length;

    logSuccess(`Kept ${qualityRepos.length}/${reposToProcess.length} repos (>=5 stars)`);
    if (filteredOutCount > 0) {
      logWarning(`Filtered out ${filteredOutCount} repos with <5 stars (saved API calls)`);
    }

    if (qualityRepos.length === 0) {
      logWarning("No repos passed the quality filter. Exiting.");
      return;
    }

    // Filter results to quality repos only
    const qualityResults = resultsToProcess.filter((r) => qualityRepos.includes(r.repo));

    // Step 4: Fetch SKILL.md files
    logStep(4, "Fetching SKILL.md files (quality repos only)...");
    const fetchedFiles = await Promise.allSettled(
      qualityResults.map(async (result) => {
        if (args.verbose) {
          logInfo(`Fetching ${result.repo}/${result.path}...`);
        }
        return {
          repo: result.repo,
          path: result.path,
          content: await fetchSkillFile(result.repo, result.path, "main", args.verbose),
        };
      })
    );

    const validFiles = fetchedFiles
      .filter(
        (result): result is PromiseFulfilledResult<{ repo: string; path: string; content: string }> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    const failedFetches = fetchedFiles.length - validFiles.length;
    logSuccess(`Fetched ${validFiles.length}/${qualityResults.length} files`);
    if (failedFetches > 0) {
      logWarning(`${failedFetches} files failed to fetch`);
    }

    // Step 5: Validate SKILL.md frontmatter
    logStep(5, "Validating SKILL.md frontmatter with Zod schema...");
    const filesWithStars = validFiles.map((f) => ({
      ...f,
      stars: starMap.get(f.repo) ?? undefined,
    }));
    const validationResults = validateSkills(filesWithStars);

    const validSkills = validationResults
      .filter((result) => result.valid && result.skill)
      .map((result) => result.skill!);

    const failedValidations = validationResults.filter((result) => !result.valid);

    logSuccess(`Valid: ${validSkills.length}/${validFiles.length}`);
    if (failedValidations.length > 0) {
      logError(`Failed: ${failedValidations.length}`);

      if (args.verbose) {
        failedValidations.forEach((failed, index) => {
          const file = validFiles[validationResults.indexOf(failed)];
          const repo = file?.repo || "unknown";
          const path = file?.path || "unknown";
          logError(`  ${index + 1}. ${repo}/${path}`);
          failed.errors.forEach((error) => {
            logInfo(`     - ${error}`);
          });
        });
      } else {
        logInfo("Run with --verbose to see validation errors");
      }
    }

    if (validSkills.length === 0) {
      logWarning("No valid skills found. Exiting.");
      return;
    }

    // Step 6: Extract skill metadata (aggregate into skill repos)
    logStep(6, "Aggregating skills into skill repos...");
    const repoSkillCount = new Map<string, number>();
    for (const skill of validSkills) {
      repoSkillCount.set(skill.repo, (repoSkillCount.get(skill.repo) || 0) + 1);
    }

    const skillRepos: SkillRepo[] = [];
    for (const [repo, skillCount] of repoSkillCount) {
      const repoSkills = validSkills.filter((s) => s.repo === repo);
      const firstSkill = repoSkills[0];

      skillRepos.push({
        repo,
        slug: repoToSlug(repo),
        description: repoSkills.map((s) => s.name).join(", "),
        skillCount,
        stars: starMap.get(repo) ?? undefined,
        starsFetchedAt: starMap.get(repo) !== null ? new Date().toISOString() : undefined,
        discoveredAt: firstSkill.discoveredAt,
        source: "auto",
      });
    }

    logSuccess(`Aggregated ${validSkills.length} skills into ${skillRepos.length} repos`);

    // Step 7: Preview results
    logStep(7, "Skills Summary");

    // Show top 10 by stars
    const sortedRepos = [...skillRepos].sort((a, b) => (b.stars || 0) - (a.stars || 0));
    const topTen = sortedRepos.slice(0, 10);

    topTen.forEach((repo, index) => {
      const stars = repo.stars !== undefined ? `* ${repo.stars}` : "* N/A";
      logInfo(`${index + 1}. ${repo.repo} - ${repo.skillCount} skills - ${stars}`);
    });

    if (sortedRepos.length > 10) {
      logInfo(`... and ${sortedRepos.length - 10} more`);
    }

    // Step 8: Save results
    if (args.dryRun) {
      logStep(8, "Skipping save (dry run mode)");
      logWarning("Results not saved due to --dry-run flag");
    } else {
      logStep(8, "Saving to database...");

      // Save skills
      const allDiscoveredIds = new Set(validSkills.map((s) => s.id));
      const skillsMergeResult = await mergeSkills(validSkills, allDiscoveredIds);

      logSuccess(`Skills - Added: ${skillsMergeResult.added}, Updated: ${skillsMergeResult.updated}`);
      if (skillsMergeResult.removed > 0) {
        logWarning(`Skills - Removed: ${skillsMergeResult.removed} invalid entries`);
      }
      logSuccess(`Skills - Total: ${skillsMergeResult.total}`);

      // Save skill repos
      const allDiscoveredRepos = new Set(skillRepos.map((r) => r.repo));
      const reposMergeResult = await mergeSkillRepos(skillRepos, allDiscoveredRepos);

      logSuccess(`Skill Repos - Added: ${reposMergeResult.added}, Updated: ${reposMergeResult.updated}`);
      if (reposMergeResult.removed > 0) {
        logWarning(`Skill Repos - Removed: ${reposMergeResult.removed} invalid entries`);
      }
      logSuccess(`Skill Repos - Total: ${reposMergeResult.total}`);
    }

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const apiCallsSaved = filteredOutCount;

    log("\n" + "".repeat(60), colors.cyan);
    log("  Search Complete!", colors.bright);
    log("".repeat(60), colors.cyan);
    log(`  Duration: ${duration}s`, colors.gray);
    log(`  Success Rate: ${((validSkills.length / validFiles.length) * 100).toFixed(1)}%`, colors.gray);
    log(`  API Calls Saved: ${apiCallsSaved} (quality filter before fetch)`, colors.gray);

    if (!args.dryRun) {
      log(`  Skills saved to lib/data/skills.json`, colors.green);
      log(`  Skill repos saved to lib/data/skill-repos.json`, colors.green);
    }

    log("".repeat(60) + "\n", colors.cyan);

  } catch (error) {
    logError(`Search failed: ${error instanceof Error ? error.message : String(error)}`);
    if (args.verbose && error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the search
runSearch();
