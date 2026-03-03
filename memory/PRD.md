# ZC-VIOS Core v1.1.0-alpha — PRD Snapshot

## Original Problem Statement
Build a web-based, browser-run application called “ZC-VIOS Core v1.1.0-alpha” as a revenue-per-hour acceleration system that converts user intent into a daily execution plan. Core principles include: EHR as central metric, one weekly lever only, command-mode-first daily mission, neutral non-gamified language, pause mode, strategy trigger only on weekly revenue save, and deterministic fallback when no AI key exists.

## User Choices Confirmed
- Strict stack migration requested: **Next.js + TypeScript + Tailwind + Prisma + SQLite**
- Auth scope: **email/password active now + Google OAuth placeholder mode**
- AI key mode: **BYO OpenAI key persisted per user**
- UI mode: **minimal command-center**
- Seed data: **demo account + 6 weeks realistic sample data**

## Architecture Decisions
- Frontend/backend merged into Next.js App Router with route handlers under `/rpc/*`.
- NextAuth implemented on custom path `/auth/[...nextauth]` (credentials + optional Google when env is set).
- Prisma 7 + SQLite with Better-SQLite adapter; strict env usage (`DATABASE_URL` required).
- Data model is multi-user (team-capable at schema level) without complex team UI.
- AI flow:
  - Strategy prompt + execution prompt embedded as strict JSON templates.
  - Strategy run triggered only during weekly revenue save route.
  - Execution mission generated on first login/day or regenerate.
  - If no user API key, deterministic mission/strategy fallback is used.

## Implemented Features
- Auth: register + login + session + logout; Google button disabled unless env configured.
- Onboarding: create/update/delete profile and business fields.
- Weekly Lever System: one lever/week with neutral reasoning + manual override tracking.
- Daily Mission: command-mode mission cards with support task/start-now/do-not-do/success definition.
- Manual Logging: lever-focused categories by default; maintenance/drift controlled by full logging setting.
- Weekly Revenue Entry: save revenue and run strategy trigger.
- Monday/Tuesday cadence UX: persistent reminder banner + dashboard quick-entry modal (non-blocking).
- Strategy signal capture on revenue save: traffic sessions, leads, closed sales, churned customers, gross margin %.
- Metrics/Reports:
  - Lever EHR, total EHR (when full logging enabled), 4-week slope
  - Stage and target range with momentum status
  - Conditional projection range
  - Weekly + monthly report views with charts
- Weekly Review PDF export: weekly metrics + mission snapshot + lever override history.
- Drift + pause/inactivity handling:
  - Drift captured from logs and reflected in strategy adjustment
  - Pause mode (1 week, 2 weeks, custom date)
  - Momentum pause banner and reset mission behavior
- Privacy/Data control:
  - Export all structured user data
  - Full account data deletion
  - Policy text: “We do not sell your data.”
- Seed/demo data included (`demo@zcvios.local / DemoPass123!`).
- CI pipeline added (`.github/workflows/ci.yml`) with build, seed, and RPC integration tests.
- Pre-release full QA sweep completed with blocker fixes:
  - Fixed logout/delete redirect to stay on deployed domain (no localhost redirect)
  - Blocked future-dated logs in `/rpc/logs`
  - Clamped inactivity level to never go below 0
  - Added authenticated regression test for future-date log rejection
  - Re-validated Monday/Tuesday reminder banner scenario with fresh account preconditions

## Prioritized Backlog

### P0 (Critical)
- Add CSRF/session hardening checks around automated credential callback test path.
- Add deterministic strategy trace fields (which rule fired) for auditability in weekly report.
- Add server-side PDF endpoint option for non-browser automation/export jobs.

### P1 (Important)
- Add Insight Mode UI toggle and compact interpretation panel while keeping neutral tone.
- Improve monthly report with selectable date windows and downloadable CSV summaries.
- Add encrypted key rotation timestamp and optional key validation check.

### P2 (Enhancement)
- Add lightweight multi-member workspace switcher (data-level support already exists).
- Add optional market benchmark panel as secondary metric.
- Add localization framework and timezone-aware week boundaries.

## Next Tasks
1. Add AI response audit log per strategy/mission generation (without storing sensitive API keys).
2. Add richer trend diagnostics (execution consistency bands and drift streak timeline).
3. Add stricter CSRF/session hardening checks and security regression tests.
4. Extend CI with browser-level smoke run for PDF export + reminder modal.

