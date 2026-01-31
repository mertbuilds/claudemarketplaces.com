/**
 * Execute promises with concurrency limit and optional delay between batches
 */
export async function batchExecute<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  options: { concurrency?: number; delayMs?: number } = {}
): Promise<PromiseSettledResult<R>[]> {
  const { concurrency = 5, delayMs = 0 } = options;
  const results: PromiseSettledResult<R>[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);

    // Add delay between batches (not after the last one)
    if (delayMs > 0 && i + concurrency < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Sleep helper
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an error is a GitHub rate limit error (403 or 429)
 */
function isRateLimitError(error: unknown): boolean {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status: number }).status;
    return status === 403 || status === 429;
  }
  return false;
}

/**
 * Extract retry-after delay from GitHub error response headers (seconds)
 */
function getRetryAfter(error: unknown): number | null {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { headers?: Record<string, string> } }).response;
    const retryAfter = response?.headers?.["retry-after"];
    if (retryAfter) {
      const seconds = parseInt(retryAfter, 10);
      if (!isNaN(seconds)) return seconds;
    }
  }
  return null;
}

/**
 * Retry a function with exponential backoff on rate limit errors
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number; maxDelayMs?: number; label?: string } = {}
): Promise<T> {
  const { maxRetries = 2, baseDelayMs = 10000, maxDelayMs = 30000, label = "request" } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!isRateLimitError(error) || attempt === maxRetries) {
        throw error;
      }

      const retryAfterSec = getRetryAfter(error);
      const delayMs = retryAfterSec
        ? Math.min(retryAfterSec * 1000, maxDelayMs)
        : Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);

      console.log(
        `Rate limited on ${label}, retrying in ${Math.round(delayMs / 1000)}s (attempt ${attempt + 1}/${maxRetries})...`
      );
      await sleep(delayMs);
    }
  }

  throw new Error("Unreachable");
}
