# Contributing

Thanks for contributing to **ZC-VIOS Core**.

## Branch Strategy

- **main** is the stable source of truth
- All contributions go through pull requests to main
- No long-lived feature branches

## Development Setup

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

## Before Opening a PR

1. Keep changes focused and small
2. Preserve deterministic fallback behavior (no mandatory external integrations)
3. Run verification:

```bash
npm run lint
npm run build
```

4. If modifying authenticated pages, ensure they remain under the `(app)` route group

## Workflow Options

### Option A: Local Development
1. Fork the repository
2. Clone your fork
3. Create a branch from main
4. Make changes
5. Run `npm run lint` and `npm run build`
6. Push and open a PR

### Option B: Emergent Platform
When using Emergent as the primary editing workflow:
1. Make changes through the Emergent interface
2. Emergent handles commits and pushes
3. Review changes in GitHub
4. Merge when CI passes

## CI Requirements

PRs must pass both CI jobs:
- **Build & Verify** - lint and production build
- **Integration Tests** - pytest suite against running app

## Coding Expectations

- Neutral product language (no gamification/shaming)
- One-lever weekly discipline in core logic
- Do not introduce hard dependency on OpenAI or Google OAuth
- Keep privacy controls (export/delete) functional
- Authenticated pages belong in `src/app/(app)/`
- Keep root layout and global-error minimal

## PR Description Checklist

- What changed
- Why it changed
- How it was tested
- Any migration/seed impact
- Docs updated if needed

## Questions?

Open an issue or see [docs/SUPPORT.md](docs/SUPPORT.md) for contact options.
