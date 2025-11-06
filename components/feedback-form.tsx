"use client";

import { useState, type FormEvent } from "react";
import { feedbackSchema } from "@/lib/schemas/feedback.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [website, setWebsite] = useState(""); // Honeypot
  const [timestamp] = useState(Date.now()); // Form load time
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Client validation
    const result = feedbackSchema.safeParse({
      ...formData,
      website,
      timestamp,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMap: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value && value.length > 0) {
          errorMap[key] = value[0];
        }
      });
      setErrors(errorMap);
      setIsSubmitting(false);
      return;
    }

    // Submit to API
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        // Try to parse error message
        try {
          const data = await response.json();
          setErrors({
            general: data.error || "Failed to submit feedback. Please try again.",
          });
        } catch {
          setErrors({
            general: `Server error (${response.status}). Please try again later.`,
          });
        }
        return;
      }

      const data = await response.json();
      setIsSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Alert className="border-primary/20 bg-primary/5">
        <CheckCircle2 className="text-primary" />
        <AlertTitle>Thank you for your feedback!</AlertTitle>
        <AlertDescription>
          <p className="mb-3">
            We appreciate you taking the time to share your thoughts. Your
            feedback helps us improve Claude Code Marketplaces for everyone.
          </p>
          <Button
            onClick={() => {
              setIsSuccess(false);
              setErrors({});
              setFormData({ name: "", email: "", message: "" });
            }}
            variant="outline"
            size="sm"
          >
            Submit another feedback
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name (optional)</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          disabled={isSubmitting}
          required
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your struggles while working with Claude Code so we can find ways to help you solve them..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          disabled={isSubmitting}
          required
          rows={6}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Feedback"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We're committed to protecting your privacy. Your feedback will be used
        solely to improve our service.
      </p>
    </form>
  );
}
