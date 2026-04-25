import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const sections: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Public",
    links: [
      { href: "/", label: "Home" },
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Register" },
      { href: "/onboarding/seeker", label: "Seeker Onboarding" },
      { href: "/onboarding/employer", label: "Employer Onboarding" },
      { href: "/sitemap", label: "Sitemap" },
    ],
  },
  {
    title: "Job Seeker",
    links: [
      { href: "/seeker/dashboard", label: "Dashboard" },
      { href: "/seeker/cvs", label: "My CVs" },
      { href: "/seeker/cvs/upload", label: "Upload CV" },
      { href: "/seeker/matches", label: "Matches" },
      { href: "/seeker/jobs", label: "Search Jobs" },
      { href: "/seeker/jobs/1", label: "Job Detail (sample)" },
      { href: "/seeker/chat", label: "Career Advisor" },
    ],
  },
  {
    title: "Employer",
    links: [
      { href: "/employer/dashboard", label: "Dashboard" },
      { href: "/employer/jobs", label: "My Postings" },
      { href: "/employer/jobs/new", label: "Post a Job" },
      { href: "/employer/candidates", label: "Candidates" },
      { href: "/employer/seekers", label: "Search Seekers" },
      { href: "/employer/chat", label: "Hiring Assistant" },
    ],
  },
  {
    title: "Administrator",
    links: [
      { href: "/admin", label: "Console" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/jobs", label: "Jobs" },
      { href: "/admin/cvs", label: "CVs" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Directory"
        title="Sitemap"
        description="Every page in the prototype, grouped by audience. Use this to navigate during demos."
        crumbs={[{ label: "Home", href: "/" }, { label: "Sitemap" }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {sections.map((s) => (
          <div key={s.title} className="card p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gold-600">{s.title}</div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-navy-800 hover:text-navy-900 hover:underline underline-offset-2">
                    {l.label}
                  </Link>
                  <span className="ml-2 font-mono text-[10px] text-navy-700">{l.href}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
