#!/usr/bin/env bun
/**
 * Submit URLs to IndexNow (Bing/Yandex/Seznam).
 *
 * Pulls URLs from the live sitemap by default, optionally filters, then POSTs
 * in 10k-URL batches to https://api.indexnow.org/IndexNow.
 *
 * Usage:
 *   bun run scripts/indexnow-submit.ts                       # Submit all sitemap URLs
 *   bun run scripts/indexnow-submit.ts --filter /skills/     # Only URLs containing /skills/
 *   bun run scripts/indexnow-submit.ts --limit 100           # Cap submitted URL count
 *   bun run scripts/indexnow-submit.ts --dry-run             # Print what would be sent
 *   bun run scripts/indexnow-submit.ts --sitemap <url>       # Override sitemap URL
 */

const INDEXNOW_KEY = "8eb3f748244ce9970ad6ade3e34c3f53";
const HOST = "claudemarketplaces.com";
const BASE_URL = `https://${HOST}`;
const DEFAULT_SITEMAP = `${BASE_URL}/sitemap.xml`;
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;
const BATCH_SIZE = 10_000; // IndexNow max per request

interface CliArgs {
  filter?: string;
  limit?: number;
  dryRun: boolean;
  sitemap: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = { dryRun: false, sitemap: DEFAULT_SITEMAP };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--filter" && i + 1 < args.length) {
      result.filter = args[++i];
    } else if (arg === "--limit" && i + 1 < args.length) {
      result.limit = parseInt(args[++i], 10);
    } else if (arg === "--sitemap" && i + 1 < args.length) {
      result.sitemap = args[++i];
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: bun run scripts/indexnow-submit.ts [options]

Options:
  --filter <substr>   Only submit URLs containing this substring (e.g. /skills/)
  --limit <n>         Cap total URLs submitted
  --sitemap <url>     Sitemap URL to read (default: ${DEFAULT_SITEMAP})
  --dry-run           Print what would be submitted, don't POST
  --help, -h          Show this help
`);
      process.exit(0);
    }
  }
  return result;
}

async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(`Sitemap fetch failed: HTTP ${res.status} from ${sitemapUrl}`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return urls;
}

async function submitBatch(urls: string[]): Promise<void> {
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`IndexNow HTTP ${res.status}: ${body || "(empty body)"}`);
  }
}

async function main() {
  const args = parseArgs();
  const start = Date.now();

  console.log(`[1] Fetching sitemap: ${args.sitemap}`);
  let urls = await fetchSitemapUrls(args.sitemap);
  console.log(`    Found ${urls.length} URLs`);

  if (args.filter) {
    const before = urls.length;
    urls = urls.filter((u) => u.includes(args.filter!));
    console.log(`[2] Filtered by "${args.filter}": ${urls.length}/${before} URLs`);
  }

  if (args.limit && urls.length > args.limit) {
    urls = urls.slice(0, args.limit);
    console.log(`    Limited to first ${urls.length} URLs`);
  }

  if (urls.length === 0) {
    console.log("No URLs to submit. Exiting.");
    return;
  }

  const batches: string[][] = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }

  console.log(`[3] Submitting ${urls.length} URLs in ${batches.length} batch(es)`);

  if (args.dryRun) {
    console.log("    DRY RUN — not posting. Sample URLs:");
    urls.slice(0, 5).forEach((u) => console.log(`      ${u}`));
    if (urls.length > 5) console.log(`      ... and ${urls.length - 5} more`);
    return;
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    process.stdout.write(`    Batch ${i + 1}/${batches.length} (${batch.length} URLs)... `);
    await submitBatch(batch);
    console.log("OK");
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\nDone. Submitted ${urls.length} URLs in ${elapsed}s.`);
  console.log("Bing/Yandex/Seznam process asynchronously; Google does not consume IndexNow.");
}

main().catch((err) => {
  console.error(`\nError: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
