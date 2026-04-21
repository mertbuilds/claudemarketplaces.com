"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  MOCK_DEV_PROFILE,
  isDevPreview,
} from "@/lib/supabase/dev-preview";
import {
  getProfileByUserId,
  updateProfile,
  type Profile,
} from "@/lib/supabase/profile";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isDevPreview()) {
          setProfile(MOCK_DEV_PROFILE);
          setUsername(MOCK_DEV_PROFILE.username);
          setFullName(MOCK_DEV_PROFILE.full_name ?? "");
          setIsMock(true);
          setLoading(false);
          return;
        }
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
    if (!profile || isMock) return;
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
    if (isMock) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

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

  if (!profile) return null;

  const name = profile.full_name || profile.username;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Status chip */}
          <div
            className={
              isMock
                ? "inline-flex items-center gap-2 border border-border bg-secondary/50 px-2.5 py-1 mb-8"
                : "inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 mb-8"
            }
          >
            <Github
              className={
                isMock
                  ? "h-3 w-3 text-muted-foreground"
                  : "h-3 w-3 text-primary"
              }
              strokeWidth={2.5}
            />
            <span
              className={
                isMock
                  ? "text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium"
                  : "text-[10px] uppercase tracking-[0.14em] text-primary font-medium"
              }
            >
              {isMock ? "Dev preview" : "Signed in"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4 tracking-tight text-balance">
            Your <span className="italic">account</span>.
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mb-10 leading-relaxed">
            Edit how you appear across Claude Code Marketplaces.
          </p>

          {/* Identity masthead */}
          <div className="border border-border p-6 md:p-7 mb-8 bg-secondary/40">
            <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Identity
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                /u/{profile.username}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16 rounded-none border-2 border-primary">
                <AvatarImage src={profile.avatar_url || undefined} alt={name} />
                <AvatarFallback className="rounded-none text-lg bg-background">
                  {initials || <User className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-serif text-2xl font-normal leading-tight text-balance">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  @{profile.username}
                </p>
              </div>
            </div>
          </div>

          {/* Edit card */}
          <div className="border border-border p-6 md:p-7 mb-8">
            <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Edit
              </p>
              {isMock && (
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Saves disabled
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-xs text-muted-foreground"
                >
                  Username
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-mono">
                    /u/
                  </span>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, ""),
                      )
                    }
                    placeholder="username"
                    disabled={isMock}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-xs text-muted-foreground"
                >
                  Full name
                </label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  disabled={isMock}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {success && (
                <p className="text-sm text-primary">Saved.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <Button
              onClick={handleSave}
              disabled={saving || isMock}
              className="group gap-2 px-6 w-full sm:w-auto"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  Save changes
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
            <button
              onClick={handleSignOut}
              disabled={isMock}
              className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left sm:text-center"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
