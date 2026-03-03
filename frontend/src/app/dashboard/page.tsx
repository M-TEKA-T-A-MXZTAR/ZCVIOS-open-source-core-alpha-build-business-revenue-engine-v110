"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MissionState = {
  mission: {
    primaryTask: string;
    supportTask: string;
    doNotDoReminder: string;
    recommendedMinutes: number;
    startNowStep: string;
    successDefinition: string;
    source: string;
    lever: string;
    canUseAi: boolean;
  };
  inactivityLevel: number;
  isPaused: boolean;
  pauseUntil: string | null;
  weeklyRevenueMissing: boolean;
};

const defaultState: MissionState = {
  mission: {
    primaryTask: "Loading mission...",
    supportTask: "",
    doNotDoReminder: "",
    recommendedMinutes: 0,
    startNowStep: "",
    successDefinition: "",
    source: "TEMPLATE",
    lever: "Distribution",
    canUseAi: false,
  },
  inactivityLevel: 0,
  isPaused: false,
  pauseUntil: null,
  weeklyRevenueMissing: false,
};

export default function DashboardPage() {
  const [data, setData] = useState<MissionState>(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/rpc/mission");
      if (!response.ok) {
        toast.error("Unable to load mission.");
        setLoading(false);
        return;
      }
      const payload = await response.json();
      setData(payload);
      setLoading(false);
    };

    run();
  }, []);

  const regenerate = async () => {
    const response = await fetch("/rpc/mission", { method: "POST" });
    if (!response.ok) {
      toast.error("Regeneration failed.");
      return;
    }
    const payload = await response.json();
    setData((prev) => ({ ...prev, ...payload }));
    toast.success("Mission regenerated.");
  };

  return (
    <AppShell>
      <section className="grid gap-6 md:grid-cols-3" data-testid="dashboard-status-grid">
        <Card testId="dashboard-lever-card">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Weekly lever</p>
          <h2 className="font-heading mt-2 text-3xl font-black" data-testid="dashboard-current-lever-value">
            {data.mission.lever}
          </h2>
        </Card>
        <Card testId="dashboard-duration-card">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Recommended block</p>
          <h2 className="font-heading mt-2 text-3xl font-black" data-testid="dashboard-recommended-minutes-value">
            {data.mission.recommendedMinutes} min
          </h2>
        </Card>
        <Card testId="dashboard-source-card">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Mission source</p>
          <h2 className="font-heading mt-2 text-3xl font-black" data-testid="dashboard-mission-source-value">
            {data.mission.source}
          </h2>
        </Card>
      </section>

      {data.weeklyRevenueMissing && (
        <Card className="border-amber-500/50" testId="dashboard-revenue-missing-banner">
          <p className="text-sm text-amber-200" data-testid="dashboard-revenue-missing-text">
            Weekly revenue missing; EHR paused.
          </p>
        </Card>
      )}

      {data.inactivityLevel >= 3 && data.inactivityLevel < 7 && !data.isPaused && (
        <Card className="border-zinc-600" testId="dashboard-momentum-pause-banner">
          <p className="text-sm text-zinc-200" data-testid="dashboard-momentum-pause-text">
            Momentum pause detected.
          </p>
        </Card>
      )}

      {data.isPaused && (
        <Card className="border-blue-400/50" testId="dashboard-pause-banner">
          <p className="text-sm text-blue-200" data-testid="dashboard-pause-text">
            Pause mode active until {data.pauseUntil ? new Date(data.pauseUntil).toLocaleDateString() : "configured date"}.
          </p>
        </Card>
      )}

      <Card className="grid gap-5" testId="dashboard-mission-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Today&apos;s mission</p>
            <h2 className="font-heading mt-2 text-3xl font-black" data-testid="dashboard-primary-task-value">
              {loading ? "Loading..." : data.mission.primaryTask}
            </h2>
          </div>
          <Button
            variant="secondary"
            onClick={regenerate}
            disabled={!data.mission.canUseAi}
            data-testid="dashboard-regenerate-ai-button"
          >
            Regenerate AI
          </Button>
        </div>

        {!data.mission.canUseAi && (
          <p className="text-xs text-zinc-500" data-testid="dashboard-ai-disabled-note">
            AI mission regeneration is disabled until you add your OpenAI key in Settings.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2" data-testid="dashboard-mission-details-grid">
          <div className="border border-zinc-800 p-4" data-testid="dashboard-support-task-card">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Support task</p>
            <p className="mt-2 text-sm" data-testid="dashboard-support-task-value">
              {data.mission.supportTask || "None"}
            </p>
          </div>
          <div className="border border-zinc-800 p-4" data-testid="dashboard-start-now-card">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Start now step</p>
            <p className="mt-2 text-sm" data-testid="dashboard-start-now-value">
              {data.mission.startNowStep}
            </p>
          </div>
          <div className="border border-zinc-800 p-4" data-testid="dashboard-do-not-do-card">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Do not do</p>
            <p className="mt-2 text-sm" data-testid="dashboard-do-not-do-value">
              {data.mission.doNotDoReminder}
            </p>
          </div>
          <div className="border border-zinc-800 p-4" data-testid="dashboard-success-definition-card">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Success definition</p>
            <p className="mt-2 text-sm" data-testid="dashboard-success-definition-value">
              {data.mission.successDefinition}
            </p>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
