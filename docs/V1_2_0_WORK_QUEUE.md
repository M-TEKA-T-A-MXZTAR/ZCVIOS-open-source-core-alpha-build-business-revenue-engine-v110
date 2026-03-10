# v1.2.0-alpha Work Queue

Implementation planning document for v1.2.0-alpha deliverables.

**Source of truth:** [V1_2_0_EXECUTION_PLAN.md](V1_2_0_EXECUTION_PLAN.md)

---

## Recommended Build Order

| Order | Deliverable | Rationale |
|-------|-------------|-----------|
| 1 | **D3: EHR Calculation Refinement** | Foundation for accurate reporting |
| 2 | **D1: Lever History Tracking** | Required by D5, provides data for insights |
| 3 | **D2: Mission Completion Tracking** | Independent, improves daily loop |
| 4 | **D4: ZCcode Spec Files** | Documentation, no code dependencies |
| 5 | **D5: Weekly Review Improvements** | Depends on D1 and D3 |

### Maximum Leverage First

**Start with D3 (EHR Calculation Refinement).**

Rationale:
- EHR is the core metric of the system
- Edge case bugs erode user trust
- Clean calculations make all reports more reliable
- No dependencies, can ship immediately
- Small scope, high impact

---

## Work Items

### W1: EHR Calculation Refinement

**Deliverable:** D3

**Purpose:**  
Eliminate edge case errors in EHR calculation and provide clearer distinctions between lever-specific and total EHR.

**Scope:**
- Fix division-by-zero when no hours logged
- Handle zero-revenue weeks gracefully
- Separate lever EHR (LEVER category hours only) from total EHR (all hours)
- Document calculation methodology in code

**Acceptance Criteria:**
- [ ] Zero-hour weeks display "No hours logged" instead of $0/h or NaN
- [ ] Zero-revenue weeks display "No revenue recorded"
- [ ] Lever EHR calculation excludes non-LEVER category hours
- [ ] Total EHR calculation includes all logged hours
- [ ] Calculation logic documented in `src/lib/metrics.ts` comments

**Dependencies:** None

**Implementation Notes:**
- Primary file: `src/lib/metrics.ts`
- Check `calcEhr` function for division handling
- Check `weeklyHours` function for category filtering
- Update report components to use correct EHR variant
- Add JSDoc comments explaining formulas

**Estimated scope:** Small (1-2 files, <100 lines changed)

---

### W2: Lever History Tracking

**Deliverable:** D1

**Purpose:**  
Persist lever selections over time to enable trend analysis and informed strategy decisions.

**Scope:**
- Store lever selection with week metadata
- Capture EHR at selection time and week end
- Display history in weekly report
- Include in data export

**Acceptance Criteria:**
- [ ] `WeeklyPlan` or new model stores: lever, weekStart, ehrAtSelection, ehrAtEnd
- [ ] Selection timestamp recorded when lever is set
- [ ] Weekly report shows last 4 weeks of lever history
- [ ] Data export includes lever history
- [ ] Migration does not break existing data

**Dependencies:** None (but benefits from D3 being complete first)

**Implementation Notes:**
- Option A: Add fields to existing `WeeklyPlan` model
- Option B: Create separate `LeverHistory` model with relation
- Update `src/app/rpc/lever-override/route.ts` to record history
- Update weekly report component to fetch and display history
- Update data export to include new fields
- Create Prisma migration

**Estimated scope:** Medium (schema change, 3-4 files, migration)

---

### W3: Mission Completion Tracking

**Deliverable:** D2

**Purpose:**  
Allow users to mark daily missions complete and track completion rate.

**Scope:**
- Add completion timestamp to mission model
- Add UI control to mark mission complete
- Show completion rate in weekly report

**Acceptance Criteria:**
- [ ] `DailyMission` model has `completedAt: DateTime?` field
- [ ] Dashboard shows "Mark Complete" button when mission active
- [ ] Clicking button sets `completedAt` to current timestamp
- [ ] Button changes to "Completed" state after marking
- [ ] Weekly report shows "X/7 missions completed"
- [ ] Completion resets for new day's mission

**Dependencies:** None

**Implementation Notes:**
- Add field to `DailyMission` in `prisma/schema.prisma`
- Create migration
- Add API endpoint or modify existing `/rpc/mission` for completion
- Update dashboard component with completion UI
- Update weekly report to calculate completion rate
- Consider: should completion be reversible?

**Estimated scope:** Medium (schema change, API update, UI change)

---

### W4: ZCcode Spec Files

**Deliverable:** D4

**Purpose:**  
Create machine-readable specifications for core system components using ZCcode format.

**Scope:**
- Create `zccode/` directory
- Write spec for mission generation
- Write spec for strategy selection
- Write spec for EHR calculation
- Update ZCcode language documentation

**Acceptance Criteria:**
- [ ] `zccode/mission.zc` exists with mission generation interface
- [ ] `zccode/strategy.zc` exists with strategy selection interface
- [ ] `zccode/ehr.zc` exists with EHR calculation interface
- [ ] Files follow documented ZCcode format
- [ ] `docs/ZCCODE_LANGUAGE.md` updated with spec file examples

**Dependencies:** None

**Implementation Notes:**
- Review `docs/ZCCODE_LANGUAGE.md` for format reference
- Extract interface from `src/lib/ai.ts` for mission/strategy specs
- Extract interface from `src/lib/metrics.ts` for EHR spec
- Keep specs descriptive, not executable
- Consider: JSON-like structure vs custom syntax

**Estimated scope:** Small (documentation only, no code changes)

---

### W5: Weekly Review Improvements

**Deliverable:** D5

**Purpose:**  
Enhance weekly review with actionable insights based on historical data.

**Scope:**
- Add week-over-week EHR comparison
- Add execution consistency score
- Add suggested next lever based on history
- Update PDF export with new fields

**Acceptance Criteria:**
- [ ] Weekly review shows "EHR: $X/h (+/-Y% vs last week)"
- [ ] Execution consistency shows "Z% of target hours logged"
- [ ] Suggested lever shown based on simple rules (not AI)
- [ ] PDF export includes all new fields
- [ ] Graceful handling when insufficient history exists

**Dependencies:** 
- W1 (EHR Calculation Refinement) - for accurate comparison
- W2 (Lever History Tracking) - for suggestion logic

**Implementation Notes:**
- Update `/rpc/reports/weekly` to include comparison data
- Calculate consistency as: (actual hours / target hours) * 100
- Suggestion logic: if EHR declining and lever unchanged for 3+ weeks, suggest change
- Update `src/app/(app)/reports/weekly/page.tsx` component
- Update PDF generation in weekly review route
- Handle edge cases: first week (no comparison), no target set

**Estimated scope:** Medium-Large (API update, UI changes, PDF update)

---

## Progress Tracking

| Work Item | Status | Started | Completed | Notes |
|-----------|--------|---------|-----------|-------|
| W1: EHR Refinement | Not Started | - | - | Start here |
| W2: Lever History | Not Started | - | - | After W1 |
| W3: Mission Completion | Not Started | - | - | Independent |
| W4: ZCcode Specs | Not Started | - | - | Independent |
| W5: Weekly Review | Not Started | - | - | After W1, W2 |

---

## Definition of Done

Each work item is complete when:
1. Code changes implemented
2. Tests pass (existing + any new tests)
3. `npm run lint` passes
4. `npm run build` passes
5. Manual verification confirms feature works
6. CHANGELOG updated if user-facing
7. PR merged to main
