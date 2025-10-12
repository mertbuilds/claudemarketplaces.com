import { NextResponse } from "next/server";
import { readMarketplaces } from "@/lib/search/storage";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes

/**
 * GET /api/marketplaces
 * Returns all marketplaces from Vercel Blob or local file
 */
export async function GET() {
  try {
    const marketplaces = await readMarketplaces();

    return NextResponse.json(marketplaces, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
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
