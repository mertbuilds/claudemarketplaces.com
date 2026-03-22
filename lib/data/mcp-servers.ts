import { McpServer } from "@/lib/types";
import { getDataClient } from "@/lib/supabase/data-client";
import { mapMcpServerRow, McpServerRow } from "@/lib/supabase/mappers";

export async function getAllMcpServers(options?: {
  includeEmpty?: boolean;
}): Promise<McpServer[]> {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("mcp_servers")
    .select("*")
    .order("vote_count", { ascending: false });
  if (error) {
    console.error("Error fetching MCP servers:", error);
    return [];
  }
  let servers = (data as McpServerRow[]).map(mapMcpServerRow);
  if (!options?.includeEmpty) {
    servers = servers.filter((s) => s.name && s.description);
  }
  return servers;
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
