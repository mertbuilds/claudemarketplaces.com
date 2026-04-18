import { McpServer } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapMcpServerRow, McpServerRow } from "@/lib/supabase/mappers";
import {
  classifyAllMcpServers,
  MCP_CATEGORIES,
} from "@/lib/data/mcp-categories";
import { createMemo } from "@/lib/cache/memo";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const mcpServersMemo = createMemo<McpServer[]>(async () => {
  const supabase = await getDataClient();
  const allRows: McpServerRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("mcp_servers")
      .select(
        "slug, name, display_name, description, source_repo, source, user_name, collection, tags, url, stars, last_updated, vote_count, comment_count, created_at"
      )
      .order("stars", { ascending: false, nullsFirst: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Error fetching MCP servers:", error);
      return [];
    }

    allRows.push(...(data as McpServerRow[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return allRows.map(mapMcpServerRow);
}, SEVEN_DAYS);

export const invalidateMcpServersMemo = mcpServersMemo.invalidate;

export async function getAllMcpServers(_options?: {
  includeEmpty?: boolean;
}): Promise<McpServer[]> {
  return mcpServersMemo.get();
}

export async function getTopMcpServers(limit: number = 2): Promise<McpServer[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("mcp_servers")
    .select("*")
    .order("stars", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching top MCP servers:", error);
    return [];
  }
  return (data as McpServerRow[]).map(mapMcpServerRow);
}

export async function getLatestMcpServers(limit: number = 2): Promise<McpServer[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("mcp_servers")
    .select("*")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest MCP servers:", error);
    return [];
  }
  return (data as McpServerRow[]).map(mapMcpServerRow);
}

export async function getMcpServerBySlug(slug: string): Promise<McpServer | null> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("mcp_servers")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return mapMcpServerRow(data as McpServerRow);
}

export async function getMcpServersByCategory(slug: string): Promise<McpServer[]> {
  const all = await getAllMcpServers();
  const classified = classifyAllMcpServers(all);
  return classified[slug] ?? [];
}

export async function getMcpCategoryCounts(): Promise<Record<string, number>> {
  const all = await getAllMcpServers();
  const classified = classifyAllMcpServers(all);
  const counts: Record<string, number> = {};
  for (const cat of MCP_CATEGORIES) {
    counts[cat.slug] = classified[cat.slug]?.length ?? 0;
  }
  return counts;
}
