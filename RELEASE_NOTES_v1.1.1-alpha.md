# ZC-VIOS Core v1.1.1-alpha Release Notes

## Release type
Patch release focused on CI/build stabilization and architecture cleanup.

## What changed

### CI workflow
- Restructured into two jobs: **Build & Verify** and **Integration Tests**
- Build job must pass before tests run
- Fixed ESLint availability by removing job-level NODE_ENV=production
- NODE_ENV=production now only set for the build step

### Architecture
- Authenticated pages moved under `(app)` route group
- SessionProvider scoped to `(app)/layout.tsx` only
- Root layout simplified to render children directly
- Global error boundary simplified to minimal client component

### Build fixes
- Resolved Next.js prerender failures on `/_global-error`
- Fixed `useSession()` context errors during static generation
- Eliminated `useContext` null errors during CI build

## Upgrade path

If upgrading from v1.1.0-alpha:
- No database migrations required
- No environment variable changes required
- Route paths unchanged (route group is transparent to URLs)

## Validation status
- Build: passing
- Lint: passing
- Integration tests: passing

## Known boundaries
- Production deployment hardening is out of scope
- OpenAI and Google OAuth remain optional
