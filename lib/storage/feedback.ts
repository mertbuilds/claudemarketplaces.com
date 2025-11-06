import { put, list } from "@vercel/blob";
import { FeedbackSubmission } from "@/lib/schemas/feedback.schema";
import fs from "fs/promises";
import path from "path";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PATHNAME = "feedback-submissions.json";
const FEEDBACK_FILE = path.join(
  process.cwd(),
  "lib/data/feedback-submissions.json"
);

/**
 * Read feedback submissions from Vercel Blob (if available) or local file
 */
export async function readFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
  try {
    // Try to read from Vercel Blob first (production)
    if (BLOB_TOKEN) {
      try {
        const { blobs } = await list({
          prefix: BLOB_PATHNAME,
          token: BLOB_TOKEN,
          limit: 1,
        });

        if (blobs.length > 0) {
          const blobUrl = blobs[0].url;
          const response = await fetch(blobUrl);
          if (response.ok) {
            const data = await response.json();
            console.log(`Loaded feedback from Vercel Blob: ${blobUrl}`);
            return data;
          }
        }

        console.log("Blob not found, falling back to local file");
      } catch (error) {
        console.log("Vercel Blob error, falling back to local file:", error);
      }
    }

    // Fallback to local file
    const fileContent = await fs.readFile(FEEDBACK_FILE, "utf-8");
    const data = JSON.parse(fileContent);
    console.log("Loaded feedback from local file");
    return data;
  } catch (error) {
    console.error("Error reading feedback:", error);
    return [];
  }
}

/**
 * Write feedback submissions to Vercel Blob and local file
 */
export async function writeFeedbackSubmissions(
  submissions: FeedbackSubmission[]
): Promise<void> {
  const jsonData = JSON.stringify(submissions, null, 2);

  try {
    // Write to Vercel Blob (production)
    if (BLOB_TOKEN) {
      const blob = await put(BLOB_PATHNAME, jsonData, {
        access: "private", // Keep feedback private for security
        token: BLOB_TOKEN,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      console.log(`Saved feedback to Vercel Blob: ${blob.url}`);
    } else {
      // Write to local file in development (no BLOB_TOKEN)
      await fs.writeFile(FEEDBACK_FILE, jsonData, "utf-8");
      console.log("Saved feedback to local file (development mode)");
    }
  } catch (error) {
    console.error("Error writing feedback:", error);
    throw error;
  }
}
