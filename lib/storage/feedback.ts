import { createAdminClient } from "@/lib/supabase/admin";
import { FeedbackSubmission } from "@/lib/schemas/feedback.schema";

export async function readFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("feedback_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error reading feedback:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name || undefined,
    email: row.email,
    message: row.message,
    submittedAt: row.submitted_at,
    userAgent: row.user_agent || undefined,
  }));
}

export async function writeFeedbackSubmissions(
  submissions: FeedbackSubmission[]
): Promise<void> {
  // For the feedback API, we only ever append one submission at a time.
  // The caller reads all, pushes one, writes all back.
  // With Supabase we just insert the last one (the new one).
  const latest = submissions[submissions.length - 1];
  if (!latest) return;

  const admin = createAdminClient();
  const { error } = await admin.from("feedback_submissions").upsert(
    {
      id: latest.id,
      name: latest.name || null,
      email: latest.email,
      message: latest.message,
      submitted_at: latest.submittedAt,
      user_agent: latest.userAgent || null,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Error writing feedback:", error);
    throw error;
  }
}
