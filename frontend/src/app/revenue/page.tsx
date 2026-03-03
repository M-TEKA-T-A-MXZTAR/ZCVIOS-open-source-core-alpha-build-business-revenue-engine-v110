"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RevenueState = {
  weekStart: string;
  currentRevenue: number | null;
  currentLever: string;
  recent: Array<{ weekStart: string; revenue: number; strategyTriggered: boolean }>;
};

const defaultState: RevenueState = {
  weekStart: "",
  currentRevenue: null,
  currentLever: "Distribution",
  recent: [],
};

export default function RevenuePage() {
  const [data, setData] = useState<RevenueState>(defaultState);
  const [revenue, setRevenue] = useState(0);
  const [note, setNote] = useState("");

  const load = async () => {
    const response = await fetch("/rpc/revenue");
    if (!response.ok) {
      toast.error("Unable to load weekly revenue.");
      return;
    }
    const payload = await response.json();
    setData(payload);
    setRevenue(payload.currentRevenue ?? 0);
  };

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/rpc/revenue");
      if (!response.ok) {
        toast.error("Unable to load weekly revenue.");
        return;
      }
      const payload = await response.json();
      setData(payload);
      setRevenue(payload.currentRevenue ?? 0);
    };

    run();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/rpc/revenue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revenue, note }),
    });

    if (!response.ok) {
      toast.error("Save failed.");
      return;
    }

    const payload = await response.json();
    toast.success(`Revenue saved. Lever: ${payload.strategy.selectedLever}`);
    await load();
  };

  return (
    <AppShell>
      <Card testId="revenue-entry-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Weekly revenue trigger</p>
        <h2 className="font-heading mt-2 text-3xl font-black" data-testid="revenue-page-heading">
          Weekly Revenue Entry
        </h2>
        <p className="mt-2 text-sm text-zinc-400" data-testid="revenue-page-description">
          Strategy agent runs only when this entry is saved.
        </p>

        <form className="mt-6 grid gap-4 md:grid-cols-3" onSubmit={submit} data-testid="revenue-entry-form">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Revenue ($)</label>
            <Input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              data-testid="revenue-input"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Note (optional)</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} data-testid="revenue-note-input" />
          </div>

          <div className="md:col-span-3 flex flex-wrap gap-3">
            <Button type="submit" data-testid="revenue-save-button">
              Save weekly revenue
            </Button>
            <div className="border border-zinc-800 px-4 py-2 text-sm" data-testid="current-lever-value">
              Current lever: {data.currentLever}
            </div>
          </div>
        </form>
      </Card>

      <Card testId="revenue-history-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Recent weeks</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm" data-testid="revenue-history-table">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-zinc-500">
                <th className="pb-2">Week Start</th>
                <th className="pb-2">Revenue</th>
                <th className="pb-2">Strategy Triggered</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((item) => (
                <tr key={item.weekStart} className="border-b border-zinc-900" data-testid="revenue-history-row">
                  <td className="py-3" data-testid="revenue-history-week-value">{new Date(item.weekStart).toLocaleDateString()}</td>
                  <td className="py-3" data-testid="revenue-history-revenue-value">${item.revenue.toFixed(2)}</td>
                  <td className="py-3" data-testid="revenue-history-trigger-value">{item.strategyTriggered ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
