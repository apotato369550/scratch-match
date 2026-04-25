import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

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
        <form className="card p-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email Address</label>
            <input id="email" type="email" className="input" placeholder="you@example.ph" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between text-xs text-navy-700">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="accent-navy-700" /> Remember this device
            </label>
            <a href="#" className="hover:text-navy-900 underline-offset-2 hover:underline">Forgot password?</a>
          </div>
          <button type="button" className="btn-primary w-full">Sign in</button>
          <div className="divider-rule" />
          <p className="text-xs text-ink-soft">
            No account yet? <Link href="/signup" className="text-navy-800 underline">Register</Link>.
          </p>
        </form>
        <p className="text-[11px] text-navy-700 mt-4 text-center">
          By signing in you acknowledge that documents you upload are stored on the local host.
        </p>
      </section>
    </>
  );
}
