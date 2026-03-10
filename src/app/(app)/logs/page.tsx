"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Log = {
  id: string;
  date: string;
  minutes: number;
  category: "LEVER" | "ASSET_BUILD" | "MAINTENANCE" | "DRIFT";
  completed: boolean;
  note: string | null;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [minutes, setMinutes] = useState(60);
  const [category, setCategory] = useState<Log["category"]>("LEVER");
  const [completed, setCompleted] = useState(true);
  const [note, setNote] = useState("");

  const load = async () => {
    const response = await fetch("/rpc/logs");
    if (!response.ok) {
      toast.error("Unable to load logs.");
      return;
    }
    const payload = await response.json();
    setLogs(payload);
  };

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/rpc/logs");
      if (!response.ok) {
        toast.error("Unable to load logs.");
        return;
      }
      const payload = await response.json();
      setLogs(payload);
    };

    run();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/rpc/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, minutes, category, completed, note }),
    });

    if (!response.ok) {
      const payload = await response.json();
      toast.error(payload.error ?? "Unable to save log.");
      return;
    }

    toast.success("Log saved.");
    setNote("");
    await load();
  };

  return (
    <AppShell>
      <Card testId="log-entry-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Manual Logging</p>
        <h2 className="font-heading mt-2 text-3xl font-black" data-testid="logs-page-heading">
          Log Execution
        </h2>
        <p className="mt-2 text-sm text-zinc-400" data-testid="logs-page-description">
          Default mode accepts lever-focused categories only. Enable full logging in settings to include maintenance and
          drift.
        </p>

        <form className="mt-6 grid gap-4 md:grid-cols-3" onSubmit={submit} data-testid="log-entry-form">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} data-testid="log-date-input" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Minutes</label>
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              data-testid="log-minutes-input"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Log["category"])}
              className="h-10 w-full border border-zinc-700 bg-zinc-950 px-3 text-sm"
              data-testid="log-category-select"
            >
              <option value="LEVER">LEVER</option>
              <option value="ASSET_BUILD">ASSET_BUILD</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="DRIFT">DRIFT</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Note</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} data-testid="log-note-input" />
          </div>

          <label className="flex items-center justify-between border border-zinc-700 px-4 py-2 text-sm" data-testid="log-completed-toggle-row">
            Completed
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              data-testid="log-completed-toggle"
            />
          </label>

          <div className="md:col-span-3">
            <Button type="submit" data-testid="log-save-button">Save log</Button>
          </div>
        </form>
      </Card>

      <Card testId="logs-history-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Recent logs</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-sm" data-testid="logs-history-table">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-zinc-500">
                <th className="pb-2">Date</th>
                <th className="pb-2">Minutes</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Completed</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-zinc-900" data-testid="logs-history-row">
                  <td className="py-3" data-testid="log-row-date-value">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="py-3" data-testid="log-row-minutes-value">{log.minutes}</td>
                  <td className="py-3" data-testid="log-row-category-value">{log.category}</td>
                  <td className="py-3" data-testid="log-row-completed-value">{log.completed ? "Yes" : "No"}</td>
                  <td className="py-3" data-testid="log-row-note-value">{log.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
