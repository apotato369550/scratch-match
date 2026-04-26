"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"seeker" | "employer">("seeker");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!accepted) return setError("You must accept the terms to continue.");

    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push(role === "employer" ? "/onboarding/employer" : "/onboarding/seeker");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Email Address</label>
          <input
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.ph"
          />
        </div>
        <div>
          <label className="label">Account Type</label>
          <select
            className="select"
            value={role}
            onChange={(e) => setRole(e.target.value as "seeker" | "employer")}
          >
            <option value="seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            required
            minLength={8}
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input
            type="password"
            required
            className="input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>
      <label className="flex items-start gap-2 text-xs text-navy-700">
        <input
          type="checkbox"
          className="mt-0.5 accent-navy-700"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        I confirm I am a resident of, or operate within, the Province of Cebu and accept the
        terms of this prototype service.
      </label>
      {error && <p className="text-sm text-seal-700">{error}</p>}
      <div className="flex items-center justify-between gap-3">
        <Link href="/login" className="text-xs text-navy-800 underline">Already registered?</Link>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "Registering…" : "Continue to onboarding"}
        </button>
      </div>
    </form>
  );
}
