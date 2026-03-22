import { Skill } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapSkillRow, SkillRow } from "@/lib/supabase/mappers";

export async function getAllSkills(): Promise<Skill[]> {
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

  return allRows.map(mapSkillRow);
}

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
