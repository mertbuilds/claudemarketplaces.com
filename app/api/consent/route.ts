import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { syncMarketingConsent } from "@/lib/email";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { consent } = await request.json();

  const { error } = await supabase
    .from("profiles")
    .update({
      email_marketing_consent: consent === true,
      email_marketing_consent_at: new Date().toISOString(),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sync marketing list before responding (must complete before function terminates)
  const email = user.email;
  if (email) {
    await syncMarketingConsent(email, consent === true);
  }

  return NextResponse.json({ success: true });
}
