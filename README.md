# ZC-VIOS Core v1.1.1-alpha

> **ALPHA DISCLAIMER**
> This repository is an alpha template focused on core engine stability and reproducible local development.

## Architecture

- **Framework:** Next.js 16 (App Router) full-stack (API routes in `src/app/rpc/*`)
- **Database:** SQLite (Prisma ORM)
- **Auth:** NextAuth (email/password)
- **Route structure:** Authenticated pages under `(app)` route group with scoped SessionProvider

### App structure

```txt
src/app/
├── layout.tsx              # Minimal root layout (no providers)
├── global-error.tsx        # Minimal error boundary
├── page.tsx                # Landing page
├── login/                  # Public auth pages
├── register/
└── (app)/                  # Authenticated route group
    ├── layout.tsx          # SessionProvider wrapper
    ├── dashboard/
    ├── settings/
    ├── logs/
    ├── revenue/
    ├── onboarding/
    └── reports/
        ├── weekly/
        └── monthly/
```

## Local setup

1. Install dependencies
```bash
npm install
```

2. Create local environment file
```bash
cp .env.example .env.local
```

3. Generate Prisma client
```bash
npx prisma generate
```

4. Run database migrations
```bash
npx prisma migrate deploy
```

5. Seed demo data
```bash
npm run seed
```

6. Start development server
```bash
npm run dev
```

Open: `http://localhost:3000`

**Demo account:**
- Email: `demo@zcvios.local`
- Password: `DemoPass123!`

## Environment variables

Defined in `.env.example`:

```env
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**Notes:**
- Deterministic mode works without OpenAI key
- OpenAI is optional (BYO key per user in Settings)

## Verification

```bash
npm run lint      # ESLint
npm run build     # Production build
npm run test      # Integration tests (requires app running)
```

## CI workflow

The GitHub Actions workflow runs two jobs:

1. **Build & Verify** - Install, migrate, seed, lint, build
2. **Integration Tests** - Python pytest suite against running app (requires Build to pass)

## License

MIT
