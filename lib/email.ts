import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Claude Code Marketplaces <noreply@claudemarketplaces.com>";

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

export type AddToMarketingResult =
  | {
      ok: true;
      subscriberId: number;
      state: string;
      alreadyExisted: boolean;
    }
  | {
      ok: false;
      reason:
        | "missing_config"
        | "create_failed"
        | "lookup_failed"
        | "tag_failed"
        | "exception";
      status?: number;
      detail?: string;
    };

/**
 * Subscribe a user to the Kit newsletter list.
 *
 * Idempotent: if the subscriber already exists, looks them up and proceeds
 * to tagging. Reads env vars at call time (module-load timing on edge /
 * cold starts can be unreliable).
 *
 * Returns a result so callers can log and decide whether to surface the
 * failure. On unexpected failures (network, 5xx) the caller can choose to
 * return a 5xx of its own.
 */
export async function addToMarketing(
  email: string,
  firstName?: string,
): Promise<AddToMarketingResult> {
  const apiKey = process.env.KIT_API_KEY;
  const tagId = process.env.KIT_TAG_ID;

  if (!apiKey || !tagId) {
    return {
      ok: false,
      reason: "missing_config",
      detail: `KIT_API_KEY=${Boolean(apiKey)} KIT_TAG_ID=${Boolean(tagId)}`,
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Kit-Api-Key": apiKey,
  };

  let subscriberId: number;
  let state: string;
  let alreadyExisted = false;

  try {
    const createRes = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers,
      body: JSON.stringify({
        email_address: email,
        state: "active",
        ...(firstName ? { first_name: firstName } : {}),
      }),
    });

    if (createRes.ok) {
      const body = (await createRes.json().catch(() => ({}))) as {
        subscriber?: { id: number; state: string };
      };
      if (!body.subscriber?.id) {
        return {
          ok: false,
          reason: "create_failed",
          status: createRes.status,
          detail: "subscriber missing in response",
        };
      }
      subscriberId = body.subscriber.id;
      state = body.subscriber.state;
    } else if (createRes.status === 422) {
      alreadyExisted = true;
      const lookupRes = await fetch(
        `https://api.kit.com/v4/subscribers?email_address=${encodeURIComponent(email)}`,
        { headers },
      );
      if (!lookupRes.ok) {
        const detail = await lookupRes.text().catch(() => "");
        return {
          ok: false,
          reason: "lookup_failed",
          status: lookupRes.status,
          detail: detail.slice(0, 200),
        };
      }
      const lookup = (await lookupRes.json().catch(() => ({}))) as {
        subscribers?: Array<{ id: number; state: string }>;
      };
      const existing = lookup.subscribers?.[0];
      if (!existing?.id) {
        return {
          ok: false,
          reason: "lookup_failed",
          detail: "422 on create but lookup returned no match",
        };
      }
      subscriberId = existing.id;
      state = existing.state;
    } else {
      const detail = await createRes.text().catch(() => "");
      return {
        ok: false,
        reason: "create_failed",
        status: createRes.status,
        detail: detail.slice(0, 200),
      };
    }
  } catch (err) {
    return {
      ok: false,
      reason: "exception",
      detail: err instanceof Error ? err.message : String(err),
    };
  }

  try {
    const tagRes = await fetch(
      `https://api.kit.com/v4/tags/${tagId}/subscribers/${subscriberId}`,
      { method: "POST", headers, body: "{}" },
    );
    if (!tagRes.ok) {
      const detail = await tagRes.text().catch(() => "");
      return {
        ok: false,
        reason: "tag_failed",
        status: tagRes.status,
        detail: detail.slice(0, 200),
      };
    }
    return { ok: true, subscriberId, state, alreadyExisted };
  } catch (err) {
    return {
      ok: false,
      reason: "exception",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
