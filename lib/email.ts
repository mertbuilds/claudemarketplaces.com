import { Resend } from "resend";

const FROM_ADDRESS = "Claude Code Marketplaces <noreply@claudemarketplaces.com>";

let resendInstance: Resend | null = null;
function getResend(): Resend {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendInstance = new Resend(key);
  }
  return resendInstance;
}

function getMarketingSegmentId(): string {
  const id = process.env.RESEND_MARKETING_SEGMENT_ID;
  if (!id) {
    throw new Error("RESEND_MARKETING_SEGMENT_ID is not set");
  }
  return id;
}

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
  return getResend().emails.send({ from: FROM_ADDRESS, to, subject, html });
}

/** Create contact in Resend (idempotent). Call for all signups. */
export async function createContact(email: string, firstName?: string) {
  const { error } = await getResend().contacts.create({
    email,
    ...(firstName ? { firstName } : {}),
  });
  if (error) {
    console.error("[email] Failed to create contact:", error.message);
  }
}

/** Create contact and add to marketing segment. Call when user consents. */
export async function addToMarketing(email: string, firstName?: string) {
  const resend = getResend();
  const { data, error } = await resend.contacts.create({
    email,
    ...(firstName ? { firstName } : {}),
  });
  if (error) {
    console.error("[email] Failed to create contact for marketing:", error.message);
    return;
  }
  if (!data?.id) return;

  const { error: segmentError } = await resend.contacts.segments.add({
    segmentId: getMarketingSegmentId(),
    contactId: data.id,
  });
  if (segmentError) {
    console.error("[email] Failed to add to marketing segment:", segmentError.message);
  }
}
