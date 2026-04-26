import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account Access"
        title="Sign in to Scratch Match"
        description="Use the credentials issued during registration. Single admin account is seeded server-side."
        crumbs={[{ label: "Home", href: "/" }, { label: "Sign in" }]}
      />
      <section className="mx-auto max-w-md px-4 py-10">
        <LoginForm />
        <p className="text-[11px] text-navy-700 mt-4 text-center">
          By signing in you acknowledge that documents you upload are stored on the local host.
        </p>
        <p className="text-xs text-ink-soft mt-3 text-center">
          No account yet? <Link href="/signup" className="text-navy-800 underline">Register</Link>.
        </p>
      </section>
    </>
  );
}
