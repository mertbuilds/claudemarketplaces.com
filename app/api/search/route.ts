import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  searchMarketplaceFiles,
  fetchMarketplaceFile,
} from "@/lib/search/github-search";
import { validateMarketplaces } from "@/lib/search/validator";
import { mergeMarketplaces, upsertPlugins } from "@/lib/search/supabase-storage";
import { batchFetchStars } from "@/lib/search/github-stars";
import {
  extractPluginsFromMarketplaces,
  aggregatePluginKeywords,
} from "@/lib/search/plugin-extractor";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max execution time

/**
 * Search GitHub for Claude Code marketplaces
 * Protected by CRON_SECRET for Vercel Cron
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  // Verify Vercel Cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting marketplace search...");

    // Step 1: Search GitHub for marketplace files
    const searchResults = await searchMarketplaceFiles();
    console.log(`Found ${searchResults.length} potential marketplaces`);

    if (searchResults.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new marketplaces found",
        discovered: 0,
        added: 0,
        updated: 0,
        removed: 0,
        duration: Date.now() - startTime,
      });
    }

    // Step 2: Fetch marketplace.json files
    const fetchedFiles = await Promise.allSettled(
      searchResults.map(async (result) => ({
        repo: result.repo,
        content: await fetchMarketplaceFile(result.repo),
      }))
    );

    const validFiles = fetchedFiles
      .filter(
        (result): result is PromiseFulfilledResult<{ repo: string; content: string }> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    console.log(`Successfully fetched ${validFiles.length} marketplace files`);

    // Step 3: Validate marketplace files
    const validationResults = await validateMarketplaces(validFiles);

    const validMarketplaces = validationResults
      .filter((result) => result.valid && result.marketplace)
      .map((result) => result.marketplace!);

    const failedValidations = validationResults.filter((result) => !result.valid);

    console.log(`Validated ${validMarketplaces.length} marketplaces`);
    console.log(`Failed validations: ${failedValidations.length}`);

    if (failedValidations.length > 0) {
      console.error("Validation errors:", failedValidations);
    }

    // Step 4: Fetch GitHub stars for all marketplaces
    console.log("Fetching GitHub stars...");
    const repos = validMarketplaces.map((m) => m.repo);
    const starMap = await batchFetchStars(repos);

    // Add stars to marketplaces
    const marketplacesWithStars = validMarketplaces.map((marketplace) => ({
      ...marketplace,
      stars: starMap.get(marketplace.repo) ?? marketplace.stars,
      starsFetchedAt: starMap.get(marketplace.repo) !== null
        ? new Date().toISOString()
        : marketplace.starsFetchedAt,
    }));

    console.log(`Fetched stars for ${Array.from(starMap.values()).filter(s => s !== null).length} repos`);

    // Step 5: Extract plugins from marketplaces
    const allPlugins = extractPluginsFromMarketplaces(marketplacesWithStars, validFiles);
    console.log(`Extracted ${allPlugins.length} plugins from ${marketplacesWithStars.length} marketplaces`);

    // Step 5.5: Aggregate plugin keywords for searchability
    const marketplacesWithKeywords = marketplacesWithStars.map((marketplace) => {
      const marketplacePlugins = allPlugins.filter((p) => p.marketplace === marketplace.slug);
      const pluginKeywords = aggregatePluginKeywords(marketplacePlugins);
      return { ...marketplace, pluginKeywords };
    });
    console.log(`Aggregated keywords for ${marketplacesWithKeywords.length} marketplaces`);

    // Step 6: Merge with existing marketplaces
    const allDiscoveredRepos = new Set(searchResults.map((r) => r.repo));
    const mergeResult = await mergeMarketplaces(marketplacesWithKeywords, allDiscoveredRepos);

    console.log(
      `Search complete: ${mergeResult.added} added, ${mergeResult.updated} updated, ${mergeResult.removed} removed`
    );

    // Step 7: Write plugins to storage
    await upsertPlugins(allPlugins);
    console.log(`Saved ${allPlugins.length} plugins to storage`);

    // Step 8: Revalidate the home page to show updated content immediately
    try {
      revalidatePath('/', 'page');
      console.log("Successfully revalidated home page");
    } catch (error) {
      console.error("Failed to revalidate home page:", error);
      // Don't fail the entire search if revalidation fails
    }

    // Return summary
    return NextResponse.json({
      success: true,
      discovered: searchResults.length,
      fetched: validFiles.length,
      validated: validMarketplaces.length,
      added: mergeResult.added,
      updated: mergeResult.updated,
      removed: mergeResult.removed,
      total: mergeResult.total,
      plugins: allPlugins.length,
      failed: failedValidations.length,
      errors: failedValidations.slice(0, 10).map((f) => ({
        errors: f.errors,
      })),
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Search failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger endpoint (POST method)
 * Can be used to trigger search manually without cron
 */
export async function POST(request: NextRequest) {
  // Use the same logic as GET
  return GET(request);
}
