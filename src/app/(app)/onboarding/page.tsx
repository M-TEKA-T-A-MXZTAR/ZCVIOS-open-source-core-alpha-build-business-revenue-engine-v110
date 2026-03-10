"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = {
  businessUrl: string;
  socialLinks: string;
  businessDescription: string;
  businessType: "service" | "product" | "digital" | "hybrid" | "unknown";
  hoursAvailablePerWeek: number;
  weeklyRevenue: number;
  targetMonthlyIncome: number;
  targetMaxHoursPerWeek: number;
  consistencyWindowMonths: number;
  fullLoggingEnabled: boolean;
  commandMode: boolean;
};

const defaultState: FormState = {
  businessUrl: "",
  socialLinks: "",
  businessDescription: "",
  businessType: "unknown",
  hoursAvailablePerWeek: 40,
  weeklyRevenue: 0,
  targetMonthlyIncome: 10000,
  targetMaxHoursPerWeek: 35,
  consistencyWindowMonths: 6,
  fullLoggingEnabled: false,
  commandMode: true,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [state, setState] = useState<FormState>(defaultState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/rpc/onboarding")
        .then((res) => res.json())
        .then((data) => {
          setState({
            ...defaultState,
            ...data,
            socialLinks: (data.socialLinks ?? []).join(","),
          });
        })
        .catch(() => {
          toast.error("Unable to load onboarding data.");
        });
    }
  }, [router, status]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/rpc/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...state,
        socialLinks: state.socialLinks
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });

    if (!response.ok) {
      toast.error("Onboarding update failed.");
      setLoading(false);
      return;
    }

    toast.success("Onboarding saved.");
    router.push("/dashboard");
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100 md:px-12">
      <form onSubmit={submit} className="mx-auto grid w-full max-w-6xl gap-8 border border-zinc-800 bg-zinc-900/70 p-8" data-testid="onboarding-form">
        <h1 className="font-heading text-4xl font-black tracking-tight" data-testid="onboarding-heading">
          Onboarding
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Business URL</label>
            <Input
              value={state.businessUrl}
              onChange={(e) => update("businessUrl", e.target.value)}
              data-testid="onboarding-business-url-input"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Social Links (comma separated)</label>
            <Input
              value={state.socialLinks}
              onChange={(e) => update("socialLinks", e.target.value)}
              data-testid="onboarding-social-links-input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Business Description</label>
            <textarea
              className="min-h-24 w-full border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-100 focus:border-zinc-300 focus:outline-none"
              value={state.businessDescription}
              onChange={(e) => update("businessDescription", e.target.value)}
              data-testid="onboarding-business-description-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Business Type</label>
            <select
              className="h-10 w-full border border-zinc-700 bg-zinc-950 px-3 text-sm"
              value={state.businessType}
              onChange={(e) => update("businessType", e.target.value as FormState["businessType"])}
              data-testid="onboarding-business-type-select"
            >
              <option value="service">Service</option>
              <option value="product">Product</option>
              <option value="digital">Digital</option>
              <option value="hybrid">Hybrid</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Hours Available / Week</label>
            <Input
              type="number"
              value={state.hoursAvailablePerWeek}
              onChange={(e) => update("hoursAvailablePerWeek", Number(e.target.value))}
              data-testid="onboarding-hours-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Weekly Revenue</label>
            <Input
              type="number"
              value={state.weeklyRevenue}
              onChange={(e) => update("weeklyRevenue", Number(e.target.value))}
              data-testid="onboarding-weekly-revenue-input"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Target Monthly Income</label>
            <Input
              type="number"
              value={state.targetMonthlyIncome}
              onChange={(e) => update("targetMonthlyIncome", Number(e.target.value))}
              data-testid="onboarding-target-monthly-income-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Target Max Hours / Week</label>
            <Input
              type="number"
              value={state.targetMaxHoursPerWeek}
              onChange={(e) => update("targetMaxHoursPerWeek", Number(e.target.value))}
              data-testid="onboarding-target-hours-input"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">Consistency Window (months)</label>
            <Input
              type="number"
              value={state.consistencyWindowMonths}
              onChange={(e) => update("consistencyWindowMonths", Number(e.target.value))}
              data-testid="onboarding-consistency-window-input"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between border border-zinc-700 p-3 text-sm" data-testid="full-logging-toggle-row">
            Full logging mode
            <input
              type="checkbox"
              checked={state.fullLoggingEnabled}
              onChange={(e) => update("fullLoggingEnabled", e.target.checked)}
              data-testid="full-logging-toggle"
            />
          </label>
          <label className="flex items-center justify-between border border-zinc-700 p-3 text-sm" data-testid="command-mode-toggle-row">
            Command mode
            <input
              type="checkbox"
              checked={state.commandMode}
              onChange={(e) => update("commandMode", e.target.checked)}
              data-testid="command-mode-toggle"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading} data-testid="onboarding-save-button">
            {loading ? "Saving..." : "Save onboarding"}
          </Button>
          <Button variant="ghost" data-testid="onboarding-skip-button" onClick={() => router.push("/dashboard")}>Skip for now</Button>
        </div>
      </form>
    </div>
  );
}
