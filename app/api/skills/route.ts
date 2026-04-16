import { NextResponse } from "next/server";
import { getAllSkills } from "@/lib/data/skills";

export const revalidate = 86400; // Revalidate every 24 hours

/**
 * GET /api/skills
 * Returns all skills from Supabase
 */
export async function GET() {
  try {
    const skills = await getAllSkills();

    return NextResponse.json(skills, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
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
