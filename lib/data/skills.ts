import { Skill, SkillRepo } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import {
  mapSkillRow,
  mapSkillRepoRow,
  SkillRow,
  SkillRepoRow,
} from "@/lib/supabase/mappers";

/**
 * Fetch all skills from Supabase
 * Optionally filter out empty/placeholder skills
 */
export async function getAllSkills(options?: {
  includeEmpty?: boolean;
}): Promise<Skill[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase.from("skills").select("*").order("installs", { ascending: false });
  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
  let skills = (data as SkillRow[]).map(mapSkillRow);
  if (!options?.includeEmpty) {
    skills = skills.filter((s) => s.name && s.description);
  }
  return skills;
}

/**
 * Get a single skill by id
 */
export async function getSkillById(id: string): Promise<Skill | null> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapSkillRow(data as SkillRow);
}

/**
 * Get all skills from a specific repo
 */
export async function getSkillsByRepo(repo: string): Promise<Skill[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("repo", repo)
    .order("stars", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Error fetching skills by repo:", error);
    return [];
  }
  return (data as SkillRow[]).map(mapSkillRow);
}

/**
 * Fetch all skill repos from Supabase
 * Optionally filter out repos with 0 skills
 */
export async function getAllSkillRepos(options?: {
  includeEmpty?: boolean;
}): Promise<SkillRepo[]> {
  const { includeEmpty = true } = options || {};
  const supabase = await getDataClient();

  let query = supabase.from("skill_repos").select("*");
  if (!includeEmpty) {
    query = query.gt("skill_count", 0);
  }

  const { data, error } = await query.order("stars", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("Error fetching skill repos:", error);
    return [];
  }

  return (data as SkillRepoRow[]).map(mapSkillRepoRow);
}

/**
 * Get a single skill repo by slug
 */
export async function getSkillRepoBySlug(
  slug: string
): Promise<SkillRepo | null> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("skill_repos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapSkillRepoRow(data as SkillRepoRow);
}
