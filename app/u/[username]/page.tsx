"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MOCK_DEV_PROFILE,
  MOCK_DEV_USERNAME,
  isDevPreview,
} from "@/lib/supabase/dev-preview";
import {
  getProfileByUsername,
  type Profile,
} from "@/lib/supabase/profile";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (isDevPreview() && username === MOCK_DEV_USERNAME) {
        setProfile(MOCK_DEV_PROFILE);
        setLoading(false);
        return;
      }
      const data = await getProfileByUsername(username);
      setProfile(data);
      setLoading(false);
    };
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="inline-flex items-center gap-2 border border-border bg-secondary/50 px-2.5 py-1 mb-8">
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
                Not found
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4 tracking-tight text-balance">
              No author <span className="italic">here</span>.
            </h1>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              There&apos;s no one at /u/{username}. Could be a typo, or they
              haven&apos;t signed up yet.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const name = profile.full_name || profile.username;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const joinedLabel = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Author chip */}
          <div className="inline-flex items-center gap-2 border border-border bg-secondary/50 px-2.5 py-1 mb-8">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
              Author
            </span>
          </div>

          {/* Author masthead */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 pb-8 mb-10 border-b border-border">
            <Avatar className="h-24 w-24 rounded-none border-2 border-primary shrink-0">
              <AvatarImage src={profile.avatar_url || undefined} alt={name} />
              <AvatarFallback className="rounded-none text-2xl bg-background">
                {initials || <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-serif text-4xl md:text-5xl font-normal mb-2 tracking-tight text-balance leading-tight">
                {name}
              </h1>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="text-sm text-muted-foreground font-mono">
                  @{profile.username}
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Joined {joinedLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Contributions placeholder — quiet typographic empty state */}
          <div>
            <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Contributions
              </p>
            </div>
            <div className="py-12 flex flex-col items-center text-center">
              <p className="font-serif italic text-xl md:text-2xl font-normal text-muted-foreground mb-2">
                Nothing yet.
              </p>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Votes, bookmarks, and comments will show up here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
