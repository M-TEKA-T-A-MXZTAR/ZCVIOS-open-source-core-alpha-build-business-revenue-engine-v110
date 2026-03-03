"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Report = {
  revenue: number;
  leverEhr: number;
  totalEhr: number;
  fullLoggingEnabled: boolean;
  slope: number;
  targetRange: { min: number; max: number; guidance: string };
  momentum: string;
  stage: string;
  projection: { low: number; high: number };
  lever: string;
  bottleneckNote: string;
  growthStatus: string;
  executionStatus: string;
  driftStatus: string;
  allocationAdjustment: string;
  chartData: Array<{ week: string; revenue: number; ehr: number }>;
};

const levers = [
  "Distribution",
  "Conversion",
  "Pricing",
  "Traffic",
  "Retention",
  "AssetBuild",
  "Automation",
  "Authority",
] as const;

export default function WeeklyReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [overrideLever, setOverrideLever] = useState<(typeof levers)[number]>("Distribution");
  const [reason, setReason] = useState("");

  const load = async () => {
    const response = await fetch("/rpc/reports/weekly");
    if (!response.ok) {
      toast.error("Unable to load weekly report.");
      return;
    }
    const payload = await response.json();
    setReport(payload);
    setOverrideLever(payload.lever);
  };

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/rpc/reports/weekly");
      if (!response.ok) {
        toast.error("Unable to load weekly report.");
        return;
      }
      const payload = await response.json();
      setReport(payload);
      setOverrideLever(payload.lever);
    };

    run();
  }, []);

  const submitOverride = async () => {
    const response = await fetch("/rpc/lever-override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedLever: overrideLever, reason }),
    });

    if (!response.ok) {
      toast.error("Unable to override lever.");
      return;
    }

    toast.success("Manual override recorded.");
    await load();
  };

  return (
    <AppShell>
      <Card testId="weekly-report-header-card">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Weekly report</p>
        <h2 className="font-heading mt-2 text-3xl font-black" data-testid="weekly-report-heading">
          Weekly Performance Summary
        </h2>
      </Card>

      {report && (
        <>
          <section className="grid gap-6 md:grid-cols-3" data-testid="weekly-report-metrics-grid">
            <Card testId="weekly-report-revenue-card">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Revenue</p>
              <p className="font-heading mt-2 text-3xl font-black" data-testid="weekly-report-revenue-value">
                ${report.revenue.toFixed(2)}
              </p>
            </Card>
            <Card testId="weekly-report-lever-ehr-card">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Lever EHR</p>
              <p className="font-heading mt-2 text-3xl font-black" data-testid="weekly-report-lever-ehr-value">
                ${report.leverEhr}/h
              </p>
            </Card>
            <Card testId="weekly-report-slope-card">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">4-week slope</p>
              <p className="font-heading mt-2 text-3xl font-black" data-testid="weekly-report-slope-value">
                {report.slope}%
              </p>
            </Card>
          </section>

          <Card testId="weekly-report-chart-card">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Trend chart</p>
            <div className="mt-4 h-72" data-testid="weekly-report-trend-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.chartData}>
                  <XAxis dataKey="week" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip />
                  <Line dataKey="ehr" stroke="#fafafa" strokeWidth={2} dot={false} />
                  <Line dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="grid gap-4 md:grid-cols-2" testId="weekly-report-summary-card">
            <div data-testid="weekly-report-stage-row">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Stage</p>
              <p className="mt-1 text-lg" data-testid="weekly-report-stage-value">{report.stage}</p>
            </div>
            <div data-testid="weekly-report-target-row">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Target range</p>
              <p className="mt-1 text-lg" data-testid="weekly-report-target-value">
                {report.targetRange.min}% to {report.targetRange.max}%
              </p>
            </div>
            <div data-testid="weekly-report-momentum-row">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Momentum status</p>
              <p className="mt-1 text-lg" data-testid="weekly-report-momentum-value">{report.momentum}</p>
            </div>
            <div data-testid="weekly-report-projection-row">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Projection (conditional)</p>
              <p className="mt-1 text-lg" data-testid="weekly-report-projection-value">
                ${report.projection.low} - ${report.projection.high} EHR
              </p>
            </div>
            <div className="md:col-span-2" data-testid="weekly-report-bottleneck-row">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Bottleneck note</p>
              <p className="mt-1 text-sm text-zinc-300" data-testid="weekly-report-bottleneck-value">{report.bottleneckNote}</p>
            </div>
          </Card>

          <Card testId="weekly-report-override-card">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Lever reconsideration</p>
            <p className="mt-2 text-sm text-zinc-400" data-testid="weekly-report-neutral-evaluation-text">
              System evaluation: growth {report.growthStatus}, execution {report.executionStatus}, drift {report.driftStatus},
              allocation {report.allocationAdjustment}.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_2fr_auto]">
              <select
                value={overrideLever}
                onChange={(e) => setOverrideLever(e.target.value as (typeof levers)[number])}
                className="h-10 border border-zinc-700 bg-zinc-950 px-3 text-sm"
                data-testid="weekly-report-override-lever-select"
              >
                {levers.map((lever) => (
                  <option key={lever} value={lever}>{lever}</option>
                ))}
              </select>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-10 border border-zinc-700 bg-zinc-950 px-3 text-sm"
                placeholder="Optional reason"
                data-testid="weekly-report-override-reason-input"
              />
              <Button onClick={submitOverride} data-testid="weekly-report-override-submit-button">
                Record override
              </Button>
            </div>
          </Card>
        </>
      )}
    </AppShell>
  );
}
