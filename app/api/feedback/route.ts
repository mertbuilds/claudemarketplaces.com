import { NextResponse } from "next/server";
import {
  feedbackSchema,
  type FeedbackSubmission,
} from "@/lib/schemas/feedback.schema";
import {
  readFeedbackSubmissions,
  writeFeedbackSubmissions,
} from "@/lib/storage/feedback";

export const dynamic = "force-dynamic";

const MIN_SUBMISSION_TIME_MS = 2000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate with Zod
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Check honeypot using validated data
    if (result.data.website) {
      console.log("Honeypot triggered, rejecting submission");
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check timestamp (prevent too fast submissions) using validated data
    const timeTaken = Date.now() - (result.data.timestamp || 0);
    if (timeTaken < MIN_SUBMISSION_TIME_MS) {
      console.log("Submission too fast, rejecting");
      return NextResponse.json(
        { error: "Please wait a moment before submitting" },
        { status: 429 }
      );
    }

    // Get user agent
    const userAgent = request.headers.get("user-agent") || undefined;

    // Create submission
    const submission: FeedbackSubmission = {
      id: crypto.randomUUID(),
      name: result.data.name,
      email: result.data.email,
      message: result.data.message,
      submittedAt: new Date().toISOString(),
      userAgent,
    };

    // Read existing submissions
    const submissions = await readFeedbackSubmissions();

    // Add new submission
    submissions.push(submission);

    // Write back to storage
    await writeFeedbackSubmissions(submissions);

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
