import { put, list } from "@vercel/blob";
import { Skill, SkillRepo } from "@/lib/types";
import fs from "fs/promises";
import path from "path";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const SKILLS_BLOB_PATHNAME = "skills.json";
const SKILL_REPOS_BLOB_PATHNAME = "skill-repos.json";
const SKILLS_FILE = path.join(process.cwd(), "lib/data/skills.json");
const SKILL_REPOS_FILE = path.join(process.cwd(), "lib/data/skill-repos.json");

/**
 * Read skills from Vercel Blob (if available) or local file
 */
export async function readSkills(): Promise<Skill[]> {
  try {
    if (BLOB_TOKEN) {
      try {
        const { blobs } = await list({
          prefix: SKILLS_BLOB_PATHNAME,
          token: BLOB_TOKEN,
          limit: 1,
        });

        if (blobs.length > 0) {
          const blobUrl = blobs[0].url;
          const response = await fetch(blobUrl);
          if (response.ok) {
            const data = await response.json();
            console.log(`Loaded skills from Vercel Blob: ${blobUrl}`);
            return data;
          }
        }

        console.log("Skills blob not found, falling back to local file");
      } catch (error) {
        console.log("Vercel Blob error, falling back to local file:", error);
      }
    }

    const fileContent = await fs.readFile(SKILLS_FILE, "utf-8");
    const data = JSON.parse(fileContent);
    console.log("Loaded skills from local file");
    return data;
  } catch (error) {
    console.error("Error reading skills:", error);
    return [];
  }
}

/**
 * Write skills to Vercel Blob and local file
 */
export async function writeSkills(skills: Skill[]): Promise<void> {
  const jsonData = JSON.stringify(skills, null, 2);

  try {
    if (BLOB_TOKEN) {
      const blob = await put(SKILLS_BLOB_PATHNAME, jsonData, {
        access: "public",
        token: BLOB_TOKEN,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      console.log(`Saved skills to Vercel Blob: ${blob.url}`);
    } else {
      await fs.writeFile(SKILLS_FILE, jsonData, "utf-8");
      console.log("Saved skills to local file (development mode)");
    }
  } catch (error) {
    console.error("Error writing skills:", error);
    throw error;
  }
}

/**
 * Read skill repos from Vercel Blob (if available) or local file
 */
export async function readSkillRepos(): Promise<SkillRepo[]> {
  try {
    if (BLOB_TOKEN) {
      try {
        const { blobs } = await list({
          prefix: SKILL_REPOS_BLOB_PATHNAME,
          token: BLOB_TOKEN,
          limit: 1,
        });

        if (blobs.length > 0) {
          const blobUrl = blobs[0].url;
          const response = await fetch(blobUrl);
          if (response.ok) {
            const data = await response.json();
            console.log(`Loaded skill repos from Vercel Blob: ${blobUrl}`);
            return data;
          }
        }

        console.log("Skill repos blob not found, falling back to local file");
      } catch (error) {
        console.log("Vercel Blob error, falling back to local file:", error);
      }
    }

    const fileContent = await fs.readFile(SKILL_REPOS_FILE, "utf-8");
    const data = JSON.parse(fileContent);
    console.log("Loaded skill repos from local file");
    return data;
  } catch (error) {
    console.error("Error reading skill repos:", error);
    return [];
  }
}

/**
 * Write skill repos to Vercel Blob and local file
 */
export async function writeSkillRepos(repos: SkillRepo[]): Promise<void> {
  const jsonData = JSON.stringify(repos, null, 2);

  try {
    if (BLOB_TOKEN) {
      const blob = await put(SKILL_REPOS_BLOB_PATHNAME, jsonData, {
        access: "public",
        token: BLOB_TOKEN,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      console.log(`Saved skill repos to Vercel Blob: ${blob.url}`);
    } else {
      await fs.writeFile(SKILL_REPOS_FILE, jsonData, "utf-8");
      console.log("Saved skill repos to local file (development mode)");
    }
  } catch (error) {
    console.error("Error writing skill repos:", error);
    throw error;
  }
}

/**
 * Merge discovered skills with existing ones
 * Removes skills that were discovered but failed validation
 */
export async function mergeSkills(
  discovered: Skill[],
  allDiscoveredIds: Set<string>
): Promise<{
  added: number;
  updated: number;
  removed: number;
  total: number;
}> {
  const existing = await readSkills();
  const existingMap = new Map(existing.map((s) => [s.id, s]));

  let added = 0;
  let updated = 0;
  let removed = 0;

  for (const skill of discovered) {
    const existingSkill = existingMap.get(skill.id);

    if (existingSkill) {
      existingSkill.name = skill.name;
      existingSkill.description = skill.description;
      existingSkill.path = skill.path;
      existingSkill.license = skill.license;
      existingSkill.installCommand = skill.installCommand;
      existingSkill.lastUpdated = new Date().toISOString();
      if (skill.stars !== undefined) {
        existingSkill.stars = skill.stars;
      }
      updated++;
    } else {
      existingMap.set(skill.id, skill);
      added++;
    }
  }

  for (const [id] of existingMap) {
    if (allDiscoveredIds.has(id) && !discovered.find((s) => s.id === id)) {
      existingMap.delete(id);
      removed++;
    }
  }

  const merged = Array.from(existingMap.values());
  await writeSkills(merged);

  return {
    added,
    updated,
    removed,
    total: merged.length,
  };
}

/**
 * Merge discovered skill repos with existing ones
 * Removes repos that were discovered but failed validation
 */
export async function mergeSkillRepos(
  discovered: SkillRepo[],
  allDiscoveredRepos: Set<string>
): Promise<{
  added: number;
  updated: number;
  removed: number;
  total: number;
}> {
  const existing = await readSkillRepos();
  const existingMap = new Map(existing.map((r) => [r.repo, r]));

  let added = 0;
  let updated = 0;
  let removed = 0;

  for (const repo of discovered) {
    const existingRepo = existingMap.get(repo.repo);

    if (existingRepo) {
      existingRepo.description = repo.description;
      existingRepo.skillCount = repo.skillCount;
      existingRepo.lastUpdated = new Date().toISOString();
      if (repo.stars !== undefined) {
        existingRepo.stars = repo.stars;
        existingRepo.starsFetchedAt = repo.starsFetchedAt;
      }
      updated++;
    } else {
      existingMap.set(repo.repo, repo);
      added++;
    }
  }

  for (const [repo] of existingMap) {
    if (allDiscoveredRepos.has(repo) && !discovered.find((r) => r.repo === repo)) {
      existingMap.delete(repo);
      removed++;
    }
  }

  const merged = Array.from(existingMap.values());
  await writeSkillRepos(merged);

  return {
    added,
    updated,
    removed,
    total: merged.length,
  };
}
