import { Octokit } from "@octokit/rest";

function getOctokit() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN environment variable is required");
  }

  return new Octokit({
    auth: GITHUB_TOKEN,
  });
}

/**
 * Fetch GitHub star count for a repository
 * @param repo - Repository in format "owner/name"
 * @returns Star count or null if failed
 */
export async function fetchRepoStars(repo: string): Promise<number | null> {
  try {
    const octokit = getOctokit();
    const [owner, repoName] = repo.split("/");

    const response = await octokit.rest.repos.get({
      owner,
      repo: repoName,
    });

    return response.data.stargazers_count;
  } catch (error) {
    console.error(`Could not fetch stars for ${repo}:`, error);
    return null;
  }
}

/**
 * Batch fetch stars for multiple repositories
 * @param repos - Array of repository names in format "owner/name"
 * @returns Map of repo -> star count (null if failed)
 */
export async function batchFetchStars(
  repos: string[]
): Promise<Map<string, number | null>> {
  const results = await Promise.allSettled(
    repos.map(async (repo) => ({
      repo,
      stars: await fetchRepoStars(repo),
    }))
  );

  const starMap = new Map<string, number | null>();

  for (const result of results) {
    if (result.status === "fulfilled") {
      starMap.set(result.value.repo, result.value.stars);
    } else {
      console.error("Failed to fetch stars for a repo:", result.reason);
    }
  }

  return starMap;
}
