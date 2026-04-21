import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255),
  website: z.string().max(0).optional(),
  timestamp: z.number().optional(),
  source: z.enum(["hero", "footer", "email-confirmed", "digest"]).optional(),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
