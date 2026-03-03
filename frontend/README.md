# ZC-VIOS Core v1.1.0-alpha

ZC-VIOS is a browser-run revenue-per-hour acceleration system.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- NextAuth (credentials + optional Google OAuth)
- Prisma + SQLite
- Recharts

## Core logic implemented

- Weekly lever selection from one of: Distribution, Conversion, Pricing, Traffic, Retention, AssetBuild, Automation, Authority
- Strategy engine trigger **only when weekly revenue is saved**
- Daily mission generation on first login of day or regenerate
- Deterministic fallback when no OpenAI key exists
- Lever-first logging with optional full logging toggle
- Weekly and monthly reports with EHR, slope, stage, target range, projection, and neutral notes
- Monday/Tuesday cadence reminders with dashboard quick-entry modal for weekly revenue
- Weekly strategy signal inputs: traffic sessions, leads, closed sales, churned customers, gross margin %
- Weekly Review PDF export (weekly metrics + mission snapshot + lever override history)
- Pause mode, inactivity response, data export, and data deletion

## Environment variables

Copy `.env.local.example` to `.env.local` and update values:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace-with-long-secret"
NEXTAUTH_URL="http://localhost:3000/auth"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED="false"
```

Notes:
- Keep `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false` until Google credentials are set.
- OpenAI key is user-provided and stored encrypted per user in DB.

## Local setup

```bash
yarn install
yarn prisma db push
node prisma/seed.mjs
yarn dev
```

## Tests

```bash
REACT_APP_BACKEND_URL=http://localhost:3000 pytest -q /app/backend/tests/test_rpc_auth_guards.py /app/backend/tests/test_rpc_authenticated_flows.py /app/backend/tests/test_strategy_trigger_scope.py
```

CI workflow: `.github/workflows/ci.yml`

## Demo account

- Email: `demo@zcvios.local`
- Password: `DemoPass123!`

## Product rules

- Neutral tone, no gamification, no leaderboards
- User comparison only vs past self (4-week slope)
- Single weekly lever (manual override recorded)
- "We do not sell your data" policy appears in settings/export

## License

MIT
