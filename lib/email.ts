import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Claude Code Marketplaces <noreply@claudemarketplaces.com>";

export const AUDIENCES = {
  transactional: process.env.RESEND_TRANSACTIONAL_AUDIENCE_ID!,
  marketing: process.env.RESEND_MARKETING_AUDIENCE_ID!,
};

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

export async function addContact(
  email: string,
  audienceId: string,
  firstName?: string
) {
  return resend.contacts.create({
    email,
    audienceId,
    ...(firstName ? { firstName } : {}),
  });
}

export async function removeContact(email: string, audienceId: string) {
  // Resend accepts email as the id parameter
  return resend.contacts.remove({ audienceId, id: email });
}

/** Add user to transactional list. Optionally add to marketing if consented. */
export async function syncNewUser(
  email: string,
  marketingConsent: boolean,
  firstName?: string
) {
  const results = await Promise.allSettled([
    addContact(email, AUDIENCES.transactional, firstName),
    ...(marketingConsent
      ? [addContact(email, AUDIENCES.marketing, firstName)]
      : []),
  ]);

  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[email] Failed to sync contact:", r.reason);
    }
  }
}

/** Sync marketing list when consent changes. */
export async function syncMarketingConsent(
  email: string,
  consent: boolean,
  firstName?: string
) {
  try {
    if (consent) {
      await addContact(email, AUDIENCES.marketing, firstName);
    } else {
      await removeContact(email, AUDIENCES.marketing);
    }
  } catch (err) {
    console.error("[email] Failed to sync marketing consent:", err);
  }
}
