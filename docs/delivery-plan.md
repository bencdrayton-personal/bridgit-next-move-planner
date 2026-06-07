# Delivery Plan — Next Move Planner

Reflects the iterative delivery approach in the Senior PM (Lending) role: large initiative broken into self-contained releases, each shipping real value and laying foundation for the next.

## Team shape (production assumption)

1 PM (this role), 1 designer (50%), 2 engineers, compliance/legal as gated reviewers, 1 data analyst (25%). The prototype de-risks the build: engine logic, UX flow, and AI integration pattern are already proven.

## Delivery backlog (sequenced)

### Sprint 1–2: Foundations
- Port prototype to production stack (design system, component library, error states)
- Analytics event spec implemented end-to-end (metrics.md)
- Engine unit-test suite: 25 hand-worked cases incl. boundary conditions (LVR cap edges, zero-equity, DTI ceiling)
- Copy handed to legal for compliance review **(gate — longest lead time, starts day 1)**

### Sprint 3–4: Hardening
- Accessibility to WCAG 2.1 AA (forms, contrast, focus order, screen-reader narrative for score)
- AI narrative: eval set (50 positions × tone/accuracy rubric), prompt iteration, fallback parity check
- Performance: results render P95 < 2s; Core Web Vitals on entry page
- Legal feedback incorporated; second review pass

### Sprint 5: Soft launch (R2)
- Deploy behind 2–3 SEO content pages
- E1 fake-door variant on additional pages; E2/E3 (usability + broker panel) conclude and report
- Weekly North Star reporting live to stakeholders

### Sprint 6–8: Learn & iterate
- Funnel iteration from drop-off data (income question is the predicted friction point)
- E4 scenario A/B; E6 honesty instrumentation
- Decision review: R3 go/no-go against completion ≥55% and CTA ≥8% (or a documented pivot)

### Sprint 9–10: R3 — Conversion
- Broker-conversation booking flow integration
- Suburb days-on-market data feed grounding scenarios
- "Save my plan" with email re-check nudge (first PII touchpoint — privacy review gate)

## Definition of done (every story)

Acceptance criteria met → unit/integration tests pass → analytics events verified in staging → accessibility check → copy matches approved compliance language → PM walkthrough on production-like data.

## Working agreements

- **Engine changes are PRs with worked examples.** Any threshold or weight change includes before/after on the 25-case suite — calibration is a decision with an audit trail, not a tweak.
- **AI prompts are versioned artefacts** with eval runs attached; no prompt ships without an eval pass.
- **Weekly stakeholder note**: North Star, one insight, one decision needed. Fifteen lines max.
- **Kill criteria are pre-committed** (roadmap.md) so the sunk-cost conversation never has to happen cold.

## Dependencies & risks to delivery

| Item | Owner | Risk |
|---|---|---|
| Legal review turnaround | PM to broker early | Longest pole; starts sprint 1, not sprint 4 |
| Design system maturity | Design | Prototype palette is placeholder; brand pass needed pre-launch |
| Days-on-market data licensing | PM + partnerships | R3 scope hostage if late — soft-launch ships without it by design |
| LLM provider procurement | PM + security | Fallback templates mean launch is never blocked on this |
