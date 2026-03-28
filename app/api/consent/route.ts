import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createContact, addToMarketing } from "@/lib/email";

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

  if (user.email) {
    if (consent === true) {
      await addToMarketing(user.email);
    } else {
      await createContact(user.email);
    }
  }

  return NextResponse.json({ success: true });
}
