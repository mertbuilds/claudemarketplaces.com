#!/usr/bin/env bun
/**
 * Crawl GitHub stars/descriptions for MCP server repos.
 * Filters to repos with >= 100 stars.
 *
 * Usage: bun run scripts/crawl-mcp.ts
 */

// Load .env.local
const envFile = Bun.file(`${import.meta.dir}/../.env.local`);
if (await envFile.exists()) {
  const text = await envFile.text();
  for (const line of text.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
if (!GITHUB_TOKEN) {
  console.error("Missing GITHUB_TOKEN in .env.local");
  process.exit(1);
}

const BATCH_SIZE = 40;
const DELAY_MS = 200;
const MIN_STARS = 100;

interface McpServer {
  source: string;
  type: string;
  slug: string;
  name: string;
  description: string;
  sourceRepo: string;
  user: string;
  collection: string;
  tags: string[];
  url: string;
  lastmod: string;
  displayName: string;
}

interface McpData {
  crawledAt: string;
  total: number;
  servers: McpServer[];
}

interface OutputServer {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  sourceRepo: string;
  source: string;
  user: string;
  collection: string;
  tags: string[];
  url: string;
  lastmod: string;
  stars: number;
}

// Read input
const inputPath = `${import.meta.dir}/../lib/data/mcp-only.json`;
const data: McpData = await Bun.file(inputPath).json();
console.log(`Loaded ${data.servers.length} servers from mcp-only.json`);

// Deduplicate by slug
const slugMap = new Map<string, McpServer>();
for (const server of data.servers) {
  if (!slugMap.has(server.slug)) {
    slugMap.set(server.slug, server);
  }
}
const uniqueServers = Array.from(slugMap.values());
console.log(`Unique repos after dedup: ${uniqueServers.length}`);

// Split into batches
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const batches = chunk(uniqueServers, BATCH_SIZE);
console.log(`Will query ${batches.length} batches of up to ${BATCH_SIZE} repos\n`);

// Query GitHub GraphQL
async function queryBatch(
  batch: McpServer[],
  batchIndex: number
): Promise<Map<string, { stars: number; description: string | null }>> {
  const results = new Map<string, { stars: number; description: string | null }>();

  const queryParts = batch.map((server, i) => {
    const [owner, name] = server.slug.split("/");
    // Escape quotes in owner/name just in case
    const safeOwner = owner.replace(/"/g, '\\"');
    const safeName = name.replace(/"/g, '\\"');
    return `r${i}: repository(owner: "${safeOwner}", name: "${safeName}") { stargazerCount description }`;
  });

  const query = `{ ${queryParts.join("\n")} }`;

  const resp = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!resp.ok) {
    console.error(`Batch ${batchIndex}: HTTP ${resp.status} ${resp.statusText}`);
    return results;
  }

  const json = await resp.json();

  if (json.errors && json.errors.length > 0) {
    // Count NOT_FOUND vs other errors
    const notFound = json.errors.filter(
      (e: any) => e.type === "NOT_FOUND"
    ).length;
    const other = json.errors.length - notFound;
    if (other > 0) {
      console.warn(
        `Batch ${batchIndex}: ${notFound} NOT_FOUND, ${other} other errors`
      );
    }
  }

  if (json.data) {
    for (let i = 0; i < batch.length; i++) {
      const key = `r${i}`;
      const repoData = json.data[key];
      if (repoData) {
        results.set(batch[i].slug, {
          stars: repoData.stargazerCount,
          description: repoData.description,
        });
      }
    }
  }

  return results;
}

// Process all batches
const allResults = new Map<string, { stars: number; description: string | null }>();
let processed = 0;

for (let i = 0; i < batches.length; i++) {
  const batch = batches[i];
  const results = await queryBatch(batch, i);

  for (const [slug, data] of results) {
    allResults.set(slug, data);
  }

  processed += batch.length;
  if (processed % 1000 < BATCH_SIZE) {
    console.log(`Processed ${processed}/${uniqueServers.length} repos...`);
  }

  // Rate limit delay
  if (i < batches.length - 1) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

console.log(`\nGitHub data fetched for ${allResults.size}/${uniqueServers.length} repos`);

// Merge and filter
const outputServers: OutputServer[] = [];

for (const server of uniqueServers) {
  const ghData = allResults.get(server.slug);
  if (!ghData) continue;
  if (ghData.stars < MIN_STARS) continue;

  outputServers.push({
    slug: server.slug,
    name: server.name,
    displayName: server.displayName,
    description: ghData.description || server.description,
    sourceRepo: server.sourceRepo,
    source: server.source,
    user: server.user,
    collection: server.collection,
    tags: server.tags,
    url: server.url,
    lastmod: server.lastmod,
    stars: ghData.stars,
  });
}

// Sort by stars descending
outputServers.sort((a, b) => b.stars - a.stars);

const output = {
  crawledAt: new Date().toISOString(),
  total: outputServers.length,
  servers: outputServers,
};

// Write output
const outputPath = `${import.meta.dir}/../lib/data/mcp-crawled.json`;
await Bun.write(outputPath, JSON.stringify(output, null, 2));

console.log(`\n--- Results ---`);
console.log(`Total repos found on GitHub: ${allResults.size}`);
console.log(`Repos with >= ${MIN_STARS} stars: ${outputServers.length}`);
console.log(`Output written to lib/data/mcp-crawled.json`);

console.log(`\nTop 10 by stars:`);
for (const s of outputServers.slice(0, 10)) {
  console.log(`  ${s.stars.toLocaleString().padStart(7)} ★  ${s.slug} — ${s.name}`);
}
