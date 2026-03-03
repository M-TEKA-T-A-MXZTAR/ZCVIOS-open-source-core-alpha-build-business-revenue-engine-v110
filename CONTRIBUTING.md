# Contributing (Alpha)

Thanks for contributing to **ZC-VIOS Core v1.1.0-alpha**.

## Development setup

```bash
npm install
npm run db:push
npm run seed
npm run dev
```

## Before opening a PR

1. Keep changes focused and small.
2. Preserve deterministic fallback behavior (no mandatory external integrations).
3. Run:

```bash
npm run lint
npm run build
npm run test
```

## Coding expectations

- Neutral product language (no gamification/shaming).
- One-lever weekly discipline in core logic.
- Do not introduce hard dependency on OpenAI or Google OAuth.
- Keep privacy controls (export/delete) functional.

## PR description checklist

- What changed
- Why it changed
- How it was tested
- Any migration/seed impact
