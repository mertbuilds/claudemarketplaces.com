import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for public data reads.
 * Never touches cookies, so pages using this stay statically renderable.
 * For authenticated per-user queries, import createClient from ./server directly.
 */
export async function getDataClient(): Promise<SupabaseClient> {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
