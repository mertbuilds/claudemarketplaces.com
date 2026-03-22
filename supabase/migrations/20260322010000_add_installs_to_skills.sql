-- Add installs column to skills table
ALTER TABLE skills ADD COLUMN installs integer NOT NULL DEFAULT 0;

-- Index for sorting by installs
CREATE INDEX idx_skills_installs_desc ON skills (installs DESC);
