import { createClient } from "./client";

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  email_marketing_consent: boolean;
  email_marketing_consent_at: string | null;
  onboarding_completed: boolean;
};

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  return data;
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateProfile(userId: string, updates: { username?: string; full_name?: string }): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) {
    if (error.code === "23505") {
      return { data: null, error: "Username is already taken" };
    }
    return { data: null, error: error.message };
  }
  return { data, error: null };
}
