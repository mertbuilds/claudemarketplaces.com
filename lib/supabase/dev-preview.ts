import type { Profile } from "./profile";

export const MOCK_DEV_USERNAME = "dev-preview";

export const MOCK_DEV_USER = {
  id: "00000000-0000-0000-0000-000000000dev",
  email: "dev-preview@claudemarketplaces.local",
};

export const MOCK_DEV_PROFILE: Profile = {
  id: MOCK_DEV_USER.id,
  username: MOCK_DEV_USERNAME,
  full_name: "Preview User",
  avatar_url: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  email_marketing_consent: true,
  email_marketing_consent_at: "2026-01-01T00:00:00.000Z",
  onboarding_completed: true,
};

/**
 * True only when running in development AND the opt-in env flag is set.
 * Production builds never set the flag, and NODE_ENV is also guarded,
 * so this is always false outside local dev.
 */
export function isDevPreview(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_PREVIEW_AUTH === "1"
  );
}
