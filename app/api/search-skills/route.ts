import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { searchSkillFiles, fetchSkillFile } from "@/lib/search/github-skills-search";
import { validateSkills } from "@/lib/search/skills-validator";
import { mergeSkills, mergeSkillRepos } from "@/lib/search/skills-storage";
import { batchFetchStars } from "@/lib/search/github-stars";
import { repoToSlug } from "@/lib/utils/slug";
import { SkillRepo } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max execution time

/**
 * Search GitHub for Claude Code skills
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
    console.log("Starting skills search...");

    // Step 1: Search GitHub for SKILL.md files
    const searchResults = await searchSkillFiles();
    console.log(`Found ${searchResults.length} potential skills`);

    if (searchResults.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new skills found",
        discovered: 0,
        added: 0,
        updated: 0,
        removed: 0,
        duration: Date.now() - startTime,
      });
    }

    // Get unique repos
    const uniqueRepos = [...new Set(searchResults.map((r) => r.repo))];

    // Step 2: Fetch GitHub stars
    console.log("Fetching GitHub stars...");
    const starMap = await batchFetchStars(uniqueRepos);
    console.log(`Fetched stars for ${Array.from(starMap.values()).filter((s) => s !== null).length} repos`);

    // Step 3: Apply quality filter (5+ stars)
    const qualityRepos = uniqueRepos.filter((repo) => {
      const stars = starMap.get(repo) ?? 0;
      return stars >= 5;
    });
    console.log(`Quality filter: ${qualityRepos.length}/${uniqueRepos.length} repos (>=5 stars)`);

    if (qualityRepos.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No repos passed the quality filter",
        discovered: searchResults.length,
        filtered: uniqueRepos.length - qualityRepos.length,
        added: 0,
        updated: 0,
        removed: 0,
        duration: Date.now() - startTime,
      });
    }

    // Filter results to quality repos only
    const qualityResults = searchResults.filter((r) => qualityRepos.includes(r.repo));

    // Step 4: Fetch SKILL.md files
    console.log("Fetching SKILL.md files...");
    const fetchedFiles = await Promise.allSettled(
      qualityResults.map(async (result) => ({
        repo: result.repo,
        path: result.path,
        content: await fetchSkillFile(result.repo, result.path, "main"),
      }))
    );

    const validFiles = fetchedFiles
      .filter(
        (result): result is PromiseFulfilledResult<{ repo: string; path: string; content: string }> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    console.log(`Fetched ${validFiles.length}/${qualityResults.length} files`);

    // Step 5: Validate SKILL.md frontmatter
    console.log("Validating SKILL.md frontmatter...");
    const filesWithStars = validFiles.map((f) => ({
      ...f,
      stars: starMap.get(f.repo) ?? undefined,
    }));
    const validationResults = validateSkills(filesWithStars);

    const validSkills = validationResults
      .filter((result) => result.valid && result.skill)
      .map((result) => result.skill!);

    const failedValidations = validationResults.filter((result) => !result.valid);

    console.log(`Validated ${validSkills.length} skills, ${failedValidations.length} failed`);

    if (validSkills.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No valid skills found",
        discovered: searchResults.length,
        fetched: validFiles.length,
        validated: 0,
        failed: failedValidations.length,
        duration: Date.now() - startTime,
      });
    }

    // Step 6: Aggregate into skill repos
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

    console.log(`Aggregated ${validSkills.length} skills into ${skillRepos.length} repos`);

    // Step 7: Save skills
    const allDiscoveredIds = new Set(validSkills.map((s) => s.id));
    const skillsMergeResult = await mergeSkills(validSkills, allDiscoveredIds);
    console.log(`Skills: ${skillsMergeResult.added} added, ${skillsMergeResult.updated} updated`);

    // Step 8: Save skill repos
    const allDiscoveredRepos = new Set(skillRepos.map((r) => r.repo));
    const reposMergeResult = await mergeSkillRepos(skillRepos, allDiscoveredRepos);
    console.log(`Skill repos: ${reposMergeResult.added} added, ${reposMergeResult.updated} updated`);

    // Revalidate the skills page
    try {
      revalidatePath("/skills", "page");
      console.log("Successfully revalidated skills page");
    } catch (error) {
      console.error("Failed to revalidate skills page:", error);
    }

    // Return summary
    return NextResponse.json({
      success: true,
      discovered: searchResults.length,
      repos: uniqueRepos.length,
      qualityRepos: qualityRepos.length,
      fetched: validFiles.length,
      validated: validSkills.length,
      skills: {
        added: skillsMergeResult.added,
        updated: skillsMergeResult.updated,
        removed: skillsMergeResult.removed,
        total: skillsMergeResult.total,
      },
      skillRepos: {
        added: reposMergeResult.added,
        updated: reposMergeResult.updated,
        removed: reposMergeResult.removed,
        total: reposMergeResult.total,
      },
      failed: failedValidations.length,
      errors: failedValidations.slice(0, 10).map((f) => ({
        errors: f.errors,
      })),
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Skills search failed:", error);

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
 */
export async function POST(request: NextRequest) {
  return GET(request);
}
