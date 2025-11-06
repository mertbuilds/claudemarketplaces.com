import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email("Please enter a valid email address").max(255),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  website: z.string().max(0).optional(), // Honeypot (must be empty)
  timestamp: z.number().optional(), // For rate limiting
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export interface FeedbackSubmission {
  id: string;
  name?: string;
  email: string;
  message: string;
  submittedAt: string;
  userAgent?: string;
}
