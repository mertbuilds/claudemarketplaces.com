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
    // Create contact first (idempotent — won't duplicate if exists)
    await resend.contacts.create({
      email,
      ...(firstName ? { firstName } : {}),
    });
    // Then add to marketing segment
    await resend.contacts.segments.add({
      email,
      segmentId: MARKETING_SEGMENT_ID,
    });
  } catch (err) {
    console.error("[email] Failed to add to marketing:", err);
  }
}

/** Remove user from marketing segment. Call when user revokes consent. */
export async function removeFromMarketing(email: string) {
  try {
    await resend.contacts.segments.remove({
      email,
      segmentId: MARKETING_SEGMENT_ID,
    });
  } catch (err) {
    console.error("[email] Failed to remove from marketing:", err);
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
