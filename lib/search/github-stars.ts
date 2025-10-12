import { Octokit } from "@octokit/rest";

function getOctokit(verbose: boolean = false) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN environment variable is required");
  }

  return new Octokit({
    auth: GITHUB_TOKEN,
    log: verbose ? undefined : {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {}, // Suppress Octokit's internal error logging when not verbose
    },
  });
}

/**
 * Fetch GitHub star count for a repository
 * @param repo - Repository in format "owner/name"
 * @returns Star count or null if failed
 */
export async function fetchRepoStars(repo: string, verbose: boolean = false): Promise<number | null> {
  try {
    const octokit = getOctokit(verbose);
    const [owner, repoName] = repo.split("/");

    const response = await octokit.rest.repos.get({
      owner,
      repo: repoName,
    });

    return response.data.stargazers_count;
  } catch (error) {
    if (verbose) {
      console.warn(`⚠️  Could not fetch stars for ${repo}`, error);
    }
    return null;
  }
}

/**
 * Batch fetch stars for multiple repositories
 * @param repos - Array of repository names in format "owner/name"
 * @returns Map of repo -> star count (null if failed)
 */
export async function batchFetchStars(
  repos: string[],
  verbose: boolean = false
): Promise<Map<string, number | null>> {
  const results = await Promise.allSettled(
    repos.map(async (repo) => ({
      repo,
      stars: await fetchRepoStars(repo, verbose),
    }))
  );

  const starMap = new Map<string, number | null>();

  for (const result of results) {
    if (result.status === "fulfilled") {
      starMap.set(result.value.repo, result.value.stars);
    } else {
      if (verbose) {
        console.warn("⚠️  Failed to fetch stars for a repo", result.reason);
      }
    }
  }

  return starMap;
}
