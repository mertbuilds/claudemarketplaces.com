import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ExternalLink, MapPin, Briefcase } from "lucide-react";
import { JOBS } from "@/lib/data/jobs";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Jobs - Claude Code Marketplaces",
  description:
    "Open roles for developers shipping with Claude Code. AI and engineering jobs surfaced to 110,000+ builders a month.",
  openGraph: {
    title: "Jobs - Claude Code Marketplaces",
    description:
      "Open roles for developers shipping with Claude Code. AI and engineering jobs surfaced to 110,000+ builders a month.",
    url: "https://claudemarketplaces.com/jobs",
    type: "website",
  },
};

const JOBS_CHECKOUT =
  "https://vinena.lemonsqueezy.com/checkout/buy/cb2daedf-c722-4c84-a5e9-c73ea375141f";

function formatPostedAt(iso: string): string {
  const posted = new Date(iso);
  const days = Math.floor(
    (Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default function JobsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-10 pb-6 md:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
                Jobs
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-normal mb-3 text-balance">
                Roles for developers shipping with Claude Code.
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl text-pretty">
                Hand-curated openings for AI engineers, founding engineers, and
                devtool builders. Every listing is vetted. Every applicant you
                get already works with Claude Code every day.
              </p>
            </div>
            <div className="border border-border p-5 md:p-6 w-full">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
                Hiring?
              </p>
              <p className="text-sm mb-4 text-pretty">
                List your role in front of 110,000+ Claude Code developers
                every month.
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-mono tabular-nums text-2xl font-medium">
                  $199
                </span>
                <span className="text-xs text-muted-foreground">
                  /mo per role
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={JOBS_CHECKOUT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-medium bg-foreground text-background px-4 py-2.5 hover:bg-foreground/90 active:scale-[0.96] transition-[colors,transform]"
                >
                  Post a role &rarr;
                </a>
                <Link
                  href="/advertise#placements"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Compare placements
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Listings */}
        <section className="container mx-auto px-4 pb-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">
              Open Roles{" "}
              <span className="font-mono tabular-nums text-foreground ml-1">
                {JOBS.length}
              </span>
            </h2>
            <div className="flex-1 border-t border-border" />
          </div>

          {JOBS.length === 0 ? (
            <div className="border border-border p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">
                <div className="max-w-xl">
                  <p className="font-serif text-lg md:text-xl font-normal mb-3 text-balance">
                    No open roles listed right now.
                  </p>
                  <p className="text-sm text-muted-foreground text-pretty mb-2">
                    We&apos;re onboarding hiring partners this month. If your
                    team is looking for engineers who already ship with Claude
                    Code, you&apos;re early.
                  </p>
                  <p className="text-sm text-muted-foreground text-pretty">
                    List a role and it goes live within hours, pinned in front
                    of every skill, marketplace, and MCP browser on the site.
                  </p>
                </div>
                <a
                  href={JOBS_CHECKOUT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium bg-foreground text-background px-5 py-2.5 hover:bg-foreground/90 active:scale-[0.96] transition-[colors,transform] shrink-0"
                >
                  Post a role &rarr;
                </a>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-px bg-border border border-border">
              {JOBS.map((job) => (
                <li key={job.id} className="bg-background">
                  <a
                    href={job.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 p-5 hover:bg-muted/20 transition-colors group"
                  >
                    {job.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="h-10 w-10 object-contain hidden md:block"
                      />
                    ) : (
                      <div className="h-10 w-10 border border-border items-center justify-center hidden md:flex">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium group-hover:underline">
                          {job.role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {job.company}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-pretty line-clamp-2 mb-2">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.remote ? `${job.location} (Remote)` : job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.employmentType}
                        </span>
                        {job.salary && (
                          <span className="font-mono tabular-nums">
                            {job.salary}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex md:flex-col items-start md:items-end justify-between md:justify-start gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground">
                        {formatPostedAt(job.postedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-primary group-hover:underline">
                        Apply <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer CTA */}
        <section className="container mx-auto px-4 pb-16">
          <div className="border border-border p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
              <div>
                <h2 className="font-serif text-lg md:text-xl font-normal mb-2 text-balance">
                  Hire from the people already using your tools.
                </h2>
                <p className="text-sm text-muted-foreground text-pretty max-w-xl">
                  Every visitor here installs Claude Code plugins, skills, and
                  MCP servers on a regular basis. They&apos;re the top of your
                  funnel whether you&apos;re hiring engineers or founding team.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <div>
                  <span className="font-mono tabular-nums text-2xl font-medium">
                    $199
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /mo per role
                  </span>
                </div>
                <a
                  href={JOBS_CHECKOUT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium bg-foreground text-background px-5 py-2.5 hover:bg-foreground/90 active:scale-[0.96] transition-[colors,transform]"
                >
                  Post a role &rarr;
                </a>
                <Link
                  href="/advertise"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Or see every placement &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
