# ZC-VIOS Core v1.1.0-alpha

> **ALPHA DISCLAIMER**
> This repository is an alpha template focused on core engine stability and reproducible local development.

## Architecture (aligned)

- **Framework:** Next.js (App Router) full-stack (API routes in `src/app/rpc/*`)
- **Database:** SQLite
- **ORM:** Prisma (`/prisma/schema.prisma`)
- **Auth:** NextAuth (email/password active, Google OAuth optional placeholder)

## Repository structure (minimal alpha)

```txt
/prisma
/src
/public
/tests
.env.example
README.md
CHANGELOG.md
RELEASE_NOTES_v1.1.0-alpha.md
package.json
```

## Local setup (fresh clone)

1) Install dependencies
```bash
npm install
```

2) Create local environment file
```bash
cp .env.example .env.local
```
Set a value for `NEXTAUTH_SECRET` in `.env.local` before running auth flows.

3) Run Prisma migration
```bash
npx prisma migrate dev
```

4) Seed demo data
```bash
npm run seed
```

5) Start app
```bash
npm run dev
```

Open: `http://localhost:3000`

Demo account:
- Email: `demo@zcvios.local`
- Password: `DemoPass123!`

## Environment variables

Defined in `.env.example`:

```env
NODE_ENV=development
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
```

Notes:
- **Deterministic mode works without OpenAI key.**
- **Google OAuth is optional** (placeholder only in alpha).

## Validation targets (alpha)

- Email/password signup + login works.
- Weekly revenue entry triggers strategy selection (single weekly lever).
- Daily mission renders and work sessions can be logged.
- Weekly + monthly reports render with charts.
- Privacy controls work: export data + delete account/data.

## Tests

Keep the app running (`npm run dev`) in one terminal, then run tests in another.

Full regression:
```bash
npm run test
```

Privacy-only path:
```bash
npm run test:privacy
```

## Non-goals for this alpha pass

- Production deployment steps
- Custom domain configuration
- Forced OAuth go-live integration

## License

MIT
