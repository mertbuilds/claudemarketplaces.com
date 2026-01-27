import { z } from "zod";

// Schema for SKILL.md frontmatter validation
export const SkillFrontmatterSchema = z.object({
  // Required fields
  name: z.string().min(1),
  description: z.string().min(1),

  // Optional fields
  license: z.string().optional(),
});

// Schema for internal skill repo representation
export const SkillRepoSchema = z.object({
  repo: z.string().regex(/^[\w-]+\/[\w-]+$/, "Must be in format: owner/repo"),
  description: z.string(),
  skillCount: z.number().int().min(0),
  discoveredAt: z.iso.datetime().optional(),
  lastUpdated: z.iso.datetime().optional(),
  source: z.enum(["manual", "auto"]).optional(),
});

export type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>;
export type SkillRepoData = z.infer<typeof SkillRepoSchema>;
