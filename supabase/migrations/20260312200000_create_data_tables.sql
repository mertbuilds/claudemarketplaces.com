-- Migration: Create core data tables for marketplaces, plugins, skills, skill_repos, and votes
-- Date: 2026-03-12

-- ============================================================================
-- TABLES
-- ============================================================================

-- Marketplaces
CREATE TABLE marketplaces (
  repo text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  plugin_count integer NOT NULL DEFAULT 0,
  categories text[] NOT NULL DEFAULT '{}',
  plugin_keywords text[] NOT NULL DEFAULT '{}',
  discovered_at timestamptz,
  last_updated timestamptz,
  source text,
  stars integer,
  stars_fetched_at timestamptz,
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Plugins
CREATE TABLE plugins (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  version text,
  author_name text,
  author_email text,
  author_url text,
  homepage text,
  repository text,
  source text NOT NULL,
  marketplace text NOT NULL REFERENCES marketplaces(slug),
  marketplace_url text NOT NULL,
  category text NOT NULL DEFAULT '',
  license text,
  keywords text[] NOT NULL DEFAULT '{}',
  commands text[] NOT NULL DEFAULT '{}',
  agents text[] NOT NULL DEFAULT '{}',
  hooks text[] NOT NULL DEFAULT '{}',
  mcp_servers text[] NOT NULL DEFAULT '{}',
  install_command text NOT NULL,
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Skills
CREATE TABLE skills (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  repo text NOT NULL,
  repo_slug text NOT NULL,
  path text NOT NULL,
  license text,
  stars integer,
  install_command text NOT NULL,
  discovered_at timestamptz,
  last_updated timestamptz,
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Skill Repos
CREATE TABLE skill_repos (
  repo text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  skill_count integer NOT NULL DEFAULT 0,
  stars integer,
  stars_fetched_at timestamptz,
  discovered_at timestamptz,
  last_updated timestamptz,
  source text,
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Votes
CREATE TABLE votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('marketplace', 'plugin', 'skill', 'skill_repo')),
  item_id text NOT NULL,
  value smallint NOT NULL CHECK (value IN (1, -1)),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, item_type, item_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Marketplaces
CREATE INDEX idx_marketplaces_slug ON marketplaces (slug);
CREATE INDEX idx_marketplaces_stars_desc ON marketplaces (stars DESC);
CREATE INDEX idx_marketplaces_vote_count_desc ON marketplaces (vote_count DESC);

-- Plugins
CREATE INDEX idx_plugins_marketplace ON plugins (marketplace);
CREATE INDEX idx_plugins_vote_count_desc ON plugins (vote_count DESC);

-- Skills
CREATE INDEX idx_skills_repo ON skills (repo);
CREATE INDEX idx_skills_repo_slug ON skills (repo_slug);
CREATE INDEX idx_skills_stars_desc ON skills (stars DESC);
CREATE INDEX idx_skills_vote_count_desc ON skills (vote_count DESC);

-- Skill Repos
CREATE INDEX idx_skill_repos_slug ON skill_repos (slug);
CREATE INDEX idx_skill_repos_stars_desc ON skill_repos (stars DESC);
CREATE INDEX idx_skill_repos_vote_count_desc ON skill_repos (vote_count DESC);

-- Votes
CREATE INDEX idx_votes_item ON votes (item_type, item_id);
CREATE INDEX idx_votes_user_id ON votes (user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Data tables: public read access
CREATE POLICY "Public read access" ON marketplaces FOR SELECT USING (true);
CREATE POLICY "Public read access" ON plugins FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skill_repos FOR SELECT USING (true);

-- Votes: public read access
CREATE POLICY "Public read access" ON votes FOR SELECT USING (true);

-- Votes: authenticated users can insert their own
CREATE POLICY "Authenticated users can insert own votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Votes: authenticated users can update their own
CREATE POLICY "Authenticated users can update own votes"
  ON votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Votes: authenticated users can delete their own
CREATE POLICY "Authenticated users can delete own votes"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- VOTE COUNT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
DECLARE
  target_table text;
  pk_column text;
  delta smallint;
  target_id text;
BEGIN
  -- Map item_type to table and primary key column
  CASE COALESCE(NEW.item_type, OLD.item_type)
    WHEN 'marketplace' THEN
      target_table := 'marketplaces';
      pk_column := 'repo';
    WHEN 'plugin' THEN
      target_table := 'plugins';
      pk_column := 'id';
    WHEN 'skill' THEN
      target_table := 'skills';
      pk_column := 'id';
    WHEN 'skill_repo' THEN
      target_table := 'skill_repos';
      pk_column := 'repo';
    ELSE
      RETURN NULL;
  END CASE;

  IF TG_OP = 'INSERT' THEN
    delta := NEW.value;
    target_id := NEW.item_id;
  ELSIF TG_OP = 'DELETE' THEN
    delta := -OLD.value;
    target_id := OLD.item_id;
  ELSIF TG_OP = 'UPDATE' THEN
    delta := NEW.value - OLD.value;
    target_id := NEW.item_id;
    -- No change needed
    IF delta = 0 THEN
      RETURN NEW;
    END IF;
  END IF;

  EXECUTE format(
    'UPDATE %I SET vote_count = vote_count + $1 WHERE %I = $2',
    target_table, pk_column
  ) USING delta, target_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_vote_count
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_count();
