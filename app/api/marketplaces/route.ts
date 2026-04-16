import { NextResponse } from "next/server";
import { getAllMarketplaces } from "@/lib/data/marketplaces";

export const revalidate = 86400; // Revalidate every 24 hours

/**
 * GET /api/marketplaces
 * Returns all marketplaces from Supabase
 */
export async function GET() {
  try {
    const marketplaces = await getAllMarketplaces();

    return NextResponse.json(marketplaces, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (error) {
    console.error("Error fetching marketplaces:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch marketplaces",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
