# ZC-VIOS Core v1.1.0-alpha — GitHub Stabilization Pass

## Goal
Prepare a clean, reproducible GitHub-ready alpha template aligned to Next.js + Prisma + SQLite architecture.

## Implemented Alignment
- Consolidated repository into a root Next.js full-stack structure.
- Root contains required alpha files and minimal structure:
  - `/prisma`, `/src`, `/public`, `/tests`
  - `.env.example`, `README.md`, `CHANGELOG.md`, `RELEASE_NOTES_v1.1.0-alpha.md`, `package.json`
- Added root Prisma schema models required for alpha alignment:
  - `User`, `WeeklyRevenue`, `WorkLogSession`, `WeeklyPlan`, `FreedomDefinition`
- Added migration baseline in `/prisma/migrations`.
- Kept deterministic mode behavior and optional integration placeholders (OpenAI/Google OAuth).

## Validation Summary
- `npm install` successful
- `npx prisma migrate dev` successful (fresh DB path)
- `npm run seed` successful
- `npm run build` successful (with `.env.local` copied from `.env.example`)
- Local integration suite passes against running app:
  - `28 passed` full regression
  - `1 passed` privacy export/delete test subset

## User-facing DoD Coverage
1. Local setup reproducible from fresh clone
2. Email/password signup/signin works
3. Weekly revenue save triggers strategy selection
4. Daily mission rendering + work logging works
5. Weekly/monthly reports render with charts
6. Export data works
7. Delete account/data works
8. Deterministic mode runs without OpenAI key
9. OpenAI + Google OAuth documented as optional placeholders only

