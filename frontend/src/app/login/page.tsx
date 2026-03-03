"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@zcvios.local");
  const [password, setPassword] = useState("DemoPass123!");
  const [loading, setLoading] = useState(false);
  const googleConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      toast.error("Login failed. Check credentials.");
      setLoading(false);
      return;
    }

    toast.success("Session started.");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100 md:px-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2">
        <section className="border border-zinc-800 bg-zinc-950/90 p-8" data-testid="login-intro-panel">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500" data-testid="login-version-label">
            Command Mode
          </p>
          <h1 className="font-heading mt-4 text-4xl font-black tracking-tight" data-testid="login-heading">
            Login to ZC-VIOS
          </h1>
          <p className="mt-4 text-sm text-zinc-400" data-testid="login-demo-credentials-text">
            Demo credentials: demo@zcvios.local / DemoPass123!
          </p>
        </section>

        <form onSubmit={onSubmit} className="border border-zinc-800 bg-zinc-900/70 p-8" data-testid="login-form">
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="login-email-input"
          />

          <label className="mb-2 mt-5 block text-xs uppercase tracking-[0.15em] text-zinc-500" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="login-password-input"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="submit" disabled={loading} data-testid="login-submit-button">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              variant="secondary"
              disabled={!googleConfigured}
              data-testid="google-login-button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Google OAuth
            </Button>
          </div>

          {!googleConfigured && (
            <p className="mt-3 text-xs text-zinc-500" data-testid="google-login-disabled-note">
              Google OAuth is currently disabled until GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured.
            </p>
          )}

          <p className="mt-6 text-sm text-zinc-400" data-testid="register-navigation-text">
            New here?{" "}
            <Link href="/register" className="text-zinc-100 underline" data-testid="register-navigation-link">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
