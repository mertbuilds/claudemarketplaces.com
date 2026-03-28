-- Add comment_count to entity tables
ALTER TABLE skills ADD COLUMN comment_count integer NOT NULL DEFAULT 0;
ALTER TABLE marketplaces ADD COLUMN comment_count integer NOT NULL DEFAULT 0;
ALTER TABLE mcp_servers ADD COLUMN comment_count integer NOT NULL DEFAULT 0;

-- Comments table
CREATE TABLE comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('skill', 'marketplace', 'mcp_server')),
  item_id text NOT NULL,
  body text NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 1000),
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_comments_item ON comments (item_type, item_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert own comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger function for comment_count
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
DECLARE
  target_table text;
  pk_column text;
  delta smallint;
  target_id text;
BEGIN
  CASE COALESCE(NEW.item_type, OLD.item_type)
    WHEN 'skill'       THEN target_table := 'skills';       pk_column := 'id';
    WHEN 'marketplace' THEN target_table := 'marketplaces'; pk_column := 'repo';
    WHEN 'mcp_server'  THEN target_table := 'mcp_servers';  pk_column := 'slug';
    ELSE RETURN NULL;
  END CASE;

  IF TG_OP = 'INSERT' THEN
    delta := 1; target_id := NEW.item_id;
  ELSIF TG_OP = 'DELETE' THEN
    delta := -1; target_id := OLD.item_id;
  ELSE
    RETURN NEW;
  END IF;

  EXECUTE format(
    'UPDATE %I SET comment_count = GREATEST(comment_count + $1, 0) WHERE %I = $2',
    target_table, pk_column
  ) USING delta, target_id;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_comment_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_count();
