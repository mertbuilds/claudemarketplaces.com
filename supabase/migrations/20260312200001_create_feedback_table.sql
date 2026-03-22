-- Feedback submissions table (migrated from Vercel Blob)
create table public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  message text not null,
  submitted_at timestamptz default now() not null,
  user_agent text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.feedback_submissions enable row level security;

-- Only service role can read feedback (admin only)
-- No public read policy — feedback is private
