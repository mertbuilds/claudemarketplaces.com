#!/usr/bin/env bun
/**
 * One-time script to send email marketing consent confirmation emails
 * to existing users who haven't opted in yet.
 *
 * Usage: bun run scripts/send-permission-confirmation.ts
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

interface ProfileRow {
  id: string;
  onboarding_completed: boolean;
  email_marketing_consent: boolean;
}

// Load .env.local only if env vars aren't already set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const envFile = Bun.file(`${import.meta.dir}/../.env.local`);
  if (await envFile.exists()) {
    const text = await envFile.text();
    for (const line of text.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match && !process.env[match[1].trim()]) {
        process.env[match[1].trim()] = match[2].trim();
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!resendApiKey) {
  console.error("Missing RESEND_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const resend = new Resend(resendApiKey);

const EMAIL_BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;

function buildEmailHtml(token: string): string {
  return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; color: #e0e0e0; background: #0a0a0a;">
  <p style="margin: 0 0 16px;">Hey,</p>
  <p style="margin: 0 0 16px;">You recently signed up for <a href="https://claudemarketplaces.com" style="color: #a78bfa;">claudemarketplaces.com</a> — thanks for being an early user.</p>
  <p style="margin: 0 0 16px;">We're starting a weekly digest of new Claude Code tools, skills, and MCP servers worth knowing about.</p>
  <p style="margin: 0 0 16px;">If you'd like to receive it, confirm here:</p>
  <p style="margin: 0 0 24px;"><a href="https://claudemarketplaces.com/api/email-confirm?token=${token}" style="color: #a78bfa; font-weight: 600;">Yes, I'd like weekly updates &rarr;</a></p>
  <p style="margin: 0 0 16px; color: #888;">If not, no action needed — we won't email you again.</p>
  <p style="margin: 24px 0 0; color: #888;">— Mert<br/>claudemarketplaces.com</p>
</div>`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Guard: check if script already ran
  const { data: existingTokens, error: checkError } = await supabase
    .from("email_confirmation_tokens")
    .select("id")
    .limit(1);

  if (checkError) {
    console.error("Failed to check email_confirmation_tokens:", checkError.message);
    process.exit(1);
  }

  if (existingTokens && existingTokens.length > 0) {
    console.log("Script already ran. Exiting.");
    return;
  }

  // Get profiles that completed onboarding but haven't consented
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id")
    .eq("onboarding_completed", true)
    .eq("email_marketing_consent", false);

  if (profilesError) {
    console.error("Failed to fetch profiles:", profilesError.message);
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.log("No users to email. Done!");
    return;
  }

  // Get emails from auth.users for these user IDs
  const userIds = profiles.map((p: ProfileRow) => p.id);
  const usersWithEmail: { id: string; email: string }[] = [];

  for (const userId of userIds) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user?.email) {
      console.warn(`Skipping user ${userId}: no email found`);
      continue;
    }

    usersWithEmail.push({ id: user.id, email: user.email });
  }

  if (usersWithEmail.length === 0) {
    console.log("No users with emails found. Done!");
    return;
  }

  console.log(`Sending to ${usersWithEmail.length} users...`);

  // Generate tokens for all users
  const tokenRows = usersWithEmail.map((u) => {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    return {
      user_id: u.id,
      token,
      expires_at: expiresAt,
    };
  });

  // Batch insert all tokens
  const { error: insertError } = await supabase
    .from("email_confirmation_tokens")
    .insert(tokenRows);

  if (insertError) {
    console.error("Failed to insert tokens:", insertError.message);
    process.exit(1);
  }

  // Build a map of user_id -> token for email sending
  const tokenMap = new Map<string, string>();
  for (const row of tokenRows) {
    tokenMap.set(row.user_id, row.token);
  }

  // Send emails in batches
  let sent = 0;
  for (let i = 0; i < usersWithEmail.length; i += EMAIL_BATCH_SIZE) {
    const batch = usersWithEmail.slice(i, i + EMAIL_BATCH_SIZE);

    await Promise.all(
      batch.map(async (u) => {
        const token = tokenMap.get(u.id);
        if (!token) return;

        try {
          await resend.emails.send({
            from: "Claude Code Marketplaces <noreply@claudemarketplaces.com>",
            to: u.email,
            subject:
              "claudemarketplaces.com \u2014 want weekly Claude Code updates?",
            html: buildEmailHtml(token),
          });
        } catch (err) {
          console.error(`Failed to send to ${u.email}:`, err);
        }
      })
    );

    sent += batch.length;
    console.log(`Sent ${sent}/${usersWithEmail.length}`);

    if (i + EMAIL_BATCH_SIZE < usersWithEmail.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
