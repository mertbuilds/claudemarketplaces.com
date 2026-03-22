import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Claude Code Plugin Marketplace",
  description: "Sign in to Claude Code Plugin Marketplace with GitHub or Google to vote, save favorites, and customize your experience.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
