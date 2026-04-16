import { cache } from "react";
import { Skill } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapSkillRow, SkillRow } from "@/lib/supabase/mappers";
import {
  classifyAllSkills,
  SKILL_CATEGORIES,
} from "@/lib/data/skill-categories";

export const getAllSkills = cache(async (): Promise<Skill[]> => {
  const supabase = await getDataClient();
  const allRows: SkillRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("installs", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Error fetching skills:", error);
      return [];
    }

    allRows.push(...(data as SkillRow[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }

  // Deduplicate by ID (same skill can appear from multiple discovery runs)
  const seen = new Set<string>();
  const unique: SkillRow[] = [];
  for (const row of allRows) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      unique.push(row);
    }
  }

  return unique.map(mapSkillRow);
});

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

export async function getTopSkills(limit: number = 2): Promise<Skill[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("installs", { ascending: false })
    .order("stars", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching top skills:", error);
    return [];
  }
  return (data as SkillRow[]).map(mapSkillRow);
}

export async function getLatestSkills(limit: number = 2): Promise<Skill[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest skills:", error);
    return [];
  }
  return (data as SkillRow[]).map(mapSkillRow);
}

export async function getSkillsByRepo(repo: string): Promise<Skill[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("repo", repo)
    .order("installs", { ascending: false });

  if (error) {
    console.error("Error fetching skills by repo:", error);
    return [];
  }
  return (data as SkillRow[]).map(mapSkillRow);
}

/**
 * Returns skills classified into the given category slug.
 * Classification is keyword-based against name + description + repo.
 */
export async function getSkillsByCategory(
  slug: string
): Promise<Skill[]> {
  const all = await getAllSkills();
  const classified = classifyAllSkills(all);
  return classified[slug] ?? [];
}

/**
 * Returns category counts: { slug: number } for all defined categories.
 * Used for the category navigation section.
 */
export async function getCategoryCounts(): Promise<
  Record<string, number>
> {
  const all = await getAllSkills();
  const classified = classifyAllSkills(all);
  const counts: Record<string, number> = {};
  for (const cat of SKILL_CATEGORIES) {
    counts[cat.slug] = classified[cat.slug]?.length ?? 0;
  }
  return counts;
}
