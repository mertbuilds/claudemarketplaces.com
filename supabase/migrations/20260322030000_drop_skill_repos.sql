-- Remove skill_repos table (unused — skills are organized by repo field on skills table)

-- Update votes check constraint to remove skill_repo
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_item_type_check;
ALTER TABLE votes ADD CONSTRAINT votes_item_type_check CHECK (item_type IN ('marketplace', 'plugin', 'skill', 'mcp_server'));

-- Drop the table
DROP TABLE IF EXISTS skill_repos;

-- Update vote count trigger function to remove skill_repo case
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
