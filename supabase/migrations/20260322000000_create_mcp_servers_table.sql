CREATE TABLE mcp_servers (
  slug text PRIMARY KEY,
  name text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  source_repo text NOT NULL,
  source text NOT NULL DEFAULT '',
  user_name text NOT NULL DEFAULT '',
  collection text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  url text,
  last_updated timestamptz,
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_mcp_servers_source_repo ON mcp_servers (source_repo);
CREATE INDEX idx_mcp_servers_vote_count_desc ON mcp_servers (vote_count DESC);

ALTER TABLE mcp_servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON mcp_servers FOR SELECT USING (true);

-- Update votes check constraint to include mcp_server
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_item_type_check;
ALTER TABLE votes ADD CONSTRAINT votes_item_type_check CHECK (item_type IN ('marketplace', 'plugin', 'skill', 'skill_repo', 'mcp_server'));

-- Update vote count trigger function to handle mcp_server
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
DECLARE
  target_table text;
  pk_column text;
  delta smallint;
  target_id text;
BEGIN
  CASE COALESCE(NEW.item_type, OLD.item_type)
    WHEN 'marketplace' THEN target_table := 'marketplaces'; pk_column := 'repo';
    WHEN 'plugin' THEN target_table := 'plugins'; pk_column := 'id';
    WHEN 'skill' THEN target_table := 'skills'; pk_column := 'id';
    WHEN 'skill_repo' THEN target_table := 'skill_repos'; pk_column := 'repo';
    WHEN 'mcp_server' THEN target_table := 'mcp_servers'; pk_column := 'slug';
    ELSE RETURN NULL;
  END CASE;

  IF TG_OP = 'INSERT' THEN delta := NEW.value; target_id := NEW.item_id;
  ELSIF TG_OP = 'DELETE' THEN delta := -OLD.value; target_id := OLD.item_id;
  ELSIF TG_OP = 'UPDATE' THEN
    delta := NEW.value - OLD.value; target_id := NEW.item_id;
    IF delta = 0 THEN RETURN NEW; END IF;
  END IF;

  EXECUTE format('UPDATE %I SET vote_count = vote_count + $1 WHERE %I = $2', target_table, pk_column)
  USING delta, target_id;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
