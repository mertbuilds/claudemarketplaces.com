#!/usr/bin/env bun
/**
 * Crawl skills.sh sitemap and extract skill metadata (installs, stars, etc.)
 *
 * Usage: bun run scripts/crawl-skills.ts
 *        bun run scripts/crawl-skills.ts --limit 50   # test with first 50 URLs
 */

// Load .env.local (same pattern as seed.ts)
const envFile = Bun.file(`${import.meta.dir}/../.env.local`);
if (await envFile.exists()) {
  const text = await envFile.text();
  for (const line of text.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

// CLI args
const args = process.argv.slice(2);
let limit: number | undefined;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--limit" && args[i + 1]) {
    limit = parseInt(args[i + 1], 10);
    i++;
  }
}

const CONCURRENCY = 10;
const DELAY_MS = 100;
const MIN_INSTALLS = 500;
const SITEMAP_URL = "https://skills.sh/sitemap.xml";
const OUTPUT_PATH = `${import.meta.dir}/../lib/data/skills-crawled.json`;

interface CrawledSkill {
  slug: string;
  name: string;
  sourceRepo: string;
  installs: number;
  stars: number;
  source: "skills.sh";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse formatted numbers like "235.6K", "1.2M", "5", "823" into integers */
function parseFormattedNumber(s: string): number {
  s = s.trim().replace(/,/g, "");
  const mMatch = s.match(/^([\d.]+)\s*M$/i);
  if (mMatch) return Math.round(parseFloat(mMatch[1]) * 1_000_000);
  const kMatch = s.match(/^([\d.]+)\s*K$/i);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1_000);
  const num = parseFloat(s);
  return isNaN(num) ? 0 : Math.round(num);
}

/** Small delay helper */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Step 1: Fetch & parse sitemap
// ---------------------------------------------------------------------------

async function fetchSitemap(): Promise<string[]> {
  console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();

  const urls: string[] = [];
  const locRegex = /<loc>(https:\/\/skills\.sh\/[^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = locRegex.exec(xml)) !== null) {
    urls.push(m[1]);
  }
  console.log(`  Found ${urls.length} URLs in sitemap`);
  return urls;
}

/** Extract slug parts from a skills.sh URL: {org}/{repo}/{skill} */
function parseSkillUrl(url: string): { slug: string; name: string; sourceRepo: string } | null {
  const path = url.replace("https://skills.sh/", "");
  const parts = path.split("/");
  // Expected: org/repo/skill-name (3 parts)
  if (parts.length !== 3) return null;
  return {
    slug: path,
    name: parts[2],
    sourceRepo: `${parts[0]}/${parts[1]}`,
  };
}

// ---------------------------------------------------------------------------
// Step 2: Fetch a skill page and extract installs + stars from HTML
// ---------------------------------------------------------------------------

/**
 * Extract install count and stars from the rendered HTML of a skills.sh page.
 *
 * Actual HTML patterns (server-rendered, not RSC payload):
 *   Weekly Installs</span></div><div class="text-3xl ...">235.6K</div>
 *   ds-amber-700">...</svg><span>23.5K</span>
 */
function extractMetrics(html: string): { installs: number; stars: number } {
  let installs = 0;
  let stars = 0;

  // Installs: "Weekly Installs" label followed by text-3xl div with the value
  // Pattern: Weekly Installs</span></div><div class="text-3xl font-semibold font-mono ...">VALUE</div>
  const installMatch = html.match(
    /Weekly\s*Installs[\s\S]{0,300}?text-3xl[^>]*>([\d,.]+[KkMm]?)<\/div>/
  );
  if (installMatch) {
    installs = parseFormattedNumber(installMatch[1]);
  }

  // Stars: after ds-amber star SVG, value is in <span>VALUE</span>
  // Pattern: ds-amber-700">...</svg><span>23.5K</span>
  const starsMatch = html.match(
    /ds-amber[\s\S]{0,1000}?<\/svg>\s*<span>([\d,.]+[KkMm]?)<\/span>/
  );
  if (starsMatch) {
    stars = parseFormattedNumber(starsMatch[1]);
  }

  return { installs, stars };
}

async function fetchSkillPage(
  url: string,
  retries = 2
): Promise<{ installs: number; stars: number } | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "claude-plugins-crawler/1.0",
          Accept: "text/html",
        },
      });
      if (res.status === 404) return null;
      if (!res.ok) {
        if (attempt < retries) {
          await sleep(1000 * (attempt + 1));
          continue;
        }
        return null;
      }
      const html = await res.text();
      return extractMetrics(html);
    } catch {
      if (attempt < retries) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      return null;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Step 3: Concurrent pool with rate limiting
// ---------------------------------------------------------------------------

async function crawlWithPool(
  urls: string[],
  concurrency: number,
  delayMs: number
): Promise<Map<string, { installs: number; stars: number }>> {
  const results = new Map<string, { installs: number; stars: number }>();
  let idx = 0;
  let completed = 0;
  let failed = 0;
  const total = urls.length;
  const failedUrls: string[] = [];

  async function worker() {
    while (true) {
      const i = idx++;
      if (i >= total) break;

      const url = urls[i];
      const metrics = await fetchSkillPage(url);

      if (metrics) {
        results.set(url, metrics);
      } else {
        failed++;
        failedUrls.push(url);
      }

      completed++;
      if (completed % 100 === 0 || completed === total) {
        console.log(`  Progress: ${completed}/${total} (${failed} failed)`);
      }

      // Rate limit: small delay between requests per worker
      if (i + concurrency < total) {
        await sleep(delayMs);
      }
    }
  }

  // Launch worker pool
  const workers: Promise<void>[] = [];
  for (let w = 0; w < concurrency; w++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  if (failedUrls.length > 0) {
    console.log(`\n  Failed URLs (${failedUrls.length}):`);
    for (const u of failedUrls.slice(0, 10)) {
      console.log(`    - ${u}`);
    }
    if (failedUrls.length > 10) {
      console.log(`    ... and ${failedUrls.length - 10} more`);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const t0 = Date.now();
  console.log("=== Crawl skills.sh ===\n");

  // 1. Fetch sitemap
  const allUrls = await fetchSitemap();

  // Parse into skill slugs (filter out non-skill URLs, e.g. 2-part paths)
  const parsed = allUrls
    .map((url) => ({ url, ...parseSkillUrl(url)! }))
    .filter((p) => p.slug);

  console.log(`  ${parsed.length} valid skill URLs (3-segment paths)\n`);

  const urlsToProcess = limit ? parsed.slice(0, limit) : parsed;
  if (limit) {
    console.log(`  --limit ${limit}: processing ${urlsToProcess.length} URLs\n`);
  }

  // 2. Crawl pages
  console.log(`Crawling ${urlsToProcess.length} skill pages (concurrency=${CONCURRENCY})...`);
  const metrics = await crawlWithPool(
    urlsToProcess.map((p) => p.url),
    CONCURRENCY,
    DELAY_MS
  );

  // 3. Assemble results, filter by min installs
  const skills: CrawledSkill[] = [];
  let belowThreshold = 0;

  for (const entry of urlsToProcess) {
    const m = metrics.get(entry.url);
    if (!m) continue;

    if (m.installs < MIN_INSTALLS) {
      belowThreshold++;
      continue;
    }

    skills.push({
      slug: entry.slug,
      name: entry.name,
      sourceRepo: entry.sourceRepo,
      installs: m.installs,
      stars: m.stars,
      source: "skills.sh",
    });
  }

  // Sort by installs descending
  skills.sort((a, b) => b.installs - a.installs);

  console.log(`\nResults:`);
  console.log(`  Total crawled: ${metrics.size}`);
  console.log(`  Below ${MIN_INSTALLS} installs: ${belowThreshold}`);
  console.log(`  Skills with >= ${MIN_INSTALLS} installs: ${skills.length}`);

  // 4. Write output
  const output = {
    crawledAt: new Date().toISOString(),
    total: skills.length,
    skills,
  };

  await Bun.write(OUTPUT_PATH, JSON.stringify(output, null, 2));

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nWrote ${skills.length} skills to lib/data/skills-crawled.json`);
  console.log(`Done in ${elapsed}s`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
