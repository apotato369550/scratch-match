import { PageHeader } from "@/components/PageHeader";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <>
      <PageHeader
        eyebrow="New Registration"
        title="Register with Scratch Match"
        description="Choose the role that applies to you. Administrator accounts are not issued through this form."
        crumbs={[{ label: "Home", href: "/" }, { label: "Register" }]}
      />
      <section className="mx-auto max-w-3xl px-4 py-10">
        <SignupForm />
      </section>
    </>
  );
}
