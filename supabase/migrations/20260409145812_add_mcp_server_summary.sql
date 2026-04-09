-- Add LLM-generated editorial summary to MCP servers
-- Same pattern as skills: summary provides original content for SEO indexability
ALTER TABLE mcp_servers ADD COLUMN IF NOT EXISTS summary text;
