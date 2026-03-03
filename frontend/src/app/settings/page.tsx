"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ApiState = { hasKey: boolean; last4: string | null };
type PauseState = { isPaused: boolean; pauseUntil: string | null };

export default function SettingsPage() {
  const router = useRouter();
  const [apiState, setApiState] = useState<ApiState>({ hasKey: false, last4: null });
  const [pauseState, setPauseState] = useState<PauseState>({ isPaused: false, pauseUntil: null });
  const [apiKey, setApiKey] = useState("");
  const [customPauseDate, setCustomPauseDate] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const load = async () => {
    const [keyRes, pauseRes] = await Promise.all([fetch("/rpc/openai-key"), fetch("/rpc/pause")]);
    if (keyRes.ok) setApiState(await keyRes.json());
    if (pauseRes.ok) setPauseState(await pauseRes.json());
  };

  useEffect(() => {
    const run = async () => {
      const [keyRes, pauseRes] = await Promise.all([fetch("/rpc/openai-key"), fetch("/rpc/pause")]);
      if (keyRes.ok) setApiState(await keyRes.json());
      if (pauseRes.ok) setPauseState(await pauseRes.json());
    };

    run();
  }, []);

  const saveApiKey = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/rpc/openai-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      toast.error("Unable to save key.");
      return;
    }

    setApiKey("");
    toast.success("OpenAI key saved.");
    await load();
  };

  const removeApiKey = async () => {
    const response = await fetch("/rpc/openai-key", { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to remove key.");
      return;
    }
    toast.success("OpenAI key removed.");
    await load();
  };

  const setPause = async (mode: "1week" | "2weeks" | "custom" | "resume") => {
    const response = await fetch("/rpc/pause", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, customDate: customPauseDate }),
    });

    if (!response.ok) {
      toast.error("Unable to update pause mode.");
      return;
    }

    toast.success(mode === "resume" ? "Pause cleared." : "Pause mode updated.");
    await load();
  };

  const exportData = async () => {
    const response = await fetch("/rpc/data-export");
    if (!response.ok) {
      toast.error("Unable to export data.");
      return;
    }
    const payload = await response.json();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zcvios-export.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Data export downloaded.");
  };

  const deleteData = async () => {
    const response = await fetch("/rpc/data-delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: deleteConfirmation }),
    });

    if (!response.ok) {
      toast.error("Type DELETE to confirm.");
      return;
    }

    toast.success("Data deleted.");
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <AppShell>
      <Card testId="settings-openai-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">AI key management</p>
        <h2 className="font-heading mt-2 text-3xl font-black" data-testid="settings-openai-heading">
          OpenAI API Key (BYO)
        </h2>
        <p className="mt-2 text-sm text-zinc-400" data-testid="settings-openai-status-text">
          {apiState.hasKey ? `Key saved (ending ${apiState.last4}).` : "No key saved. AI features use deterministic fallback."}
        </p>

        <form onSubmit={saveApiKey} className="mt-4 flex flex-wrap gap-3" data-testid="settings-openai-form">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="max-w-md"
            data-testid="settings-openai-input"
          />
          <Button type="submit" data-testid="settings-openai-save-button">Save key</Button>
          <Button variant="ghost" onClick={removeApiKey} data-testid="settings-openai-remove-button">
            Remove key
          </Button>
        </form>
      </Card>

      <Card testId="settings-pause-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Pause mode</p>
        <p className="mt-2 text-sm text-zinc-300" data-testid="settings-pause-status-text">
          {pauseState.isPaused
            ? `Paused until ${pauseState.pauseUntil ? new Date(pauseState.pauseUntil).toLocaleDateString() : "configured date"}`
            : "Not paused"}
        </p>
        <div className="mt-4 flex flex-wrap gap-3" data-testid="settings-pause-actions">
          <Button onClick={() => setPause("1week")} data-testid="settings-pause-1week-button">Pause 1 week</Button>
          <Button variant="secondary" onClick={() => setPause("2weeks")} data-testid="settings-pause-2weeks-button">
            Pause 2 weeks
          </Button>
          <Input
            type="date"
            value={customPauseDate}
            onChange={(e) => setCustomPauseDate(e.target.value)}
            className="max-w-xs"
            data-testid="settings-pause-custom-date-input"
          />
          <Button variant="ghost" onClick={() => setPause("custom")} data-testid="settings-pause-custom-button">
            Pause until date
          </Button>
          <Button variant="ghost" onClick={() => setPause("resume")} data-testid="settings-resume-button">
            Resume now
          </Button>
        </div>
      </Card>

      <Card testId="settings-onboarding-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Onboarding data</p>
        <p className="mt-2 text-sm text-zinc-300" data-testid="settings-onboarding-text">
          View and edit onboarding values any time.
        </p>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => router.push("/onboarding")} data-testid="settings-edit-onboarding-button">
            Edit onboarding
          </Button>
        </div>
      </Card>

      <Card testId="settings-privacy-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Privacy and data control</p>
        <p className="mt-2 text-sm text-zinc-300" data-testid="settings-privacy-statement-text">
          We do not sell your data.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={exportData} data-testid="settings-export-button">Export data</Button>
        </div>

        <div className="mt-6 border border-red-400/40 p-4" data-testid="settings-delete-section">
          <p className="text-sm text-red-200" data-testid="settings-delete-warning-text">
            Delete all account data (irreversible).
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="max-w-xs"
              data-testid="settings-delete-confirmation-input"
            />
            <Button variant="danger" onClick={deleteData} data-testid="settings-delete-button">
              Delete data
            </Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
