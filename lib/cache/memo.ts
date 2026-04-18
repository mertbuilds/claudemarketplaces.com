/**
 * Module-level promise memo with TTL.
 * Dedupes concurrent calls within a Node process (build run, lambda lifetime).
 * Serves many static-page renders from a single underlying fetch.
 *
 * Not cross-instance or cross-deploy — pair with ISR + revalidatePath for that.
 */
export function createMemo<T>(fetcher: () => Promise<T>, ttlMs: number) {
  let cached: Promise<T> | null = null;
  let cachedAt = 0;

  const invalidate = () => {
    cached = null;
    cachedAt = 0;
  };

  const get = async (): Promise<T> => {
    const now = Date.now();
    if (!cached || now - cachedAt > ttlMs) {
      cached = fetcher().catch((err) => {
        invalidate();
        throw err;
      });
      cachedAt = now;
    }
    return cached;
  };

  return { get, invalidate };
}
