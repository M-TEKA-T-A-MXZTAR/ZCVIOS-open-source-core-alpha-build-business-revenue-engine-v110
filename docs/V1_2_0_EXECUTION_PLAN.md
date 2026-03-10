# v1.2.0-alpha Execution Plan

## Milestone Overview

**Version:** v1.2.0-alpha  
**Focus:** Creator Engine foundations, workflow tracking improvements, EHR logic refinement  
**Target:** Strengthen core loop before expanding features

## Deliverables

### D1: Lever History Tracking

**Scope:**  
Track historical lever selections and outcomes to inform future strategy decisions.

**Changes required:**
- Add `leverHistory` field or relation to user/weekly plan
- Store lever, week, EHR at selection time, EHR at week end
- Surface in weekly report

**Acceptance criteria:**
- [ ] Each weekly lever selection is persisted with timestamp
- [ ] Weekly report shows previous 4 weeks of lever history
- [ ] History survives user data export
- [ ] No migration breaks existing data

**Dependencies:** None

---

### D2: Mission Completion Tracking

**Scope:**  
Track whether daily missions are marked complete and correlate with logged hours.

**Changes required:**
- Add `completedAt` timestamp to DailyMission model
- Add UI to mark mission complete
- Show completion rate in weekly report

**Acceptance criteria:**
- [ ] User can mark daily mission as complete
- [ ] Completion timestamp is recorded
- [ ] Weekly report shows X/7 missions completed
- [ ] Completion status resets appropriately for new missions

**Dependencies:** None

---

### D3: EHR Calculation Refinement

**Scope:**  
Improve EHR calculation to handle edge cases and provide clearer signals.

**Changes required:**
- Handle weeks with zero logged hours (avoid division errors)
- Handle weeks with zero revenue (display appropriately)
- Add "lever-specific EHR" vs "total EHR" distinction in reports
- Document calculation methodology

**Acceptance criteria:**
- [ ] Zero-hour weeks display "No hours logged" instead of $0/h or NaN
- [ ] Zero-revenue weeks display "No revenue recorded"
- [ ] Lever EHR only counts hours in LEVER category
- [ ] Calculation logic documented in code comments

**Dependencies:** None

---

### D4: ZCcode Spec File

**Scope:**  
Create machine-readable ZCcode specification for core system components.

**Changes required:**
- Add `zccode/` directory
- Create spec files for: mission generation, strategy selection, EHR calculation
- Document format in docs/ZCCODE_LANGUAGE.md

**Acceptance criteria:**
- [ ] `zccode/mission.zc` defines mission generation interface
- [ ] `zccode/strategy.zc` defines strategy selection interface
- [ ] `zccode/ehr.zc` defines EHR calculation interface
- [ ] Format is parseable and consistent

**Dependencies:** None

---

### D5: Weekly Review Improvements

**Scope:**  
Enhance weekly review to include actionable insights.

**Changes required:**
- Add "suggested focus" based on lever history
- Add week-over-week EHR comparison
- Add execution consistency score (hours logged / target hours)

**Acceptance criteria:**
- [ ] Weekly review shows EHR change from previous week
- [ ] Execution consistency displayed as percentage
- [ ] Suggested next lever based on simple rules (not AI)
- [ ] PDF export includes new fields

**Dependencies:** D1 (lever history), D3 (EHR refinement)

---

## Issue Specifications

Below are issue specs for GitHub issue creation.

---

### Issue: Lever History Tracking

**Title:** [Feature] Track lever selection history per week

**Labels:** `enhancement`, `v1.2.0`

**Scope:**
- Persist lever selections with metadata (week, EHR at start, EHR at end)
- Display in weekly report
- Include in data export

**Acceptance criteria:**
- Historical lever data stored per week
- Visible in reports
- Exported with user data

**Dependencies:** None

---

### Issue: Mission Completion Tracking

**Title:** [Feature] Add mission completion status and tracking

**Labels:** `enhancement`, `v1.2.0`

**Scope:**
- Add completedAt field to DailyMission
- UI button to mark complete
- Completion rate in weekly report

**Acceptance criteria:**
- Mission can be marked complete
- Timestamp recorded
- Completion rate shown in report

**Dependencies:** None

---

### Issue: EHR Calculation Edge Cases

**Title:** [Bug/Enhancement] Handle EHR calculation edge cases

**Labels:** `bug`, `enhancement`, `v1.2.0`

**Scope:**
- Zero hours handling
- Zero revenue handling
- Lever-specific vs total EHR clarity

**Acceptance criteria:**
- No NaN or division errors
- Clear display for missing data
- Documented calculation

**Dependencies:** None

---

### Issue: ZCcode Specification Files

**Title:** [Feature] Add ZCcode spec files for core components

**Labels:** `enhancement`, `documentation`, `v1.2.0`

**Scope:**
- Create zccode/ directory
- Spec files for mission, strategy, ehr
- Update ZCcode language docs

**Acceptance criteria:**
- Three spec files created
- Format documented
- Parseable structure

**Dependencies:** None

---

### Issue: Weekly Review Enhancements

**Title:** [Feature] Enhance weekly review with insights

**Labels:** `enhancement`, `v1.2.0`

**Scope:**
- Week-over-week EHR comparison
- Execution consistency score
- Suggested next lever
- PDF export updates

**Acceptance criteria:**
- Comparison visible in report
- Consistency percentage shown
- Suggestion based on history
- PDF includes new fields

**Dependencies:** Lever history, EHR refinement

---

## Timeline

No fixed dates. Deliverables are ordered by dependency:

1. D1, D2, D3, D4 can proceed in parallel
2. D5 depends on D1 and D3 completion

## Success Criteria for v1.2.0-alpha

- All five deliverables complete
- CI passes on main
- Documentation updated
- No regression in existing functionality
- Release notes written
