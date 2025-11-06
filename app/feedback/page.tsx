import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackForm } from "@/components/feedback-form";

export const metadata: Metadata = {
  title: "Feedback - Claude Code Marketplaces",
  description:
    "Share your feedback about Claude Code Marketplaces. Tell us about your struggles while working with Claude Code so we can find ways to help you solve them.",
  openGraph: {
    title: "Feedback - Claude Code Marketplaces",
    description:
      "Help us improve Claude Code Marketplaces by sharing your feedback and experiences.",
    url: "https://claudemarketplaces.com/feedback",
    type: "website",
  },
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header subtitle="" showAboutLink={false} />

      <main className="flex-1">
        <Navigation />
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">We'd Love Your Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-muted-foreground">
                  We're committed to making Claude Code Marketplaces as helpful
                  as possible. Your feedback helps us understand what's working
                  well and where we can improve.
                </p>
                <p className="text-muted-foreground">
                  Tell us about your struggles while working with Claude Code so
                  we can find ways to help you solve them. Whether it's a bug,
                  a feature request, or just a thought about how we can make
                  things better — we're open to all feedback.
                </p>
              </div>

              <FeedbackForm />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
