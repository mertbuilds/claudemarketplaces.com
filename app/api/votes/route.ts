import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TABLE_MAP: Record<string, string> = {
  marketplace: "marketplaces",
  plugin: "plugins",
  skill: "skills",
  mcp_server: "mcp_servers",
};

const VALID_TYPES = Object.keys(TABLE_MAP);

function getPkColumn(itemType: string): string {
  if (itemType === "marketplace") return "repo";
  if (itemType === "mcp_server") return "slug";
  return "id";
}

// GET: Get vote count and user's vote for an item
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemType = searchParams.get("itemType");
  const itemId = searchParams.get("itemId");

  if (!itemType || !itemId) {
    return NextResponse.json(
      { error: "Missing itemType or itemId" },
      { status: 400 }
    );
  }

  const table = TABLE_MAP[itemType];
  if (!table) {
    return NextResponse.json({ error: "Invalid itemType" }, { status: 400 });
  }

  const supabase = await createClient();

  // Get current user (may be null for anonymous)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's vote if authenticated
  let userVote = null;
  if (user) {
    const { data } = await supabase
      .from("votes")
      .select("value")
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .single();
    userVote = data?.value ?? null;
  }

  // Get vote count from entity table
  const pkColumn = getPkColumn(itemType);
  const { data: entity } = await supabase
    .from(table)
    .select("vote_count")
    .eq(pkColumn, itemId)
    .single();

  return NextResponse.json({
    voteCount: entity?.vote_count ?? 0,
    userVote,
  });
}

// POST: Cast/change/remove vote
// Body: { itemType, itemId, value } where value is 1, -1, or 0 (remove)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { itemType, itemId, value } = body;

  if (!itemType || !itemId || value === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!VALID_TYPES.includes(itemType)) {
    return NextResponse.json({ error: "Invalid itemType" }, { status: 400 });
  }

  if (value === 0) {
    // Delete vote
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (value === 1 || value === -1) {
    // Upsert vote
    const { error } = await supabase.from("votes").upsert(
      {
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,item_type,item_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { error: "Invalid value (must be -1, 0, or 1)" },
      { status: 400 }
    );
  }

  // Return updated vote count
  const table = TABLE_MAP[itemType]!;
  const pkColumn = getPkColumn(itemType);

  const { data: entity } = await supabase
    .from(table)
    .select("vote_count")
    .eq(pkColumn, itemId)
    .single();

  return NextResponse.json({
    voteCount: entity?.vote_count ?? 0,
    userVote: value === 0 ? null : value,
  });
}
