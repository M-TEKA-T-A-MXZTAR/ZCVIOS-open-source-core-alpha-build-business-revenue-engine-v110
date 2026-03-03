"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/rpc/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      toast.error("Unable to create account. Check your inputs.");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    toast.success("Account created.");
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100 md:px-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2">
        <section className="border border-zinc-800 bg-zinc-950/90 p-8" data-testid="register-intro-panel">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500" data-testid="register-version-label">
            Operator Setup
          </p>
          <h1 className="font-heading mt-4 text-4xl font-black tracking-tight" data-testid="register-heading">
            Create your operator account
          </h1>
          <p className="mt-4 text-sm text-zinc-400" data-testid="register-description-text">
            Use email/password now. You can enable Google OAuth later from environment settings.
          </p>
        </section>

        <form onSubmit={onSubmit} className="border border-zinc-800 bg-zinc-900/70 p-8" data-testid="register-form">
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="register-name-input"
          />

          <label className="mb-2 mt-5 block text-xs uppercase tracking-[0.15em] text-zinc-500" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="register-email-input"
          />

          <label className="mb-2 mt-5 block text-xs uppercase tracking-[0.15em] text-zinc-500" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            data-testid="register-password-input"
          />

          <div className="mt-6 flex gap-3">
            <Button type="submit" disabled={loading} data-testid="register-submit-button">
              {loading ? "Creating..." : "Create account"}
            </Button>
          </div>

          <p className="mt-6 text-sm text-zinc-400" data-testid="login-navigation-text">
            Already have access?{" "}
            <Link href="/login" className="text-zinc-100 underline" data-testid="login-navigation-link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
