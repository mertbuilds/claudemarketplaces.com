import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Claude Code Marketplaces <noreply@claudemarketplaces.com>";

const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_TAG_ID = process.env.KIT_TAG_ID;

const KIT_TIMEOUT_MS = 5000;

/** Send a transactional email directly via Resend. */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
}

/** Create a Resend contact for transactional tracking. Idempotent. */
export async function createContact(email: string, firstName?: string) {
  const { error } = await resend.contacts.create({
    email,
    ...(firstName ? { firstName } : {}),
  });
  if (error) {
    console.error("[email] Failed to create Resend contact:", error.message);
  }
}

/**
 * Subscribe a user to the Kit newsletter list (tag: cmkt-weekly-2026).
 * Creates the subscriber in Kit if they don't exist, then applies the tag.
 *
 * Throws on any failure so callers can distinguish real subscription success
 * from a silent upstream error. Soft edge cases (e.g. a previously
 * unsubscribed user re-submitting) are logged but not thrown — they leave the
 * subscriber in Kit in their current state, which is the correct compliant
 * behavior.
 */
export async function addToMarketing(
  email: string,
  firstName?: string,
): Promise<void> {
  if (!KIT_API_KEY) {
    throw new Error("Newsletter service not configured (KIT_API_KEY missing)");
  }
  if (!KIT_TAG_ID) {
    throw new Error("Newsletter service not configured (KIT_TAG_ID missing)");
  }

  const createRes = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": KIT_API_KEY,
    },
    body: JSON.stringify({
      email_address: email,
      state: "active",
      ...(firstName ? { first_name: firstName } : {}),
    }),
    signal: AbortSignal.timeout(KIT_TIMEOUT_MS),
  });

  if (!createRes.ok) {
    const body = await createRes.text();
    throw new Error(
      `Kit subscriber create failed: ${createRes.status} ${body}`,
    );
  }

  const { subscriber } = (await createRes.json()) as {
    subscriber: { id: number; state?: string };
  };
  if (!subscriber?.id) {
    throw new Error("Kit subscriber create returned no subscriber id");
  }

  // Kit's POST /v4/subscribers is an upsert that does NOT update state on
  // existing subscribers. A previously-unsubscribed user resubmitting the
  // form returns 200 but stays inactive. We respect that (compliant), but
  // log it so it's not misread as a successful re-opt-in.
  if (subscriber.state && subscriber.state !== "active") {
    console.warn(
      `[email] Kit subscriber ${email} is ${subscriber.state}; Kit will not reactivate via upsert. Tagging anyway.`,
    );
  }

  const tagRes = await fetch(
    `https://api.kit.com/v4/tags/${KIT_TAG_ID}/subscribers/${subscriber.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": KIT_API_KEY,
      },
      body: "{}",
      signal: AbortSignal.timeout(KIT_TIMEOUT_MS),
    },
  );

  if (!tagRes.ok) {
    const body = await tagRes.text();
    throw new Error(`Kit tag subscriber failed: ${tagRes.status} ${body}`);
  }
}
