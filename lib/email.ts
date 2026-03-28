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

/** Create contact in Resend (idempotent). Call for all signups. */
export async function createContact(email: string, firstName?: string) {
  try {
    await resend.contacts.create({
      email,
      ...(firstName ? { firstName } : {}),
    });
  } catch (err) {
    console.error("[email] Failed to create contact:", err);
  }
}

/** Create contact and add to marketing segment. Call when user consents. */
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