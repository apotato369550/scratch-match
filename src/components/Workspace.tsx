import { TopNav, type NavItem } from "./SideNav";

export const seekerNav: NavItem[] = [
  { href: "/seeker/dashboard", label: "Dashboard" },
  { href: "/seeker/cvs", label: "My CVs" },
  { href: "/seeker/cvs/upload", label: "Upload CV" },
  { href: "/seeker/matches", label: "Matches" },
  { href: "/seeker/jobs", label: "Search Jobs" },
  { href: "/seeker/chat", label: "Career Advisor" },
];

export const employerNav: NavItem[] = [
  { href: "/employer/dashboard", label: "Dashboard" },
  { href: "/employer/jobs", label: "My Postings" },
  { href: "/employer/jobs/new", label: "Post a Job" },
  { href: "/employer/candidates", label: "Candidates" },
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
  navTitle: _navTitle,
  nav,
  children,
}: {
  navTitle?: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav items={nav} />
      <section className="mx-auto max-w-7xl px-6 py-10 space-y-6">{children}</section>
    </>
  );
}
