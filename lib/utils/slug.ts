/**
 * Slug utilities for marketplace routing
 */

/**
 * Convert GitHub repo path to URL-safe slug
 * Example: "anthropics/claude-code" → "anthropics-claude-code"
 */
export function repoToSlug(repo: string): string {
  return repo.replace(/\//g, '-').toLowerCase();
}

/**
 * Convert URL-safe slug back to GitHub repo path
 * Example: "anthropics-claude-code" → "anthropics/claude-code"
 * Note: Only replaces the first hyphen to handle repos with hyphens in names
 */
export function slugToRepo(slug: string): string {
  return slug.replace('-', '/');
}
