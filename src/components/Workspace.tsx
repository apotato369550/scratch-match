import { SideNav, type NavItem } from "./SideNav";

export const seekerNav: NavItem[] = [
  { href: "/seeker/dashboard", label: "Dashboard", hint: "Overview & activity" },
  { href: "/seeker/cvs", label: "My CVs", hint: "Up to 5 per specialization" },
  { href: "/seeker/cvs/upload", label: "Upload CV" },
  { href: "/seeker/matches", label: "Matches", hint: "Auto-ranked openings" },
  { href: "/seeker/jobs", label: "Search Jobs" },
  { href: "/seeker/chat", label: "Career Advisor", hint: "RAG-powered chat" },
];

export const employerNav: NavItem[] = [
  { href: "/employer/dashboard", label: "Dashboard" },
  { href: "/employer/jobs", label: "My Postings", hint: "Up to 5 active jobs" },
  { href: "/employer/jobs/new", label: "Post a Job" },
  { href: "/employer/candidates", label: "Candidates", hint: "Per-job ranked seekers" },
  { href: "/employer/seekers", label: "Search Seekers" },
  { href: "/employer/chat", label: "Hiring Assistant" },
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Console" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/cvs", label: "CVs" },
];

export function Workspace({
  navTitle,
  nav,
  children,
}: {
  navTitle: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-[16rem_1fr] gap-6">
      <SideNav title={navTitle} items={nav} />
      <div className="min-w-0 space-y-6">{children}</div>
    </section>
  );
}
