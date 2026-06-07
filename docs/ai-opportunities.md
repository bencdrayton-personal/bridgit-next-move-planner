# AI Opportunity Assessment — Bridgit's End-to-End Lending Journey

Scope: where AI could create customer and business value across Bridgit's full journey, not just the planner. Each opportunity is assessed on problem, customer value, business value, complexity, and a recommendation. The honest pattern: **the highest-leverage early wins are language and document tasks, not decisioning** — decisioning AI in consumer credit carries regulatory weight that demands mature foundations first.

A principle applied throughout: **AI explains and accelerates; deterministic, auditable logic decides.** In regulated lending, that separation is the architecture.

---

## 1. Awareness

**Problem:** Bridging finance is unknown or misunderstood by most eligible homeowners; education is the channel.
**AI application:** Generative content engine for suburb- and scenario-specific education ("buying before selling in [suburb]: what it costs at today's days-on-market"), grounded in market-data feeds; human editorial review.
**Customer value:** Finds answers phrased the way they actually search. **Business value:** SEO surface area scales with marginal cost near zero; feeds planner top-of-funnel.
**Complexity:** Low-medium (content ops + grounding pipeline).
**Recommendation:** ✅ Do now. Cheap, compounding, low regulatory surface (general information, human-reviewed).

## 2. Evaluation (the planner's home)

**Problem:** Customers can't convert their situation into a readiness judgement.
**AI application:** Plain-language narrative over deterministic scoring (shipped in prototype); H2: personalised guidance ("what would make buy-first viable for me?") and a guardrailed conversational mode.
**Customer value:** The verdict explained like a calm human, not a calculator. **Business value:** Differentiated trust; better-qualified pipeline.
**Complexity:** Medium — guardrails, eval harness, tone control (prototype demonstrates the pattern incl. fallback).
**Recommendation:** ✅ Do now (narrative); conversational mode only after E7 builds the eval corpus.

## 3. Application

**Problem:** Application friction = abandonment; customers re-enter known information and stall on document gathering.
**AI application:** Document intelligence — classify and extract from rate notices, loan statements, payslips, trust deeds; pre-fill with confidence flags; conversational document checklist ("what counts as proof of X?").
**Customer value:** The "weeks of paperwork" fear (acute for self-employed) collapses to photo-upload. **Business value:** Completion rate ↑, time-to-submission ↓, ops touches per file ↓.
**Complexity:** Medium — mature OCR/LLM extraction stack; human verification loop.
**Recommendation:** ✅ High-priority next. Probably the single highest ROI AI investment in the journey; directly serves Bridgit's 24-hour-approval brand promise.

## 4. Underwriting

**Problem:** Manual assessment effort concentrates here; speed is the brand.
**AI application:** *Assistive, not decisioning.* Case summarisation for assessors (income story, equity position, anomalies surfaced); valuation-evidence triage; policy-reference copilot ("what's our position on X?" answered from credit policy with citations).
**Customer value:** Faster, more consistent decisions. **Business value:** Assessor throughput; consistency; audit trail quality.
**Complexity:** High — accuracy bar, model risk management, explainability obligations; credit decisions must remain human/deterministic.
**Recommendation:** ⚠️ Pilot assistive tooling with tight human-in-the-loop; do **not** pursue AI credit decisioning until model-risk governance matures. The regulatory cost of getting this wrong exceeds the latency win.

## 5. Approval & Settlement

**Problem:** The anxious gap — customers wait, status-check, and chase; ops coordinates solicitors, valuers, discharging lenders.
**AI application:** Proactive status narration ("here's what's happening with your file and what happens next") generated from workflow state; settlement-document checking (discharge forms, contract details) with anomaly flags.
**Customer value:** The silence between approval and keys becomes a narrated journey. **Business value:** Inbound "where's my file?" contacts ↓; settlement-delay causes caught earlier.
**Complexity:** Medium — workflow-state integration is the hard part, generation is easy.
**Recommendation:** ✅ Do after Application AI (shares document infrastructure).

## 6. Post-settlement

**Problem:** Bridging is short-term by design — the relationship usually ends at sale; no systematic learning loop from outcomes.
**AI application:** "Plan vs actual" retrospectives feeding scoring calibration; sale-readiness nudges during the bridge (presentation, pricing signals from market data); churn-to-advocacy content generation (anonymised journey stories).
**Customer value:** Support through the sale they still have to execute. **Business value:** The outcome dataset — which readiness profiles led to smooth bridges — becomes the moat that hardens every upstream model.
**Complexity:** Medium; mostly data plumbing.
**Recommendation:** ✅ Start the data capture now (cheap), build the loop in H2 — the dataset compounds and is the hardest thing for a competitor to copy.

---

## Priority sequence

| Priority | Opportunity | Rationale |
|---|---|---|
| 1 | Application document intelligence | Highest ROI, serves the core brand promise, medium complexity |
| 2 | Evaluation narrative + planner (this project) | Differentiating trust layer; already prototyped |
| 3 | Awareness content engine | Cheap, compounding, feeds #2 |
| 4 | Approval/settlement status narration | Reuses #1's infrastructure |
| 5 | Post-settlement data loop | Start capture now; model later |
| 6 | Underwriting assistive copilot | Valuable but governance-gated; sequence last deliberately |

## Cross-cutting requirements

Model risk management policy before anything decision-adjacent; eval harnesses per use case (the planner's narrative evals are the template); PII minimisation by default (the planner sends only suburb + derived ratios to the LLM — that pattern generalises); human escalation path on every AI surface; tone system shared across all generation (calm, plain, no urgency) so AI output is indistinguishable from Bridgit's best human writing.
