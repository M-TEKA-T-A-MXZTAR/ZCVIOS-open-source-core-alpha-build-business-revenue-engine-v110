# ZC-VIOS Core v1.1.0-alpha (Template)

> **ALPHA DISCLAIMER**
> This is an alpha template focused on core engine behavior. It is intended for local development, validation, and iterative improvement.

ZC-VIOS converts weekly revenue intent into a single weekly lever and concise daily mission system.

## What this alpha includes

- Email/password auth (working locally)
- Deterministic core mode (no OpenAI key required)
- Optional OpenAI field and optional Google OAuth placeholders
- Weekly revenue trigger → strategy lever selection
- Daily mission rendering + manual logging
- Weekly + monthly reports with charts
- Privacy controls (export + delete account/data)
- Seeded demo account and data timeline

## Repository structure

```txt
/frontend   Next.js App Router + Prisma + SQLite app
/backend    Python test suite for API/regression checks
/memory     Build notes / PRD snapshot
```

## Quick start (npm-first)

From repo root:

```bash
npm install
npm run db:push
npm run seed
npm run dev
```

Then open `http://localhost:3000`.

Demo login:
- `demo@zcvios.local`
- `DemoPass123!`

## Environment variables

Copy:

```bash
cp frontend/.env.example frontend/.env.local
```

Required variables:

- `DATABASE_URL` (SQLite for local)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Optional add-ons (placeholders only in alpha):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`

OpenAI is BYO per-user via Settings UI and is **optional**.

## Deterministic mode (no external integrations)

This app runs end-to-end without OpenAI and without Google OAuth.

- If no OpenAI key is saved, missions and strategy use deterministic templates/heuristics.
- Google OAuth stays disabled until env values are explicitly set.

## Core definition-of-done coverage

1. `npm install && npm run dev` launches usable app.
2. User can sign up / sign in via email-password.
3. Weekly revenue save triggers strategy and sets weekly lever.
4. Daily mission renders and logs can be created.
5. Weekly/monthly reports render charts.
6. Export data works.
7. Delete account/data works.
8. Deterministic mode works with no external keys.
9. OpenAI + Google are documented as optional placeholders.

## Tests

Run full regression (includes auth guards, strategy trigger scope, deterministic flows):

```bash
npm run test
```

Run privacy-focused checks (export + delete path):

```bash
npm run test:privacy
```

## Build

```bash
npm run build
```

## Optional add-on notes

- **OpenAI (optional)**: user enters API key in Settings; no key required for core operation.
- **Google OAuth (optional)**: fill Google env vars + enable flag; otherwise credentials auth remains primary.

## License

MIT
