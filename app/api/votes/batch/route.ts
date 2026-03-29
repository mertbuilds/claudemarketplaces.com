import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_TYPES = ["marketplace", "plugin", "skill", "mcp_server"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemType = searchParams.get("itemType");
  const itemIds = searchParams.get("itemIds");

  if (!itemType || !itemIds) {
    return NextResponse.json({ error: "Missing itemType or itemIds" }, { status: 400 });
  }

  if (!VALID_TYPES.includes(itemType)) {
    return NextResponse.json({ error: "Invalid itemType" }, { status: 400 });
  }

  const ids = itemIds.split(",").filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json({ votes: {} });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ votes: {} });
  }

  const { data } = await supabase
    .from("votes")
    .select("item_id, value")
    .eq("user_id", user.id)
    .eq("item_type", itemType)
    .in("item_id", ids);

  const votes: Record<string, number> = {};
  if (data) {
    for (const row of data) {
      votes[row.item_id] = row.value;
    }
  }

  return NextResponse.json({ votes });
}
