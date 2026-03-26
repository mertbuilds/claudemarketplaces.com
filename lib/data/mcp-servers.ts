import { McpServer } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapMcpServerRow, McpServerRow } from "@/lib/supabase/mappers";

export async function getAllMcpServers(_options?: {
  includeEmpty?: boolean;
}): Promise<McpServer[]> {
  const supabase = await getDataClient();
  const allRows: McpServerRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("mcp_servers")
      .select("*")
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
