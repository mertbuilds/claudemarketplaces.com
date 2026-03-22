"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getProfileByUserId, updateProfile, type Profile } from "@/lib/supabase/profile";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const p = await getProfileByUserId(user.id);
      if (p) {
        setProfile(p);
        setUsername(p.username);
        setFullName(p.full_name || "");
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { data, error: err } = await updateProfile(profile.id, {
      username,
      full_name: fullName,
    });

    if (err) {
      setError(err);
    } else if (data) {
      setProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

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

  if (!profile) return null;

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
        <h1 className="mb-8 font-[family-name:var(--font-bbh-sans)] text-2xl tracking-wide">
          PROFILE SETTINGS
        </h1>

        <div className="space-y-8">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-none border-2 border-primary">
              <AvatarImage src={profile.avatar_url || undefined} alt={name} />
              <AvatarFallback className="rounded-none text-lg">
                {initials || <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/u/</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="username"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Feedback */}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">Saved!</p>}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
