# Changelog

All notable changes to this project are documented in this file.

## v1.1.0-alpha - 2026-03-03

### Added
- Root npm-first workflow for local development (`npm install`, `npm run dev`, `npm run build`, `npm run test`).
- GitHub-ready project docs and hygiene files:
  - Full root `README.md`
  - `CONTRIBUTING.md`
  - `.env.example` (root + frontend)
- Alpha disclaimers in README and in-app UI banner.
- Weekly signal inputs in revenue workflow (traffic, leads, sales, churn, margin).
- Weekly Review PDF export including report metrics, mission snapshot, and override history.
- CI workflow (`.github/workflows/ci.yml`) for install/build/test checks.
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
