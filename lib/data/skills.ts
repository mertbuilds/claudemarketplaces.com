import { Skill, SkillRepo } from "@/lib/types";
import { readSkills, readSkillRepos } from "@/lib/search/skills-storage";
import { repoToSlug } from "@/lib/utils/slug";

/**
 * Fetch all skills with slugs computed
 * Optionally filter out skills from empty repos
 */
export async function getAllSkills(options?: {
  includeEmpty?: boolean;
}): Promise<Skill[]> {
  const { includeEmpty = true } = options || {};

  try {
    const skills = await readSkills();

    // Add repoSlug to each skill
    const withSlugs = skills.map((s) => ({
      ...s,
      repoSlug: repoToSlug(s.repo),
    }));

    if (!includeEmpty) {
      // Filter out skills that might be placeholders
      return withSlugs.filter((s) => s.name && s.description);
    }

    return withSlugs;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

/**
 * Get a single skill by id
 */
export async function getSkillById(id: string): Promise<Skill | null> {
  const skills = await getAllSkills();
  return skills.find((s) => s.id === id) || null;
}

/**
 * Get all skills from a specific repo
 */
export async function getSkillsByRepo(repo: string): Promise<Skill[]> {
  const skills = await getAllSkills();
  return skills.filter((s) => s.repo === repo);
}

/**
 * Fetch all skill repos with slugs computed
 * Optionally filter out repos with 0 skills
 */
export async function getAllSkillRepos(options?: {
  includeEmpty?: boolean;
}): Promise<SkillRepo[]> {
  const { includeEmpty = true } = options || {};

  try {
    const skillRepos = await readSkillRepos();

    // Add slug to each skill repo
    const withSlugs = skillRepos.map((r) => ({
      ...r,
      slug: repoToSlug(r.repo),
    }));

    // Filter empty repos if requested
    if (!includeEmpty) {
      return withSlugs.filter((r) => r.skillCount > 0);
    }

    return withSlugs;
  } catch (error) {
    console.error("Error fetching skill repos:", error);
    return [];
  }
}

/**
 * Get a single skill repo by slug
 */
export async function getSkillRepoBySlug(
  slug: string
): Promise<SkillRepo | null> {
  const skillRepos = await getAllSkillRepos();
  return skillRepos.find((r) => r.slug === slug) || null;
}
