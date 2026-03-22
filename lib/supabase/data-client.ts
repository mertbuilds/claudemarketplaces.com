import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Get a Supabase client for data reads.
 * Uses the server client (cookie-based) in request context,
 * falls back to a direct client during build/static generation.
 */
export async function getDataClient(): Promise<SupabaseClient> {
  try {
    return await createServerClient();
  } catch {
    // cookies() throws outside request scope (e.g. generateStaticParams)
    // Use service role key if available, otherwise anon key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
}
