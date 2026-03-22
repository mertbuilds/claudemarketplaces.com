import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | Claude Code Plugin Marketplace",
  description: "Manage your Claude Code Plugin Marketplace profile settings.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
