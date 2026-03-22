import { NextResponse } from "next/server";
import { getAllMcpServers } from "@/lib/data/mcp-servers";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  try {
    const servers = await getAllMcpServers();
    return NextResponse.json(servers, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching MCP servers:", error);
    return NextResponse.json(
      { error: "Failed to fetch MCP servers", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
