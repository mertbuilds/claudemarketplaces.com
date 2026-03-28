import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Use service role to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find valid, unused, non-expired token
  const { data: tokenRow } = await supabase
    .from("email_confirmation_tokens")
    .select("id, user_id, used_at, expires_at")
    .eq("token", token)
    .single();

  if (!tokenRow) {
    return NextResponse.redirect(
      new URL("/email-confirmed?status=invalid", request.url)
    );
  }

  if (tokenRow.used_at) {
    return NextResponse.redirect(
      new URL("/email-confirmed?status=already", request.url)
    );
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.redirect(
      new URL("/email-confirmed?status=expired", request.url)
    );
  }

  // Mark token as used
  await supabase
    .from("email_confirmation_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", tokenRow.id);

  // Update user consent
  await supabase
    .from("profiles")
    .update({
      email_marketing_consent: true,
      email_marketing_consent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", tokenRow.user_id);

  // Add to Resend marketing segment
  try {
    const { addToMarketing } = await import("@/lib/email");
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(tokenRow.user_id);
    if (user?.email) {
      await addToMarketing(user.email);
    }
  } catch (err) {
    console.error("[email-confirm] Failed to sync Resend:", err);
  }

  return NextResponse.redirect(
    new URL("/email-confirmed?status=success", request.url)
  );
}
