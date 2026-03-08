import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Users, BarChart3, Megaphone, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise - Claude Code Marketplaces",
  description:
    "Advertise to a highly engaged audience of AI developers building with Claude Code. Reach developers actively using and creating Claude Code plugins and extensions.",
  openGraph: {
    title: "Advertise - Claude Code Marketplaces",
    description:
      "Advertise to a highly engaged audience of AI developers building with Claude Code.",
    url: "https://claudemarketplaces.com/advertise",
    type: "website",
  },
};

const pricingTiers = [
  {
    name: "All Placements",
    price: "$500/mo",
    description:
      "Includes every ad type below. Maximum visibility across the entire site.",
    highlighted: true,
  },
  {
    name: "Floating Banner",
    price: "$300/mo",
    description:
      "Persistent banner visible across all pages. Always in view as users browse.",
    highlighted: false,
  },
  {
    name: "In-Feed Cards",
    price: "$250/mo",
    description:
      "Native cards mixed into marketplace listings. Blends naturally with content.",
    highlighted: false,
  },
  {
    name: "Pinned Cards",
    price: "$200/mo",
    description:
      "Featured cards at the top of listings. First thing users see when browsing.",
    highlighted: false,
  },
  {
    name: "Job Listings",
    price: "$49/mo",
    description:
      "Post AI and developer job openings to reach qualified candidates.",
    highlighted: false,
  },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Why Advertise With Us */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Why Advertise With Us</CardTitle>
              </div>
              <CardDescription>
                Reach a niche audience of AI developers actively building with
                Claude Code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Claude Code Marketplaces is the go-to directory for developers
                discovering and building Claude Code plugins and extensions. Our
                audience isn&apos;t casual browsers — they&apos;re developers
                actively working with AI tools every day.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>Targeted reach</strong> to developers actively
                    building with AI
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>Growing community</strong> as Claude Code adoption
                    accelerates
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>High engagement</strong> niche audience with strong
                    intent
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Our Traffic */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary" />
                <CardTitle>Our Traffic</CardTitle>
              </div>
              <CardDescription>
                Live, public analytics data — fully transparent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full overflow-hidden rounded-lg border">
                <iframe
                  src="https://analytics.vinena.studio/share/overview/hwyH1d"
                  className="w-full border-0"
                  style={{ height: "600px" }}
                  title="Claude Code Marketplaces Analytics"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This is live, public analytics data powered by OpenPanel. What
                you see above is real-time traffic to claudemarketplaces.com.
              </p>
            </CardContent>
          </Card>

          {/* Ad Types & Pricing */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Megaphone className="h-6 w-6 text-primary" />
                <CardTitle>Ad Types &amp; Pricing</CardTitle>
              </div>
              <CardDescription>
                Simple, transparent pricing with no hidden fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pricingTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={cn(
                      "rounded-lg border p-4 space-y-2",
                      tier.highlighted
                        ? "border-primary bg-primary/5 md:col-span-2"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">
                        {tier.name}
                      </h4>
                      <span className="text-lg font-bold text-primary">
                        {tier.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                    {tier.highlighted && (
                      <p className="text-xs font-medium text-primary">
                        Best value — save over 40% vs. individual placements
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Get Started */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <CardTitle>Get Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ready to reach AI developers? Get in touch and we&apos;ll set up
                your campaign. We&apos;re happy to discuss custom packages and
                answer any questions about our audience.
              </p>
              <Button variant="default" asChild>
                <a
                  href="mailto:mert@duzgun.dev?subject=Advertising on Claude Code Marketplaces"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact: mert@duzgun.dev
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
