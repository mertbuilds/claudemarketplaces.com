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
      error: () => {},
    },
  });
}

export interface GitHubSearchResult {
  repo: string;
  path: string;
  url: string;
}

/**
 * Search GitHub for SKILL.md files in skills directories
 * Uses two queries and dedupes results
 */
export async function searchSkillFiles(verbose: boolean = false): Promise<GitHubSearchResult[]> {
  try {
    const octokit = getOctokit(verbose);
    const queries = [
      "filename:SKILL.md path:skills",
      "filename:SKILL.md path:.claude/skills",
    ];
    const perPage = 100;
    const maxPages = 10;

    const allResults: GitHubSearchResult[] = [];

    for (const query of queries) {
      let page = 1;
      let totalCount = 0;

      while (page <= maxPages) {
        const response = await octokit.rest.search.code({
          q: query,
          per_page: perPage,
          page: page,
        });

        if (page === 1) {
          totalCount = response.data.total_count;
          if (verbose) {
            console.log(`Query "${query}": ${totalCount} total results`);
          }
        }

        const pageResults: GitHubSearchResult[] = response.data.items.map(
          (item) => ({
            repo: item.repository.full_name,
            path: item.path,
            url: item.html_url,
          })
        );

        allResults.push(...pageResults);

        if (response.data.items.length < perPage) {
          break;
        }

        if (allResults.length >= totalCount) {
          break;
        }

        page++;
      }
    }

    // Dedupe by repo+path
    const seen = new Set<string>();
    const dedupedResults = allResults.filter((result) => {
      const key = `${result.repo}:${result.path}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    console.log(`Found ${dedupedResults.length} SKILL.md files on GitHub (deduped from ${allResults.length})`);

    return dedupedResults;
  } catch (error) {
    if (error instanceof Error) {
      console.error("GitHub search failed:", error.message);

      if ("status" in error && error.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Try again later.");
      }
    }
    throw error;
  }
}

/**
 * Fetch raw content of SKILL.md file from GitHub
 * Tries main branch first, falls back to master
 */
export async function fetchSkillFile(
  repo: string,
  path: string,
  branch: string = "main",
  verbose: boolean = false
): Promise<string> {
  try {
    const octokit = getOctokit(verbose);
    const [owner, repoName] = repo.split("/");

    const response = await octokit.rest.repos.getContent({
      owner,
      repo: repoName,
      path,
      ref: branch,
    });

    if ("content" in response.data && response.data.type === "file") {
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      );
      return content;
    }

    throw new Error("SKILL.md is not a file");
  } catch (error) {
    // Try 'master' branch if 'main' fails
    if (branch === "main") {
      try {
        return await fetchSkillFile(repo, path, "master", verbose);
      } catch (masterError) {
        if (verbose) {
          console.warn(`Warning: Skipping ${repo}/${path}: SKILL.md not accessible`, masterError);
        }
        throw new Error(`Could not fetch SKILL.md from ${repo}/${path}`);
      }
    }
    throw error;
  }
}

/**
 * Parse YAML frontmatter from SKILL.md content
 * Returns parsed object or null if no valid frontmatter
 */
export function parseSkillFrontmatter(content: string): Record<string, unknown> | null {
  // Check if content starts with frontmatter delimiter
  if (!content.startsWith("---")) {
    return null;
  }

  // Find the closing delimiter
  const endIndex = content.indexOf("\n---", 3);
  if (endIndex === -1) {
    return null;
  }

  const frontmatterStr = content.slice(4, endIndex).trim();

  // Simple YAML parsing (key: value pairs)
  const result: Record<string, unknown> = {};
  const lines = frontmatterStr.split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();
    let value: unknown = rawValue;

    // Handle quoted strings
    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      value = rawValue.slice(1, -1);
    }
    // Handle booleans
    else if (rawValue === "true") {
      value = true;
    } else if (rawValue === "false") {
      value = false;
    }
    // Handle numbers
    else if (!isNaN(Number(rawValue)) && rawValue !== "") {
      value = Number(rawValue);
    }
    // Handle arrays (simple inline format: [item1, item2])
    else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      const arrayContent = rawValue.slice(1, -1);
      value = arrayContent.split(",").map((item) => item.trim().replace(/^["']|["']$/g, ""));
    }

    if (key) {
      result[key] = value;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}
