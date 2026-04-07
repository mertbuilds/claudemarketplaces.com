import { z } from "zod";

// Author schema for plugins and marketplace owners
const AuthorSchema = z.object({
  name: z.string(),
  email: z.email().optional(),
  url: z.url().optional(), // Official docs include url field
});

// Source schema - can be a string path or an object with a source discriminator.
// The `source` discriminator is intentionally a free-form string rather than an enum:
// real-world marketplaces use values beyond the docs' github/git/local set,
// including "url" and "git-subdir". Keeping this open lets us accept future
// discriminators without shipping a schema update. Extra fields are tolerated.
const SourceSchema = z.union([
  z.string().min(1), // Simple path string
  z.object({
    source: z.string().min(1),
    repo: z.string().optional(),
    path: z.string().optional(),
    url: z.string().optional(),
    ref: z.string().optional(),
    sha: z.string().optional(),
  }).loose(),
]);

// Schema for a plugin within a marketplace
export const PluginSchema = z.object({
  // Required fields
  name: z.string().min(1),
  source: SourceSchema,

  // Standard metadata fields
  description: z.string().optional(),
  version: z.string().optional(),
  author: AuthorSchema.optional(),
  homepage: z.url().optional(),
  repository: z.url().optional(),
  license: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),

  // Advanced configuration fields
  strict: z.boolean().optional(), // Default true, requires plugin.json
  commands: z.union([z.string(), z.array(z.string())]).optional(),
  agents: z.union([z.string(), z.array(z.string())]).optional(),
  hooks: z
    .union([z.string(), z.array(z.string()), z.record(z.string(), z.any())])
    .optional(),
  mcpServers: z
    .union([z.string(), z.array(z.string()), z.record(z.string(), z.any())])
    .optional(),

  // Non-standard field (kept for backward compatibility)
  id: z.string().optional(), // Not in official docs, but used by some implementations
});

// Metadata object schema (used in nested pattern)
const MetadataSchema = z.object({
  description: z.string().optional(),
  version: z.string().optional(),
  pluginRoot: z.string().optional(),
});

// Owner schema for marketplace
const OwnerSchema = z.object({
  name: z.string(),
  email: z.email().optional(),
  url: z.url().optional(),
});

// Schema for the marketplace.json file structure from Claude Code docs
// Supports both root-level metadata fields (Pattern A) and nested metadata object (Pattern B)
export const ClaudeMarketplaceFileSchema = z.object({
  // Required fields
  name: z.string().min(1),
  owner: OwnerSchema,
  plugins: z.array(PluginSchema).min(1), // At least one plugin required

  // Optional schema reference for IDE support
  $schema: z.url().optional(),

  // Pattern A: Root-level metadata fields (used by Anthropic official repo)
  description: z.string().optional(),
  version: z.string().optional(),
  pluginRoot: z.string().optional(),

  // Pattern B: Nested metadata object (used by some community repos)
  metadata: MetadataSchema.optional(),
}).loose(); // Allow additional fields for extensibility

// Schema for our internal marketplace representation
export const MarketplaceSchema = z.object({
  repo: z.string().regex(/^[\w-]+\/[\w-]+$/, "Must be in format: owner/repo"),
  description: z.string(),
  pluginCount: z.number().int().min(0),
  categories: z.array(z.string()),
  discoveredAt: z.iso.datetime().optional(),
  lastUpdated: z.iso.datetime().optional(),
  source: z.enum(["manual", "auto"]).optional(),
});

export type ClaudeMarketplaceFile = z.infer<typeof ClaudeMarketplaceFileSchema>;
export type MarketplaceData = z.infer<typeof MarketplaceSchema>;
