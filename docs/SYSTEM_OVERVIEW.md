# System Overview

## Project Purpose

ZC-VIOS Core is a revenue-per-hour acceleration system designed for solo operators and small business owners. The system helps users focus on one high-leverage activity per week, track their Effective Hourly Rate (EHR), and make data-driven decisions about where to invest their limited time.

The core philosophy: **One lever per week. One mission per day. Measured against your own EHR.**

## System Components

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Lever** | One of six business focus areas: Distribution, Conversion, Pricing, Traffic, Retention, Automation |
| **EHR** | Effective Hourly Rate - revenue divided by logged hours |
| **Weekly Plan** | System-selected or user-overridden lever for the week |
| **Daily Mission** | Specific task derived from the active lever |
| **Work Log** | Time entries categorized by activity type |

### The Six Levers

1. **Distribution** - Getting your offer in front of more people
2. **Conversion** - Improving the rate at which prospects become customers
3. **Pricing** - Optimizing revenue per transaction
4. **Traffic** - Increasing volume of potential customers
5. **Retention** - Reducing churn and increasing lifetime value
6. **Automation** - Reducing time spent on recurring tasks

## Next.js App Structure

```
src/app/
├── layout.tsx              # Root layout (minimal)
├── global-error.tsx        # Error boundary
├── page.tsx                # Landing page
├── login/                  # Authentication
├── register/
├── (app)/                  # Authenticated route group
│   ├── layout.tsx          # SessionProvider wrapper
│   ├── dashboard/          # Main dashboard
│   ├── settings/           # User settings, API keys
│   ├── logs/               # Work session logging
│   ├── revenue/            # Weekly revenue entry
│   ├── onboarding/         # New user setup
│   └── reports/
│       ├── weekly/         # Weekly EHR report
│       └── monthly/        # Monthly trend report
└── rpc/                    # API routes
    ├── mission/            # Daily mission generation
    ├── revenue/            # Revenue CRUD
    ├── logs/               # Work log CRUD
    ├── lever-override/     # Manual lever selection
    └── reports/            # Report data endpoints
```

## CI Pipeline

The GitHub Actions workflow runs two jobs:

### Job 1: Build & Verify
- Checkout repository
- Setup Node.js 20
- Install dependencies (`npm ci`)
- Generate Prisma client
- Run database migrations
- Seed demo data
- Run ESLint
- Build production bundle (NODE_ENV=production)

### Job 2: Integration Tests
- Depends on Build & Verify passing
- Sets up Python 3.11
- Installs pytest and requests
- Rebuilds the application
- Starts the Next.js server
- Runs pytest suite against live endpoints
- Tests authentication guards and RPC flows

## Database Layer

### ORM
Prisma with SQLite (development) / PostgreSQL (production-ready)

### Schema Models

| Model | Purpose |
|-------|---------|
| `User` | Authentication, preferences, API keys |
| `WeeklyRevenue` | Weekly revenue entries with business signals |
| `WorkLogSession` | Time tracking entries |
| `WeeklyPlan` | Selected lever, strategy reasoning |
| `DailyMission` | Generated daily tasks |
| `FreedomDefinition` | User's income and time goals |

### Migrations
Located in `/prisma/migrations/`. Run with:
```bash
npx prisma migrate deploy
```

## Strategy Engine

The strategy engine selects the weekly lever using either:

1. **Deterministic mode** (default, no API key required)
   - Uses EHR slope, execution consistency, and business signals
   - Rule-based lever selection

2. **AI-assisted mode** (optional, user provides OpenAI key)
   - GPT-based strategy reasoning
   - Falls back to deterministic if API fails

### Selection Logic

The engine evaluates:
- 4-week EHR trend (slope)
- Execution consistency (logged hours vs target)
- Weekly business signals (traffic, leads, sales, churn, margin)
- Time on current lever

Output: One lever for the week + reasoning summary.

## Mission Generation

Daily missions are derived from the active lever:

1. **Primary task** - Main focus action
2. **Support task** - Secondary action
3. **Do-not-do reminder** - Scope guard
4. **Recommended minutes** - Time allocation
5. **Start-now step** - Immediate first action
6. **Success definition** - Clear completion criteria

Missions can be generated deterministically (templates) or via AI (GPT).
