import { NextResponse } from "next/server";
import { addToMarketing } from "@/lib/email";
import { newsletterSubscribeSchema } from "@/lib/schemas/newsletter.schema";

export const dynamic = "force-dynamic";

const MIN_SUBMISSION_TIME_MS = 2000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    const timeTaken = Date.now() - (result.data.timestamp ?? 0);
    if (timeTaken < MIN_SUBMISSION_TIME_MS) {
      return NextResponse.json(
        { error: "Please wait a moment before submitting" },
        { status: 429 },
      );
    }

    await addToMarketing(result.data.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing newsletter subscribe:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}
