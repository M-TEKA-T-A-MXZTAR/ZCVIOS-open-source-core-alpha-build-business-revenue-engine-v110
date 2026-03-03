# Changelog

All notable changes to this project are documented in this file.

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
