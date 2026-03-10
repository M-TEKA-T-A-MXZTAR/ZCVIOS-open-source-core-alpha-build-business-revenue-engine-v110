# Contributing

Thanks for contributing to **ZC-VIOS Core**.

## Development setup

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

## Before opening a PR

1. Keep changes focused and small.
2. Preserve deterministic fallback behavior (no mandatory external integrations).
3. Run verification:

```bash
npm run lint
npm run build
```

4. If modifying authenticated pages, ensure they remain under the `(app)` route group.

## CI requirements

PRs must pass both CI jobs:
- **Build & Verify** - lint and production build
- **Integration Tests** - pytest suite against running app

## Coding expectations

- Neutral product language (no gamification/shaming)
- One-lever weekly discipline in core logic
- Do not introduce hard dependency on OpenAI or Google OAuth
- Keep privacy controls (export/delete) functional
- Authenticated pages belong in `src/app/(app)/`
- Keep root layout and global-error minimal

## PR description checklist

- What changed
- Why it changed
- How it was tested
- Any migration/seed impact
