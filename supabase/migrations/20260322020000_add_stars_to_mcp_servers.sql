ALTER TABLE mcp_servers ADD COLUMN stars integer;
CREATE INDEX idx_mcp_servers_stars_desc ON mcp_servers (stars DESC NULLS LAST);
