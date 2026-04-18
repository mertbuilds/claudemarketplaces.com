import { Skill } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapSkillRow, SkillRow } from "@/lib/supabase/mappers";
import {
  classifyAllSkills,
  SKILL_CATEGORIES,
} from "@/lib/data/skill-categories";
import { createMemo } from "@/lib/cache/memo";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const skillsMemo = createMemo<Skill[]>(async () => {
  const supabase = await getDataClient();
  const allRows: SkillRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    // `summary` intentionally excluded from list selects — only rendered on detail pages,
    // which use getSkillById (select *). Keeping it out shrinks the memoized payload at 4k+ rows.
    const { data, error } = await supabase
      .from("skills")
      .select(
        "id, name, description, repo, repo_slug, path, license, stars, installs, install_command, discovered_at, last_updated, vote_count, comment_count, created_at"
      )
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

  const seen = new Set<string>();
  const unique: SkillRow[] = [];
  for (const row of allRows) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      unique.push(row);
    }
  }

  return unique.map(mapSkillRow);
}, SEVEN_DAYS);

export const getAllSkills = skillsMemo.get;
export const invalidateSkillsMemo = skillsMemo.invalidate;

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

export async function getSkillsByCategory(slug: string): Promise<Skill[]> {
  const all = await getAllSkills();
  const classified = classifyAllSkills(all);
  return classified[slug] ?? [];
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const all = await getAllSkills();
  const classified = classifyAllSkills(all);
  const counts: Record<string, number> = {};
  for (const cat of SKILL_CATEGORIES) {
    counts[cat.slug] = classified[cat.slug]?.length ?? 0;
  }
  return counts;
}
