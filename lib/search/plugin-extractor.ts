import { Plugin, Marketplace } from "@/lib/types";
import { ClaudeMarketplaceFileSchema } from "@/lib/schemas/marketplace.schema";
import { repoToSlug } from "@/lib/utils/slug";

/**
 * Extract and transform plugins from a marketplace.json file
 */
export function extractPluginsFromMarketplace(
  marketplace: Marketplace,
  jsonContent: string
): Plugin[] {
  try {
    // Parse and validate the marketplace file
    const parsedData = JSON.parse(jsonContent);
    const validation = ClaudeMarketplaceFileSchema.safeParse(parsedData);

    if (!validation.success) {
      console.error(`Failed to parse marketplace ${marketplace.repo}:`, validation.error);
      return [];
    }

    const marketplaceData = validation.data;
    const marketplaceUrl = `https://github.com/${marketplace.repo}`;
    const marketplaceSlug = repoToSlug(marketplace.repo);

    // Transform each plugin to our Plugin interface
    return marketplaceData.plugins.map((plugin) => {
      // Generate unique plugin ID
      const pluginId = `${marketplaceSlug}/${normalizePluginName(plugin.name)}`;

      // Extract source path
      const sourcePath = typeof plugin.source === "string"
        ? plugin.source
        : plugin.source.path || "";

      // Build install command: /plugin install <plugin-name>@<marketplace-slug>
      const installCommand = `/plugin install ${plugin.name}@${marketplaceSlug}`;

      // Normalize arrays (handle string, array, or undefined)
      const normalizeToArray = (value: string | string[] | undefined): string[] | undefined => {
        if (!value) return undefined;
        return Array.isArray(value) ? value : [value];
      };

      // Create Plugin object
      const transformedPlugin: Plugin = {
        id: pluginId,
        name: plugin.name,
        description: plugin.description || "",
        version: plugin.version,
        author: plugin.author,
        homepage: plugin.homepage,
        repository: plugin.repository,
        source: sourcePath,
        marketplace: marketplaceSlug,
        marketplaceUrl,
        category: plugin.category || "community",
        license: plugin.license,
        keywords: plugin.keywords,
        commands: normalizeToArray(plugin.commands as string | string[] | undefined),
        agents: normalizeToArray(plugin.agents as string | string[] | undefined),
        hooks: normalizeToArray(plugin.hooks as string | string[] | undefined),
        mcpServers: normalizeToArray(plugin.mcpServers as string | string[] | undefined),
        installCommand,
      };

      return transformedPlugin;
    });
  } catch (error) {
    console.error(`Error extracting plugins from ${marketplace.repo}:`, error);
    return [];
  }
}

/**
 * Normalize plugin name for use in ID
 */
function normalizePluginName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Extract plugins from multiple marketplaces
 */
export function extractPluginsFromMarketplaces(
  marketplaces: Marketplace[],
  marketplaceFiles: Array<{ repo: string; content: string }>
): Plugin[] {
  const allPlugins: Plugin[] = [];

  for (const marketplace of marketplaces) {
    // Find corresponding marketplace file content
    const fileContent = marketplaceFiles.find((f) => f.repo === marketplace.repo)?.content;

    if (!fileContent) {
      console.warn(`No file content found for marketplace ${marketplace.repo}`);
      continue;
    }

    // Extract plugins from this marketplace
    const plugins = extractPluginsFromMarketplace(marketplace, fileContent);
    allPlugins.push(...plugins);
  }

  return allPlugins;
}

/**
 * Aggregate plugin keywords from a marketplace's plugins for searchability
 * Extracts keywords from plugin names, descriptions, and keywords arrays
 * Returns deduplicated, lowercase keywords
 */
export function aggregatePluginKeywords(plugins: Plugin[]): string[] {
  const keywords = new Set<string>();

  plugins.forEach(plugin => {
    // Extract words from plugin name (split on hyphens, underscores, spaces)
    plugin.name.split(/[-_\s]+/).forEach(word => {
      const normalized = word.toLowerCase().trim();
      if (normalized.length > 2) {  // Filter out very short words
        keywords.add(normalized);
      }
    });

    // Extract significant words from plugin description (5+ chars)
    plugin.description.split(/\s+/).forEach(word => {
      const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      if (normalized.length > 4) {  // Only longer, more meaningful words
        keywords.add(normalized);
      }
    });

    // Add plugin keywords directly (already meaningful)
    plugin.keywords?.forEach(kw => {
      const normalized = kw.toLowerCase().trim();
      if (normalized.length > 0) {
        keywords.add(normalized);
      }
    });
  });

  return Array.from(keywords).sort();
}
