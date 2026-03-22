import { NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/schemas/feedback.schema";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const MIN_SUBMISSION_TIME_MS = 2000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Honeypot check
    if (result.data.website) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Speed check
    const timeTaken = Date.now() - (result.data.timestamp || 0);
    if (timeTaken < MIN_SUBMISSION_TIME_MS) {
      return NextResponse.json(
        { error: "Please wait a moment before submitting" },
        { status: 429 }
      );
    }

    const userAgent = request.headers.get("user-agent") || null;

    // Insert directly into Supabase
    const admin = createAdminClient();
    const { error } = await admin.from("feedback_submissions").insert({
      name: result.data.name || null,
      email: result.data.email,
      message: result.data.message,
      user_agent: userAgent,
    });

    if (error) {
      console.error("Error saving feedback:", error);
      return NextResponse.json(
        { error: "Failed to save feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback!",
    });
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { error: "Failed to process feedback. Please try again." },
      { status: 500 }
    );
  }
}
