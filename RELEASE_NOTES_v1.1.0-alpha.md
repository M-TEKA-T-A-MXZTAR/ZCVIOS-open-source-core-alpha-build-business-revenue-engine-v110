# ZC-VIOS Core v1.1.0-alpha

## Release type
Alpha template release focused on core engine stability and local developer usability.

## What’s included
- Repository aligned to clean Next.js full-stack root layout for GitHub release
- Email/password auth and onboarding CRUD
- Deterministic strategy + mission flow without OpenAI key
- Weekly revenue trigger for strategy selection (single weekly lever)
- Daily mission rendering and manual logging
- Weekly + monthly reports with charts
- Privacy controls: data export + account/data delete
- Weekly Review PDF export
- Optional placeholders for OpenAI and Google OAuth (not required for core operation)

## Local quick-start
```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Demo account:
- `demo@zcvios.local`
- `DemoPass123!`

## Validation status
- Build: passing
- Regression tests: passing (`28 passed`)
- Privacy destructive flow test: passing

## Environment variables
Use placeholders from:
- `.env.example`

Required for local run:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Optional add-ons:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Known alpha boundaries
- Production go-live hardening is out of scope for this alpha template.
- OpenAI and Google OAuth are intentionally optional in this release.

## Suggested release tag
`v1.1.0-alpha`
