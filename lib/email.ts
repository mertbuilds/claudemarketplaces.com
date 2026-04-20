import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Claude Code Marketplaces <noreply@claudemarketplaces.com>";

const KIT_API_KEY = process.env.KIT_API_KEY!;
const KIT_TAG_ID = process.env.KIT_TAG_ID!;

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
 * Call when marketing consent is granted.
 */
export async function addToMarketing(email: string, firstName?: string) {
  if (!KIT_API_KEY) {
    console.error("[email] KIT_API_KEY not set — skipping Kit subscribe");
    return;
  }
  if (!KIT_TAG_ID) {
    console.error("[email] KIT_TAG_ID not set — skipping Kit subscribe");
    return;
  }

  try {
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
    });

    if (!createRes.ok) {
      const body = await createRes.text();
      console.error("[email] Kit create subscriber failed:", createRes.status, body);
      return;
    }

    const { subscriber } = (await createRes.json()) as {
      subscriber: { id: number; state?: string };
    };
    if (!subscriber?.id) return;

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
      },
    );

    if (!tagRes.ok) {
      const body = await tagRes.text();
      console.error("[email] Kit tag subscriber failed:", tagRes.status, body);
    }
  } catch (err) {
    console.error("[email] Kit subscribe threw:", err);
  }
}
