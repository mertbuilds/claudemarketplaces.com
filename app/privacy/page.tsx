import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy - Claude Code Marketplaces",
  description:
    "Privacy policy for Claude Code Marketplaces. Learn about data collection, GitHub API usage, and how we handle user information.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header subtitle="" showAboutLink={true} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last Updated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Claude Code Marketplaces (&quot;we&quot;, &quot;our&quot;, or &quot;the site&quot;) is committed
                to protecting your privacy. This privacy policy explains how we collect, use, and
                safeguard information when you visit claudemarketplaces.com.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Key Point:</strong> We do not collect, store, or process any personal
                information from site visitors. This site is a read-only directory that displays
                publicly available information from GitHub.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Information We Do Not Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We do <strong>not</strong> collect the following:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Personal identification information (name, email, address)</li>
                <li>Account credentials or passwords</li>
                <li>Payment or financial information</li>
                <li>User-generated content or comments</li>
                <li>Cookies for tracking purposes</li>
                <li>Device fingerprinting data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data We Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Public GitHub Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Our automated system accesses the following <strong>public</strong> information
                  from GitHub:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Repository URLs and names</li>
                  <li>
                    Marketplace metadata (from{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      .claude-plugin/marketplace.json
                    </code>{" "}
                    files)
                  </li>
                  <li>Repository descriptions</li>
                  <li>GitHub star counts</li>
                  <li>Plugin descriptions and categories</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                This information is already publicly available on GitHub and is accessed through
                GitHub&apos;s official API for the sole purpose of cataloging Claude Code plugin
                marketplaces. We do not access private repositories or any non-public data.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use <strong>Vercel Analytics</strong> to understand basic usage patterns and
                improve the site. Vercel Analytics is privacy-focused and does not use cookies or
                collect personally identifiable information.
              </p>
              <p className="text-sm text-muted-foreground">
                Vercel Analytics collects:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Page views and basic navigation patterns</li>
                <li>Referrer information (where visitors came from)</li>
                <li>Device type (desktop, mobile, tablet)</li>
                <li>Geographic region (country-level only)</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                For more information, see{" "}
                <a
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Vercel&apos;s Privacy Policy
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>GitHub API Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our automated system uses the GitHub API to search for and retrieve information about
                public repositories containing Claude Code marketplace files. This happens on our
                servers and does not involve any user data or authentication from site visitors.
              </p>
              <p className="text-sm text-muted-foreground">
                The GitHub API usage is subject to{" "}
                <a
                  href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub&apos;s Privacy Statement
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This site contains links to external websites, including:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>GitHub repositories for each marketplace</li>
                <li>Official Anthropic and Claude documentation</li>
                <li>Plugin marketplace repositories</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We are not responsible for the privacy practices of these external sites. We recommend
                reviewing their privacy policies before interacting with them.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Since we do not collect or store personal information, there is minimal security risk
                to users. The public GitHub data we display is cached temporarily and updated daily
                through automated processes.
              </p>
              <p className="text-sm text-muted-foreground">
                Our site is hosted on Vercel with industry-standard security measures including HTTPS
                encryption for all connections.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Children&apos;s Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This site does not collect personal information from anyone, including children under
                the age of 13. The site is a public directory of technical resources and does not
                require registration or user accounts.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update this privacy policy from time to time. Any changes will be posted on
                this page with an updated &quot;Last Updated&quot; date. We encourage you to review
                this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about this privacy policy, please contact:
              </p>
              <p className="text-sm">
                <a
                  href="mailto:mert@duzgun.dev?subject=Privacy Policy Question"
                  className="text-primary hover:underline"
                >
                  mert@duzgun.dev
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
