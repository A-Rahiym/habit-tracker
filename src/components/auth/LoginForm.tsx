"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/src/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-surface border border-border p-6 shadow-sm">
          <div className="space-y-1 mb-5">
            <h1 className="text-xl font-semibold">Welcome Back</h1>
            <p className="text-sm text-text-secondary">
              Good to see you again. Keep building your habits, one day at a time.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="auth-login-email" className="text-sm font-medium text-text-primary">
                Email
              </label>
              <input
                id="auth-login-email"
                data-testid="auth-login-email"
                className="w-full rounded-full bg-muted-surface border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/25"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="auth-login-password" className="text-sm font-medium text-text-primary">
                Password
              </label>
              <input
                id="auth-login-password"
                data-testid="auth-login-password"
                className="w-full rounded-full bg-muted-surface border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/25"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-danger">
                {error}
              </div>
            )}

            <button
              data-testid="auth-login-submit"
              className="w-full rounded-full bg-primary text-white font-semibold py-3 hover:opacity-95 active:opacity-90 transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <div className="mt-5 text-sm">
            <span className="text-text-secondary">
              Don’t have an account?{" "}
            </span>
            <Link className="text-primary hover:underline" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

