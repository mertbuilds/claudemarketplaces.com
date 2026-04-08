-- Add LLM-generated editorial summary to skills
-- These replace the mirrored SKILL.md as primary page content for SEO uniqueness
ALTER TABLE skills ADD COLUMN summary text;
