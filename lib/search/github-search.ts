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

export interface GitHubSearchResult {
  repo: string;
  path: string;
  url: string;
}

/**
 * Search GitHub for .claude-plugin/marketplace.json files
 * Uses GitHub Code Search API with pagination to get all results
 */
export async function searchMarketplaceFiles(verbose: boolean = false): Promise<GitHubSearchResult[]> {
  try {
    const octokit = getOctokit(verbose);

    // Search for marketplace.json files in the .claude-plugin directory
    const query = "filename:marketplace.json path:.claude-plugin";
    const perPage = 100; // Max results per page
    const maxPages = 10; // GitHub API limit: max 1000 results (10 pages × 100)

    const allResults: GitHubSearchResult[] = [];
    let page = 1;
    let totalCount = 0;

    // Fetch all pages
    while (page <= maxPages) {
      const response = await octokit.rest.search.code({
        q: query,
        per_page: perPage,
        page: page,
      });

      // Store total count from first page
      if (page === 1) {
        totalCount = response.data.total_count;
        console.log(`GitHub reports ${totalCount} total marketplace files`);
      }

      // Convert and add results
      const pageResults: GitHubSearchResult[] = response.data.items.map(
        (item) => ({
          repo: item.repository.full_name,
          path: item.path,
          url: item.html_url,
        })
      );

      allResults.push(...pageResults);

      // Stop if we've fetched all available results
      if (response.data.items.length < perPage) {
        console.log(`Fetched all ${allResults.length} results (${page} pages)`);
        break;
      }

      // Stop if we've reached the total count
      if (allResults.length >= totalCount) {
        console.log(
          `Fetched all ${allResults.length} results (total: ${totalCount})`
        );
        break;
      }

      page++;
    }

    console.log(`Found ${allResults.length} marketplace files on GitHub`);

    return allResults;
  } catch (error) {
    if (error instanceof Error) {
      console.error("GitHub search failed:", error.message);

      // Handle rate limiting
      if ("status" in error && error.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Try again later.");
      }
    }
    throw error;
  }
}

/**
 * Fetch raw content of marketplace.json file from GitHub
 */
export async function fetchMarketplaceFile(
  repo: string,
  branch: string = "main",
  verbose: boolean = false
): Promise<string> {
  try {
    const octokit = getOctokit(verbose);
    const [owner, repoName] = repo.split("/");

    const response = await octokit.rest.repos.getContent({
      owner,
      repo: repoName,
      path: ".claude-plugin/marketplace.json",
      ref: branch,
    });

    // Handle the response which can be a file, directory, or symlink
    if ("content" in response.data && response.data.type === "file") {
      // Content is base64 encoded
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      );
      return content;
    }

    throw new Error("marketplace.json is not a file");
  } catch (error) {
    // Try 'master' branch if 'main' fails
    if (branch === "main") {
      try {
        return await fetchMarketplaceFile(repo, "master", verbose);
      } catch (masterError) {
        // Show warning for failed fetches (repo may be deleted, private, or file removed)
        if (verbose) {
          console.warn(`⚠️  Skipping ${repo}: marketplace.json not accessible`, masterError);
        }
        throw new Error(`Could not fetch marketplace.json from ${repo}`);
      }
    }
    throw error;
  }
}

/**
 * Check if a GitHub repository is publicly accessible
 */
export async function isRepoAccessible(repo: string, verbose: boolean = false): Promise<boolean> {
  try {
    const octokit = getOctokit(verbose);
    const [owner, repoName] = repo.split("/");

    await octokit.rest.repos.get({
      owner,
      repo: repoName,
    });

    return true;
  } catch (error) {
    if (verbose) {
      console.warn(`⚠️  Repo ${repo} is not accessible`, error);
    }
    return false;
  }
}

/**
 * Get repository description from GitHub
 */
export async function getRepoDescription(repo: string, verbose: boolean = false): Promise<string> {
  try {
    const octokit = getOctokit(verbose);
    const [owner, repoName] = repo.split("/");

    const response = await octokit.rest.repos.get({
      owner,
      repo: repoName,
    });

    return response.data.description || "";
  } catch (error) {
    if (verbose) {
      console.warn(`⚠️  Could not get description for ${repo}`, error);
    }
    return "";
  }
}
