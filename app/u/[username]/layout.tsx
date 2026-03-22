import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile | Claude Code Plugin Marketplace",
  description: "View user profile on Claude Code Plugin Marketplace.",
};

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
