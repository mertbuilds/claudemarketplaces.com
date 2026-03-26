-- Add email marketing consent and onboarding columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN email_marketing_consent boolean DEFAULT false NOT NULL,
  ADD COLUMN email_marketing_consent_at timestamptz,
  ADD COLUMN onboarding_completed boolean DEFAULT false NOT NULL;

-- Mark all existing users as onboarded (they won't see the welcome screen)
UPDATE public.profiles SET onboarding_completed = true;
