import { NextResponse } from "next/server";
import { readSkills } from "@/lib/search/skills-storage";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes

/**
 * GET /api/skills
 * Returns all skills from Vercel Blob or local file
 */
export async function GET() {
  try {
    const skills = await readSkills();

    return NextResponse.json(skills, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch skills",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
