import { SkillFrontmatterSchema } from "@/lib/schemas/skill.schema";
import { parseSkillFrontmatter } from "./github-skills-search";
import { Skill } from "@/lib/types";

export interface SkillValidationResult {
  valid: boolean;
  skill?: Skill;
  errors: string[];
}

/**
 * Extract skill name from path (directory name containing SKILL.md)
 * e.g., "skills/pdf/SKILL.md" -> "pdf"
 * e.g., ".claude/skills/commit/SKILL.md" -> "commit"
 */
function extractSkillName(path: string): string {
  const parts = path.split("/");
  // Remove SKILL.md and get the directory name
  return parts[parts.length - 2] || "unknown";
}

/**
 * Create a Skill object from parsed frontmatter
 */
export function extractSkillFromFrontmatter(
  repo: string,
  path: string,
  frontmatter: Record<string, unknown>,
  stars?: number
): Skill {
  const repoSlug = repo.replace("/", "-");
  const skillName = extractSkillName(path);
  const skillPath = path.replace("/SKILL.md", "");

  return {
    id: `${repoSlug}/${skillName}`,
    name: frontmatter.name as string,
    description: frontmatter.description as string,
    repo,
    repoSlug,
    path: skillPath,
    license: frontmatter.license as string | undefined,
    stars,
    installCommand: `claude skill add ${repo}:${skillName}`,
    discoveredAt: new Date().toISOString(),
  };
}

/**
 * Validate a single SKILL.md file and convert to Skill format
 */
export function validateSkill(
  repo: string,
  path: string,
  content: string,
  stars?: number
): SkillValidationResult {
  const errors: string[] = [];

  // Step 1: Parse frontmatter
  const frontmatter = parseSkillFrontmatter(content);
  if (!frontmatter) {
    errors.push("No valid YAML frontmatter found");
    return { valid: false, errors };
  }

  // Step 2: Validate against schema
  const schemaValidation = SkillFrontmatterSchema.safeParse(frontmatter);
  if (!schemaValidation.success) {
    errors.push(
      "Invalid SKILL.md frontmatter: " +
        schemaValidation.error.issues.map((e) => e.message).join(", ")
    );
    return { valid: false, errors };
  }

  // Step 3: Create Skill object
  const skill = extractSkillFromFrontmatter(repo, path, frontmatter, stars);

  return {
    valid: true,
    skill,
    errors: [],
  };
}

/**
 * Validate multiple SKILL.md files
 */
export function validateSkills(
  skillFiles: Array<{ repo: string; path: string; content: string; stars?: number }>
): SkillValidationResult[] {
  return skillFiles.map(({ repo, path, content, stars }) =>
    validateSkill(repo, path, content, stars)
  );
}
