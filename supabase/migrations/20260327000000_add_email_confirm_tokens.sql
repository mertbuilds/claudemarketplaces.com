-- Tokens for email marketing consent confirmation
CREATE TABLE public.email_confirmation_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index for fast token lookups
CREATE INDEX email_confirmation_tokens_token_idx ON public.email_confirmation_tokens (token);

-- RLS: only service role should access this table
ALTER TABLE public.email_confirmation_tokens ENABLE ROW LEVEL SECURITY;
