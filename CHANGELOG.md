# Changelog

All notable changes to this project are documented in this file.

## v1.1.1-alpha - 2026-03-10

### CI/Build stabilization
- Fixed Next.js prerender failures for global-error boundary
- Restructured CI workflow into separate Build and Integration Test jobs
- Fixed ESLint not found error by scoping NODE_ENV=production to build step only
- Resolved merge conflicts and consolidated branch to main

### Architecture changes
- Moved authenticated pages under `(app)` route group
- Scoped SessionProvider to `(app)/layout.tsx` instead of root layout
- Simplified `global-error.tsx` to minimal client component
- Root layout now renders children directly without provider wrappers

### Files changed
- `.github/workflows/ci.yml` - Restructured CI pipeline
- `src/app/layout.tsx` - Removed Providers wrapper
- `src/app/global-error.tsx` - Minimal implementation
- `src/app/(app)/layout.tsx` - New layout with SessionProvider
- `src/app/(app)/*` - Moved authenticated pages here

---

## v1.1.0-alpha - 2026-03-03

### Stabilization alignment (GitHub-ready)
- Consolidated repository to a standard Next.js full-stack root structure.
- Moved API/regression tests into `/tests`.
- Added root `.env.example` for reproducible local setup.
- Added root Prisma migration baseline and schema alignment models:
  `User`, `WeeklyRevenue`, `WorkLogSession`, `WeeklyPlan`, `FreedomDefinition`.
- Removed legacy scaffolding folders used only for internal build iteration.

### Added
- Root npm-first workflow for local development (`npm install`, `npm run dev`, `npm run build`, `npm run test`).
- GitHub-ready project docs and hygiene files:
  - Full root `README.md`
  - `CONTRIBUTING.md`
  - Root `.env.example`
- Alpha disclaimers in README and in-app UI banner.
- Weekly signal inputs in revenue workflow (traffic, leads, sales, churn, margin).
- Weekly Review PDF export including report metrics, mission snapshot, and override history.
- Authenticated privacy regression coverage for export + destructive delete flow.

### Changed
- Strategy context now accepts optional weekly business signals.
- Logout/delete sign-out behavior updated to keep redirect on the deployed domain.
- Recharts containers hardened with minimum dimensions to reduce render noise.

### Fixed
- Blocked future-dated manual logs that could corrupt inactivity logic.
- Clamped inactivity level to prevent negative values.
- Removed localhost redirect issue in sign-out flows.

### Notes
- OpenAI and Google OAuth are intentionally optional for alpha.
- Deterministic mode is fully operational without external integrations.
