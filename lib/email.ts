import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Claude Code Marketplaces <noreply@claudemarketplaces.com>";

const MARKETING_SEGMENT_ID = process.env.RESEND_MARKETING_SEGMENT_ID!;

/** Send a transactional email directly (no contact list needed). */
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

/** Add user to marketing segment as a contact. Call when user consents. */
export async function addToMarketing(email: string, firstName?: string) {
  try {
    await resend.contacts.create({
      email,
      ...(firstName ? { firstName } : {}),
      segments: [{ id: MARKETING_SEGMENT_ID }],
    });
  } catch (err) {
    console.error("[email] Failed to add to marketing:", err);
  }
}

/** Unsubscribe user from all broadcasts. Call when user revokes consent. */
export async function removeFromMarketing(email: string) {
  try {
    await resend.contacts.update({
      email,
      unsubscribed: true,
    });
  } catch (err) {
    console.error("[email] Failed to unsubscribe:", err);
  }
}

/** Sync marketing consent: add to segment or unsubscribe. */
export async function syncMarketingConsent(
  email: string,
  consent: boolean,
  firstName?: string
) {
  if (consent) {
    await addToMarketing(email, firstName);
  } else {
    await removeFromMarketing(email);
  }
}
