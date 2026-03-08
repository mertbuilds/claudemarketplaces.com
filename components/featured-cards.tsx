import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Twitter, Megaphone, Code } from "lucide-react";

export function FeaturedCards() {
  return (
    <div className="mb-8">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Featured
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Follow on X */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Twitter className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                <Link
                  href="https://x.com/mertduzgun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0"
                >
                  Follow @mertduzgun
                </Link>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Stay updated with the latest Claude plugins and marketplace news.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Follow on X →
            </span>
          </CardHeader>
        </Card>

        {/* Card 2: Vinena Studio */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                <a
                  href="https://vinena.studio?referrer=claudemarketplaces.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0"
                >
                  Vinena Studio
                </a>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              AI-native engineering studio — from ex OpenPurpose and Atölye15 engineers.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Visit vinena.studio →
            </span>
          </CardHeader>
        </Card>

        {/* Card 3: Advertise */}
        <Card className="relative border-primary transition-all hover:shadow-lg hover:bg-primary/5">
          <CardHeader className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                <Link
                  href="/advertise"
                  className="after:absolute after:inset-0"
                >
                  Advertise Here
                </Link>
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Promote your developer tool or service to thousands of Claude Code
              users.
            </CardDescription>
            <span className="text-sm font-medium text-primary hover:underline mt-auto">
              Learn more →
            </span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
