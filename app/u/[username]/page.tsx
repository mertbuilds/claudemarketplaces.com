"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { getProfileByUsername, type Profile } from "@/lib/supabase/profile";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getProfileByUsername(username);
      setProfile(data);
      setLoading(false);
    };
    load();
  }, [username]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <p className="text-muted-foreground">User not found</p>
        </div>
        <Footer />
      </>
    );
  }

  const name = profile.full_name || profile.username;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-lg px-4 py-12">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 rounded-none border-2 border-primary">
            <AvatarImage src={profile.avatar_url || undefined} alt={name} />
            <AvatarFallback className="rounded-none text-xl">
              {initials || <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-[family-name:var(--font-bbh-sans)] text-2xl tracking-wide">
              {name}
            </h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
