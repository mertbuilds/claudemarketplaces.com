import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const TABLE_MAP: Record<string, string> = {
  skill: "skills",
  marketplace: "marketplaces",
  mcp_server: "mcp_servers",
};

function getPkColumn(itemType: string): string {
  if (itemType === "marketplace") return "repo";
  if (itemType === "mcp_server") return "slug";
  return "id";
}

interface CommentRow {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  body: string;
  created_at: string;
  profiles: { username: string; avatar_url: string | null } | null;
}

// GET: fetch comments for an item
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemType = searchParams.get("itemType");
  const itemId = searchParams.get("itemId");

  if (!itemType || !itemId || !TABLE_MAP[itemType]) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: comments } = await supabase
    .from("comments")
    .select("id, user_id, item_type, item_id, body, created_at, profiles(username, avatar_url)")
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });

  const table = TABLE_MAP[itemType];
  const pk = getPkColumn(itemType);
  const { data: entity } = await supabase
    .from(table)
    .select("comment_count")
    .eq(pk, itemId)
    .single();

  return NextResponse.json({
    comments: ((comments || []) as unknown as CommentRow[]).map((c) => ({
      id: c.id,
      userId: c.user_id,
      itemType: c.item_type,
      itemId: c.item_id,
      body: c.body,
      createdAt: c.created_at,
      user: {
        username: c.profiles?.username || "unknown",
        avatarUrl: c.profiles?.avatar_url || null,
      },
    })),
    commentCount: entity?.comment_count ?? 0,
  });
}

// POST: create a comment
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemType, itemId, body } = await request.json();

  if (!itemType || !itemId || !TABLE_MAP[itemType]) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const trimmed = (body || "").trim();
  if (!trimmed || trimmed.length > 1000) {
    return NextResponse.json({ error: "Comment must be 1-1000 characters" }, { status: 400 });
  }

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({ user_id: user.id, item_type: itemType, item_id: itemId, body: trimmed })
    .select("id, user_id, item_type, item_id, body, created_at, profiles(username, avatar_url)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const c = comment as unknown as CommentRow;

  const table = TABLE_MAP[itemType];
  const pk = getPkColumn(itemType);
  const { data: entity } = await supabase
    .from(table)
    .select("comment_count")
    .eq(pk, itemId)
    .single();

  return NextResponse.json({
    comment: {
      id: c.id,
      userId: c.user_id,
      itemType: c.item_type,
      itemId: c.item_id,
      body: c.body,
      createdAt: c.created_at,
      user: {
        username: c.profiles?.username || "unknown",
        avatarUrl: c.profiles?.avatar_url || null,
      },
    },
    commentCount: entity?.comment_count ?? 0,
  });
}

// DELETE: remove own comment
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");

  if (!commentId) {
    return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch comment info before deleting (for getting item_type/item_id for count query)
  const { data: comment } = await supabase
    .from("comments")
    .select("item_type, item_id")
    .eq("id", commentId)
    .eq("user_id", user.id)
    .single();

  if (!comment) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const table = TABLE_MAP[comment.item_type];
  const pk = getPkColumn(comment.item_type);
  const { data: entity } = await supabase
    .from(table)
    .select("comment_count")
    .eq(pk, comment.item_id)
    .single();

  return NextResponse.json({ success: true, commentCount: entity?.comment_count ?? 0 });
}
