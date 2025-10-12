import { put, list } from "@vercel/blob";
import { Marketplace } from "@/lib/types";
import fs from "fs/promises";
import path from "path";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PATHNAME = "marketplaces.json";
const MARKETPLACES_FILE = path.join(
  process.cwd(),
  "lib/data/marketplaces.json"
);

/**
 * Read marketplaces from Vercel Blob (if available) or local file
 */
export async function readMarketplaces(): Promise<Marketplace[]> {
  try {
    // Try to read from Vercel Blob first (production)
    if (BLOB_TOKEN) {
      try {
        // Find the blob using list() - this always returns the correct URL
        const { blobs } = await list({
          prefix: BLOB_PATHNAME,
          token: BLOB_TOKEN,
          limit: 1,
        });

        if (blobs.length > 0) {
          const blobUrl = blobs[0].url;
          const response = await fetch(blobUrl);
          if (response.ok) {
            const data = await response.json();
            console.log(`Loaded marketplaces from Vercel Blob: ${blobUrl}`);
            return data;
          }
        }

        console.log("Blob not found, falling back to local file");
      } catch (error) {
        console.log("Vercel Blob error, falling back to local file:", error);
      }
    }

    // Fallback to local file
    const fileContent = await fs.readFile(MARKETPLACES_FILE, "utf-8");
    const data = JSON.parse(fileContent);
    console.log("Loaded marketplaces from local file");
    return data;
  } catch (error) {
    console.error("Error reading marketplaces:", error);
    return [];
  }
}

/**
 * Write marketplaces to Vercel Blob and local file
 */
export async function writeMarketplaces(
  marketplaces: Marketplace[]
): Promise<void> {
  const jsonData = JSON.stringify(marketplaces, null, 2);

  try {
    // Write to Vercel Blob (production)
    if (BLOB_TOKEN) {
      // Upload blob with overwrite enabled
      const blob = await put(BLOB_PATHNAME, jsonData, {
        access: "public",
        token: BLOB_TOKEN,
        contentType: "application/json",
        addRandomSuffix: false, // Keep the same filename
        allowOverwrite: true, // Allow overwriting existing blob
      });
      console.log(`Saved marketplaces to Vercel Blob: ${blob.url}`);
    } else {
      // Only write to local file in development (no BLOB_TOKEN)
      // This avoids EROFS errors on Vercel's read-only filesystem
      await fs.writeFile(MARKETPLACES_FILE, jsonData, "utf-8");
      console.log("Saved marketplaces to local file (development mode)");
    }
  } catch (error) {
    console.error("Error writing marketplaces:", error);
    throw error;
  }
}

/**
 * Merge discovered marketplaces with existing ones
 * Removes marketplaces that were discovered but failed validation
 */
export async function mergeMarketplaces(
  discovered: Marketplace[],
  allDiscoveredRepos: Set<string>
): Promise<{
  added: number;
  updated: number;
  removed: number;
  total: number;
}> {
  const existing = await readMarketplaces();
  const existingMap = new Map(existing.map((m) => [m.repo, m]));

  let added = 0;
  let updated = 0;
  let removed = 0;

  // Update or add valid marketplaces
  for (const marketplace of discovered) {
    const existingMarketplace = existingMap.get(marketplace.repo);

    if (existingMarketplace) {
      // Update existing marketplace
      existingMarketplace.description = marketplace.description;
      existingMarketplace.pluginCount = marketplace.pluginCount;
      existingMarketplace.categories = marketplace.categories;
      existingMarketplace.lastUpdated = new Date().toISOString();
      // Update stars if new data is available
      if (marketplace.stars !== undefined) {
        existingMarketplace.stars = marketplace.stars;
        existingMarketplace.starsFetchedAt = marketplace.starsFetchedAt;
      }
      // Keep original discoveredAt and source
      updated++;
    } else {
      // Add new marketplace
      existingMap.set(marketplace.repo, marketplace);
      added++;
    }
  }

  // Remove marketplaces that were discovered but are now invalid
  for (const [repo] of existingMap) {
    if (allDiscoveredRepos.has(repo) && !discovered.find((m) => m.repo === repo)) {
      existingMap.delete(repo);
      removed++;
    }
  }

  const merged = Array.from(existingMap.values());
  await writeMarketplaces(merged);

  return {
    added,
    updated,
    removed,
    total: merged.length,
  };
}
