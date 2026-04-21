/**
 * Validate a `next` query param for post-auth / post-flow redirects.
 * Returns a same-origin path or `/` if the input is unsafe.
 *
 * Guards against open-redirect attacks by rejecting anything that isn't a
 * single-slash-prefixed path, including protocol-relative URLs (//evil.com),
 * backslash-prefixed Windows-style URLs (/\evil.com), and embedded schemes.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return "/";
  if (typeof next !== "string") return "/";
  if (!next.startsWith("/")) return "/";
  if (next.startsWith("//")) return "/";
  if (next.startsWith("/\\")) return "/";
  if (next.includes("\\")) return "/";
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(next)) return "/";
  return next;
}
