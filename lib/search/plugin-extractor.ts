import { Plugin, Marketplace } from "@/lib/types";
import { PluginSchema } from "@/lib/schemas/marketplace.schema";
import { repoToSlug } from "@/lib/utils/slug";

/**
 * Extract and transform plugins from a marketplace.json file.
 *
 * Validates each plugin individually rather than the whole marketplace atomically,
 * so a single malformed plugin entry (e.g. one using an unknown `source` discriminator)
 * doesn't cause the entire marketplace to be dropped. Bad plugins are skipped with a
 * warning; good plugins are returned.
 */
export function extractPluginsFromMarketplace(
  marketplace: Marketplace,
  jsonContent: string
): Plugin[] {
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(jsonContent);
  } catch (error) {
    console.error(`Invalid JSON in marketplace ${marketplace.repo}:`, error);
    return [];
  }

  if (
    !parsedData ||
    typeof parsedData !== "object" ||
    !Array.isArray((parsedData as { plugins?: unknown }).plugins)
  ) {
    console.error(`Marketplace ${marketplace.repo} has no plugins array`);
    return [];
  }

  const rawPlugins = (parsedData as { plugins: unknown[] }).plugins;
  const marketplaceUrl = `https://github.com/${marketplace.repo}`;
  const marketplaceSlug = repoToSlug(marketplace.repo);

  const validPlugins: Plugin[] = [];
  const seenIds = new Set<string>();
  let skipped = 0;
  let duplicates = 0;

  rawPlugins.forEach((raw, index) => {
    const parsed = PluginSchema.safeParse(raw);
    if (!parsed.success) {
      skipped++;
      const rawName =
        raw && typeof raw === "object" && "name" in raw
          ? String((raw as { name?: unknown }).name)
          : "?";
      const firstIssue = parsed.error.issues[0];
      const issueMsg = firstIssue
        ? `${firstIssue.path.join(".") || "(root)"}: ${firstIssue.message}`
        : "unknown error";
      console.warn(
        `  Skipping plugin[${index}] "${rawName}" in ${marketplace.repo}: ${issueMsg}`
      );
      return;
    }

    const plugin = parsed.data;
    const pluginId = `${marketplaceSlug}/${normalizePluginName(plugin.name)}`;

    // Deduplicate within a marketplace — two plugin entries can normalize to the
    // same id (e.g. both named "repo-retrofitter"), and Postgres upsert rejects
    // a batch where the same conflict key appears twice ("ON CONFLICT DO UPDATE
    // command cannot affect row a second time"). Keep the first, skip the rest.
    if (seenIds.has(pluginId)) {
      duplicates++;
      console.warn(
        `  Skipping duplicate plugin[${index}] "${plugin.name}" in ${marketplace.repo} (id collision: ${pluginId})`
      );
      return;
    }
    seenIds.add(pluginId);

    // Extract source path, falling back through path → url → repo for object sources
    const sourcePath =
      typeof plugin.source === "string"
        ? plugin.source
        : plugin.source.path || plugin.source.url || plugin.source.repo || "";

    const installCommand = `/plugin install ${plugin.name}@${marketplaceSlug}`;

    const normalizeToArray = (
      value: string | string[] | undefined
    ): string[] | undefined => {
      if (!value) return undefined;
      return Array.isArray(value) ? value : [value];
    };

    validPlugins.push({
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
      voteCount: 0,
    });
  });

  if (skipped > 0 || duplicates > 0) {
    const parts: string[] = [];
    if (skipped > 0) parts.push(`${skipped} invalid`);
    if (duplicates > 0) parts.push(`${duplicates} duplicate`);
    console.warn(
      `  ${marketplace.repo}: skipped ${parts.join(" + ")} out of ${rawPlugins.length} plugin entries`
    );
  }

  return validPlugins;
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
