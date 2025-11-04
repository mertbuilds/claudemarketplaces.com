#!/usr/bin/env bun
/**
 * Standalone search script for discovering and validating Claude Code marketplaces
 *
 * Usage:
 *   bun run scripts/search.ts                    # Run full search
 *   bun run scripts/search.ts --limit 10         # Test with first 10 repos
 *   bun run scripts/search.ts --dry-run          # Preview without saving
 *   bun run scripts/search.ts --verbose          # Show detailed logs
 */

import { searchMarketplaceFiles, fetchMarketplaceFile } from "../lib/search/github-search";
import { validateMarketplaces } from "../lib/search/validator";
import { mergeMarketplaces, writePlugins } from "../lib/search/storage";
import { batchFetchStars } from "../lib/search/github-stars";
import { extractPluginsFromMarketplaces, aggregatePluginKeywords } from "../lib/search/plugin-extractor";

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
Usage: bun run scripts/search.ts [options]

Options:
  --limit N       Limit results to first N repositories
  --dry-run       Run validation without saving results
  --verbose, -v   Show detailed logging
  --help, -h      Show this help message

Examples:
  bun run scripts/search.ts                  # Full search
  bun run scripts/search.ts --limit 10       # Test with 10 repos
  bun run scripts/search.ts --dry-run        # Preview mode
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

function logStep(step: number, message: string) {
  log(`\n${colors.bright}[${step}/8]${colors.reset} ${colors.cyan}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  log(`  ✅ ${message}`, colors.green);
}

function logWarning(message: string) {
  log(`  ⚠️  ${message}`, colors.yellow);
}

function logError(message: string) {
  log(`  ❌ ${message}`, colors.red);
}

function logInfo(message: string) {
  log(`  ${message}`, colors.gray);
}

async function runSearch() {
  const args = parseArgs();
  const startTime = Date.now();

  // Banner
  log("━".repeat(60), colors.cyan);
  log("  Claude Code Marketplaces Search", colors.bright);
  log("━".repeat(60), colors.cyan);

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
    // Step 1: Search GitHub
    logStep(1, "Searching GitHub for marketplace files...");
    const searchResults = await searchMarketplaceFiles(args.verbose);
    logSuccess(`Found ${searchResults.length} potential marketplaces`);

    if (searchResults.length === 0) {
      logWarning("No marketplaces found. Exiting.");
      return;
    }

    // Apply limit if specified
    const resultsToProcess = args.limit
      ? searchResults.slice(0, args.limit)
      : searchResults;

    if (args.limit && resultsToProcess.length < searchResults.length) {
      logInfo(`Processing first ${resultsToProcess.length} of ${searchResults.length} results`);
    }

    // Step 2: Fetch GitHub stars (BEFORE fetching files to filter early)
    logStep(2, "Fetching GitHub star counts...");
    const allRepos = resultsToProcess.map((r) => r.repo);
    const starMap = await batchFetchStars(allRepos, args.verbose);
    const starsFetched = Array.from(starMap.values()).filter((s) => s !== null).length;
    logSuccess(`Fetched stars for ${starsFetched}/${allRepos.length} repos`);

    // Step 3: Apply quality filter (5+ stars) BEFORE fetching files
    logStep(3, "Applying quality filter (5+ stars)...");
    const qualityRepos = resultsToProcess.filter((result) => {
      const stars = starMap.get(result.repo) ?? 0;
      return stars >= 5;
    });
    const filteredOutCount = resultsToProcess.length - qualityRepos.length;

    logSuccess(`Kept ${qualityRepos.length}/${resultsToProcess.length} repos (≥5 stars)`);
    if (filteredOutCount > 0) {
      logWarning(`Filtered out ${filteredOutCount} repos with <5 stars (saved ${filteredOutCount} API calls)`);
    }

    if (qualityRepos.length === 0) {
      logWarning("No repos passed the quality filter. Exiting.");
      return;
    }

    // Step 4: Fetch marketplace.json files (ONLY for quality repos)
    logStep(4, "Fetching marketplace.json files (quality repos only)...");
    const fetchedFiles = await Promise.allSettled(
      qualityRepos.map(async (result) => {
        if (args.verbose) {
          logInfo(`Fetching ${result.repo}...`);
        }
        return {
          repo: result.repo,
          content: await fetchMarketplaceFile(result.repo, "main", args.verbose),
        };
      })
    );

    const validFiles = fetchedFiles
      .filter(
        (result): result is PromiseFulfilledResult<{ repo: string; content: string }> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    const failedFetches = fetchedFiles.length - validFiles.length;
    logSuccess(`Fetched ${validFiles.length}/${qualityRepos.length} files`);
    if (failedFetches > 0) {
      logWarning(`${failedFetches} files failed to fetch`);
    }

    // Step 5: Validate marketplace files
    logStep(5, "Validating with Zod v4 schema...");
    const validationResults = await validateMarketplaces(validFiles, args.verbose);

    const validMarketplaces = validationResults
      .filter((result) => result.valid && result.marketplace)
      .map((result) => result.marketplace!);

    const failedValidations = validationResults.filter((result) => !result.valid);

    logSuccess(`Valid: ${validMarketplaces.length}/${validFiles.length}`);
    if (failedValidations.length > 0) {
      logError(`Failed: ${failedValidations.length}`);

      if (args.verbose) {
        failedValidations.forEach((failed, index) => {
          const repo = validFiles[validationResults.indexOf(failed)]?.repo || "unknown";
          logError(`  ${index + 1}. ${repo}`);
          failed.errors.forEach((error) => {
            logInfo(`     - ${error}`);
          });
        });
      } else {
        logInfo("Run with --verbose to see validation errors");
      }
    }

    if (validMarketplaces.length === 0) {
      logWarning("No valid marketplaces found. Exiting.");
      return;
    }

    // Add stars to validated marketplaces
    const marketplacesWithStars = validMarketplaces.map((marketplace) => ({
      ...marketplace,
      stars: starMap.get(marketplace.repo) ?? marketplace.stars,
      starsFetchedAt:
        starMap.get(marketplace.repo) !== null
          ? new Date().toISOString()
          : marketplace.starsFetchedAt,
    }));

    // Step 6: Preview results
    logStep(6, "Marketplace Summary");

    // Show top 10 by stars
    const sorted = [...marketplacesWithStars].sort((a, b) => (b.stars || 0) - (a.stars || 0));
    const topTen = sorted.slice(0, 10);

    topTen.forEach((marketplace, index) => {
      const stars = marketplace.stars !== undefined ? `⭐ ${marketplace.stars}` : "⭐ N/A";
      logInfo(`${index + 1}. ${marketplace.repo} - ${marketplace.pluginCount} plugins - ${stars}`);
    });

    if (sorted.length > 10) {
      logInfo(`... and ${sorted.length - 10} more`);
    }

    // Step 7: Extract plugins from marketplaces
    logStep(7, "Extracting plugins from marketplaces...");
    const allPlugins = extractPluginsFromMarketplaces(marketplacesWithStars, validFiles);
    logSuccess(`Extracted ${allPlugins.length} plugins from ${marketplacesWithStars.length} marketplaces`);

    if (args.verbose && allPlugins.length > 0) {
      // Show sample plugins
      const sampleSize = Math.min(5, allPlugins.length);
      logInfo(`Sample plugins (showing ${sampleSize} of ${allPlugins.length}):`);
      allPlugins.slice(0, sampleSize).forEach((plugin, index) => {
        logInfo(`  ${index + 1}. ${plugin.name} (${plugin.marketplace})`);
      });
    }

    // Step 7.5: Aggregate plugin keywords into marketplaces
    logStep(7.5, "Aggregating plugin keywords for searchability...");
    const marketplacesWithKeywords = marketplacesWithStars.map(marketplace => {
      // Filter plugins for this marketplace
      const marketplacePlugins = allPlugins.filter(p => p.marketplace === marketplace.slug);
      // Aggregate keywords from all plugins
      const pluginKeywords = aggregatePluginKeywords(marketplacePlugins);

      return {
        ...marketplace,
        pluginKeywords,
      };
    });

    const avgKeywords = Math.round(
      marketplacesWithKeywords.reduce((sum, m) => sum + (m.pluginKeywords?.length || 0), 0) /
      marketplacesWithKeywords.length
    );
    logSuccess(`Aggregated keywords for ${marketplacesWithKeywords.length} marketplaces (avg: ${avgKeywords} keywords/marketplace)`);

    // Step 8: Save results
    if (args.dryRun) {
      logStep(8, "Skipping save (dry run mode)");
      logWarning("Results not saved due to --dry-run flag");
    } else {
      logStep(8, "Saving to database...");

      // Save marketplaces (with plugin keywords)
      const allDiscoveredRepos = new Set(resultsToProcess.map((r) => r.repo));
      const mergeResult = await mergeMarketplaces(marketplacesWithKeywords, allDiscoveredRepos);

      logSuccess(`Marketplaces - Added: ${mergeResult.added}, Updated: ${mergeResult.updated}`);
      if (mergeResult.removed > 0) {
        logWarning(`Marketplaces - Removed: ${mergeResult.removed} invalid entries`);
      }
      logSuccess(`Marketplaces - Total: ${mergeResult.total}`);

      // Save plugins
      await writePlugins(allPlugins);
      logSuccess(`Plugins - Saved: ${allPlugins.length} plugins`);
    }

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const apiCallsSaved = filteredOutCount;

    log("\n" + "━".repeat(60), colors.cyan);
    log("  Search Complete!", colors.bright);
    log("━".repeat(60), colors.cyan);
    log(`  ⏱️  Duration: ${duration}s`, colors.gray);
    log(`  📊 Success Rate: ${((validMarketplaces.length / validFiles.length) * 100).toFixed(1)}%`, colors.gray);
    log(`  🚀 API Calls Saved: ${apiCallsSaved} (quality filter before fetch)`, colors.gray);

    if (!args.dryRun) {
      log(`  💾 Marketplaces saved to lib/data/marketplaces.json`, colors.green);
      log(`  💾 Plugins saved to lib/data/plugins.json`, colors.green);
    }

    log("━".repeat(60) + "\n", colors.cyan);

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
