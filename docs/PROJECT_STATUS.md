# ZC-VIOS Project Status

## Current Release

**Version:** v1.1.1-alpha  
**Date:** March 10, 2026  
**Purpose:** Stabilization of CI pipeline, build system, and repository architecture

This release focused on resolving Next.js prerender failures, restructuring the CI workflow into separate build and test jobs, and organizing authenticated routes under a dedicated route group with scoped SessionProvider.

## Current Capabilities

What currently works:

- Stable Next.js 16 application with App Router architecture
- Email/password authentication via NextAuth
- Weekly lever selection (deterministic rules, optional AI enhancement)
- Daily mission generation based on active lever
- Work session logging with category tracking
- Weekly and monthly EHR (Effective Hourly Rate) reports
- Privacy controls: data export and account deletion
- PDF export for weekly reviews
- Verified CI pipeline with separate build and integration test jobs
- Comprehensive documentation system

## Repository Health

| Item | Status |
|------|--------|
| CI passing | ✅ |
| main branch stable | ✅ |
| Documentation aligned with code | ✅ |
| Release tagged | ✅ v1.1.1-alpha-ZCVIOS |
| Contributor guidelines present | ✅ |
| Security policy present | ✅ |
| Code of conduct present | ✅ |
| Issue templates configured | ✅ |

## Next Milestone

**v1.2.0-alpha — Creator Engine Foundations**

Planned work items:

1. **EHR Calculation Refinement** — Handle edge cases, separate lever-specific vs total EHR
2. **Lever History Tracking** — Persist lever selections with outcomes over time
3. **Mission Completion Tracking** — Allow marking missions complete, track completion rate
4. **ZCcode Spec Files** — Machine-readable specifications for core components
5. **Weekly Review Improvements** — Week-over-week comparison, execution consistency score

See [v1.2.0 Work Queue](V1_2_0_WORK_QUEUE.md) for implementation details.

## Long-Term Vision

ZC-VIOS is a decision support system for solo creators and operators. The core purpose is to help users increase their effective revenue-per-hour by:

- Focusing on one high-leverage activity per week
- Executing against a clear daily mission
- Tracking outcomes with EHR as the north star metric
- Making data-informed decisions about where to invest limited time

The system provides structure and clarity, not comprehensive business operations. It answers the question: "What should I focus on?" — not "How do I run my entire business?"

## Support

If you find this project useful, you can support continued development:

**Buy Me a Coffee**  
[https://www.buymeacoffee.com/mxztar](https://www.buymeacoffee.com/mxztar)

## Links

- [README](../README.md)
- [System Overview](SYSTEM_OVERVIEW.md)
- [Product Thesis](PRODUCT_THESIS.md)
- [Roadmap](ROADMAP.md)
- [Contributing](../CONTRIBUTING.md)
