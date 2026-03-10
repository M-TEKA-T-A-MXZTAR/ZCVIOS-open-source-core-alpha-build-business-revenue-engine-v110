# Roadmap

## Current Stable

**v1.1.1-alpha** (March 2026)

### What was stabilized
- CI/build pipeline restructured into separate Build and Integration Test jobs
- Next.js prerender failures resolved for global-error boundary
- Authenticated pages moved under `(app)` route group with scoped SessionProvider
- Root layout simplified to minimal implementation
- Documentation updated to match actual codebase state

### Core features operational
- Email/password authentication
- Weekly lever selection (deterministic + optional AI)
- Daily mission generation
- Work session logging
- Weekly and monthly EHR reports
- Privacy controls (data export, account deletion)

---

## Next Milestone

**v1.2.0** - Creator Engine Foundations

### Planned work
- Refine strategy selection algorithm based on real usage patterns
- Improve mission quality for each lever type
- Add week-over-week comparison in reports
- Strengthen test coverage for edge cases
- Performance optimization for report generation

### Under consideration
- Webhook notifications for weekly plan changes
- CSV export for work logs
- Dark mode toggle

---

## Future Direction

**VIOS Operator System** - Longer-term vision

### Potential areas of exploration
- Multi-user support for small teams
- Integration with external revenue sources (Stripe, payment processors)
- Predictive EHR modeling based on historical patterns
- Mobile-optimized interface for daily logging
- API access for third-party integrations

### Design principles that will guide future work
- One lever per week remains the core constraint
- EHR stays the north star metric
- Deterministic mode always works without external dependencies
- Privacy controls remain first-class features
- No gamification or shame-based motivation

---

## Contributing to the Roadmap

Feature suggestions are welcome. Open an issue using the feature request template.

Prioritization considers:
- Alignment with core philosophy (one lever, EHR focus)
- Impact on existing users
- Implementation complexity
- Maintenance burden
