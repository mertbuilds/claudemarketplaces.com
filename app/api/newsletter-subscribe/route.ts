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

  try {
    await addToMarketing(result.data.email);
  } catch (err) {
    console.error("[newsletter-subscribe] Kit call failed:", err);
    return NextResponse.json(
      { error: "Subscription service unavailable. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
