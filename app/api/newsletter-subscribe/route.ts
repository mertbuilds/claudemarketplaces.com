import { NextResponse } from "next/server";
import { addToMarketing } from "@/lib/email";
import { newsletterSubscribeSchema } from "@/lib/schemas/newsletter.schema";

export const dynamic = "force-dynamic";

const MIN_SUBMISSION_TIME_MS = 2000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const result = newsletterSubscribeSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid email", details: result.error.flatten() },
      { status: 400 },
    );
  }

  if (result.data.website) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const timeTaken = Date.now() - result.data.timestamp;
  if (timeTaken < MIN_SUBMISSION_TIME_MS) {
    return NextResponse.json(
      { error: "Please wait a moment before submitting" },
      { status: 429 },
    );
  }

  const kit = await addToMarketing(result.data.email);
  if (!kit.ok) {
    console.error(
      "[newsletter-subscribe] Kit signup failed:",
      JSON.stringify({ email: result.data.email, ...kit }),
    );
    return NextResponse.json(
      { error: "Subscription service unavailable. Please try again." },
      { status: 502 },
    );
  }

  if (kit.state !== "active") {
    // Respect Kit's compliance behavior: a previously-unsubscribed user
    // submitting the form stays inactive. We return success so the form
    // clears, but this is logged for ops visibility.
    console.warn(
      "[newsletter-subscribe] Kit subscriber not active:",
      JSON.stringify({ email: result.data.email, ...kit }),
    );
  }

  return NextResponse.json({ success: true });
}
