import { ClaudeMarketplaceFileSchema } from "@/lib/schemas/marketplace.schema";
import { isRepoAccessible, getRepoDescription } from "./github-search";
import { Marketplace } from "@/lib/types";

export interface ValidationResult {
  valid: boolean;
  marketplace?: Marketplace;
  errors: string[];
}

/**
 * Validate a marketplace.json file and convert it to our Marketplace format
 */
export async function validateMarketplace(
  repo: string,
  jsonContent: string,
  verbose: boolean = false
): Promise<ValidationResult> {
  const errors: string[] = [];

  // Step 1: Parse JSON
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(jsonContent);
  } catch {
    errors.push("Invalid JSON format");
    return { valid: false, errors };
  }

  // Step 2: Validate against Claude marketplace schema
  const schemaValidation = ClaudeMarketplaceFileSchema.safeParse(parsedData);
  if (!schemaValidation.success) {
    errors.push(
      "Invalid marketplace.json schema: " +
        schemaValidation.error.issues.map((e) => e.message).join(", ")
    );
    return { valid: false, errors };
  }

  const marketplaceData = schemaValidation.data;

  // Step 3: Check if repository is accessible
  const accessible = await isRepoAccessible(repo, verbose);
  if (!accessible) {
    errors.push(`Repository ${repo} is not publicly accessible`);
    return { valid: false, errors };
  }

  // Step 4: Get repository description (check both metadata patterns)
  // Pattern A: root-level description
  // Pattern B: metadata.description
  let description =
    marketplaceData.description ||
    marketplaceData.metadata?.description ||
    "";
  if (!description) {
    description = await getRepoDescription(repo, verbose);
  }

  // Step 5: Extract categories from plugins
  const categoriesSet = new Set<string>();
  for (const plugin of marketplaceData.plugins) {
    if (plugin.category) {
      categoriesSet.add(plugin.category.toLowerCase());
    }
  }

  // Add default category if none found
  const categories = Array.from(categoriesSet);
  if (categories.length === 0) {
    categories.push("community");
  }

  // Step 6: Basic plugin health check - verify plugins have required fields
  for (const plugin of marketplaceData.plugins) {
    if (!plugin.name || !plugin.source) {
      errors.push(`Plugin ${plugin.name || "unknown"} missing required fields`);
    }
  }

  // If we have any errors at this point, validation fails
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Step 7: Create our Marketplace object
  const marketplace: Marketplace = {
    repo,
    description,
    pluginCount: marketplaceData.plugins.length,
    categories,
    discoveredAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    source: "auto",
  };

  return {
    valid: true,
    marketplace,
    errors: [],
  };
}

/**
 * Validate multiple marketplaces in parallel
 */
export async function validateMarketplaces(
  marketplaceFiles: Array<{ repo: string; content: string }>,
  verbose: boolean = false
): Promise<ValidationResult[]> {
  // Use Promise.allSettled to handle failures gracefully
  const results = await Promise.allSettled(
    marketplaceFiles.map(({ repo, content }) =>
      validateMarketplace(repo, content, verbose)
    )
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        valid: false,
        errors: [
          `Validation failed for ${marketplaceFiles[index].repo}: ${result.reason}`,
        ],
      };
    }
  });
}
