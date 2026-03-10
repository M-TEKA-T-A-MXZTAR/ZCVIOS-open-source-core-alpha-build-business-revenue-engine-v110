# Architecture Principles

These principles guide development decisions for ZC-VIOS.

## 1. CI Discipline

### Build must pass before merge
- All PRs require passing Build & Verify job
- No force-merging around CI failures
- Fix the code, not the CI config (unless CI config is actually wrong)

### Separate concerns in CI
- Build verification (lint, compile, build) runs independently
- Integration tests run only after build passes
- Failures are isolated and identifiable

### Production parity in build
- `NODE_ENV=production` during build step
- DevDependencies available for lint/test
- No environment-specific workarounds that hide production issues

## 2. Route Structure Discipline

### Root layout stays minimal
- No providers in root layout
- No context dependencies that affect global-error rendering
- Children rendered directly

### Authenticated routes grouped
- All session-dependent pages under `(app)` route group
- SessionProvider scoped to `(app)/layout.tsx`
- Public pages (login, register, landing) outside the group

### Error boundaries isolated
- `global-error.tsx` is a minimal client component
- No imports that could fail during prerender
- No hooks, no providers, no external dependencies

### Route segment config
- Use `export const dynamic` where needed
- Understand that client components cannot use route segment config directly
- Server components handle static/dynamic decisions

## 3. Documentation Discipline

### Docs match code
- README reflects actual setup steps
- CHANGELOG updated with each release
- Release notes written for the actual changes made

### No speculative features
- Document what exists, not what might exist
- Future direction clearly labeled as "potential" or "under consideration"
- Roadmap distinguishes between planned and aspirational

### Developer-facing language
- No marketing copy in technical docs
- Concise, factual descriptions
- Code examples where helpful

## 4. Branch Discipline

### main is source of truth
- All stable code lives on main
- No long-lived feature branches
- PRs merge to main when CI passes

### No branch proliferation
- Delete branches after merge
- Avoid creating branches for minor fixes
- Use direct commits to main for docs-only changes when appropriate

### Clean git history
- Meaningful commit messages
- Squash when appropriate
- No merge commits from syncing branches

## 5. Dependency Discipline

### Deterministic fallback required
- Core functionality works without external APIs
- OpenAI is optional enhancement
- No hard dependencies on third-party services for basic operation

### Minimal dependency footprint
- Evaluate necessity before adding packages
- Prefer built-in solutions over libraries
- Remove unused dependencies

### Version pinning
- Use package-lock.json for reproducible installs
- Update dependencies intentionally, not automatically
- Test after dependency updates

## 6. Data Discipline

### Privacy by default
- Users can export all their data
- Users can delete all their data
- No data sharing without explicit consent

### Local-first development
- SQLite for development
- No external database required for local setup
- Seed data for immediate usability

### Schema changes are migrations
- No manual database modifications
- Prisma migrations for all schema changes
- Migrations are reversible where possible
