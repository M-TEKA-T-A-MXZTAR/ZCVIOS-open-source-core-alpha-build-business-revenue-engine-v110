# Product Thesis

## Core User

**Solo operators and small business owners** who:
- Trade time for money (services, consulting, freelance, small product sales)
- Work 30-60 hours per week
- Earn $50K-$300K annually
- Have no dedicated operations team
- Make most business decisions themselves

Not enterprise teams. Not venture-backed startups. Not hobbyists.

## Core Problem

Solo operators face a consistent failure mode:

1. They work hard but scatter effort across multiple priorities
2. They track activity (hours worked, tasks completed) instead of outcomes (revenue per hour)
3. They lack a systematic way to decide where to focus
4. They optimize for busyness instead of leverage

The result: plateaued income despite increasing hours worked. The business becomes a job with worse benefits.

## Core Promise

ZC-VIOS answers one question each week:

> "Given my current situation, what is the single highest-leverage action I should focus on?"

The system:
- Selects one lever per week based on data (EHR trend, execution consistency, business signals)
- Generates one daily mission aligned to that lever
- Tracks revenue and hours to calculate Effective Hourly Rate
- Reports progress against the user's own historical baseline

## Measurable Outcomes

Success means users can answer:

| Question | ZC-VIOS Provides |
|----------|------------------|
| What should I focus on this week? | Weekly lever selection |
| What should I do today? | Daily mission |
| Is my business improving? | EHR trend (4-week rolling) |
| Am I working efficiently? | Hours logged vs revenue generated |
| Where did my time go? | Work log by category |

## Non-Goals

ZC-VIOS is **not**:

- A task manager (no subtasks, no due dates, no priority matrices)
- A project management tool (no Gantt charts, no resource allocation)
- A time tracker for billing (no invoicing, no client management)
- A business analytics platform (no cohort analysis, no funnel visualization)
- A coaching or accountability service (no human intervention)
- A gamified productivity app (no points, streaks, badges, or shame mechanics)

The system provides **decision support for where to focus**, not comprehensive business operations.

## Design Constraint

Deterministic mode must always work without external API dependencies. Users who never configure OpenAI still get full functionality through rule-based lever selection and template-based missions.

AI features are optional enhancements, not requirements.
