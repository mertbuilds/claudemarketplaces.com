import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { addContact, AUDIENCES } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if this is a new user who hasn't completed onboarding
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();

        if (profile && !profile.onboarding_completed) {
          // New user — add to transactional list before redirecting
          const email = user.email;
          const name = user.user_metadata?.full_name || user.user_metadata?.name;
          if (email) {
            try {
              await addContact(email, AUDIENCES.transactional, name);
            } catch (err) {
              console.error("[email] Failed to add to transactional:", err);
            }
          }

          const welcomeUrl = new URL("/welcome", origin);
          welcomeUrl.searchParams.set("next", next);
          return NextResponse.redirect(welcomeUrl);
        }
      }

      const redirectUrl = new URL(next, origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", origin));
}
