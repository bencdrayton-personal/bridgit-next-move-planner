# PRD — Next Move Planner (H1)

| | |
|---|---|
| Status | Prototype shipped; PRD covers H1 production scope |
| Owner | Ben Drayton (Senior PM) |
| Last updated | June 2026 |

## 1. Problem

Homeowners considering a property move cannot get an honest, structured answer to "am I financially ready to buy before I sell?" without entering a sales process. The result: delayed broker conversations, finance understanding arriving after purchase decisions instead of before, forced sales, double moves, and — for Bridgit — a market where most eligible customers never discover bridging finance exists.

## 2. Objectives

| Objective | Why it matters |
|---|---|
| O1: Give homeowners a credible readiness verdict in under 5 minutes, anonymously | Brings the private "are we viable?" judgement forward and makes it accurate |
| O2: Convert readiness understanding into prepared broker conversations | Planner value becomes pipeline value |
| O3: Establish Bridgit as the trusted starting point of a property transition | Extends "move with confidence" upstream of the loan |

Non-objectives (H1): credit decisioning, pre-approval, stored accounts, property search, rate comparison.

## 3. Success metrics

North Star: **Move Readiness Assessments completed** (weekly).

| Metric | Target (6 mo post-launch) | Type |
|---|---|---|
| Assessment completion rate (started → results) | ≥ 55% | Health |
| Results-page engagement (≥2 sections viewed) | ≥ 70% of completions | Engagement |
| Broker-conversation CTA conversion | ≥ 8% of completions | Business |
| Repeat usage (return within 90 days) | ≥ 15% | Trust |
| Post-session confidence uplift (1-question survey) | ≥ +2 on 10-pt scale | Customer |
| Assessment-sourced applications: approval rate vs baseline | ≥ baseline + 10pts | Quality |

Guardrails: complaint rate ~0; no output presentable as credit advice (legal-reviewed copy); P95 results render < 2s.

## 4. Personas

Five planning personas (full detail in customer-research.md): Upsizer (primary), Downsizer, Growing Family, Empty Nester, Self-Employed Homeowner. The Upsizer drives volume; the Self-Employed Homeowner drives differentiation (equity-led framing vs income-led banking).

## 5. Jobs to be done

1. *When a life trigger makes our move real, help me know whether we can buy before we sell, so we can move once, on our terms.*
2. *When I fear a slow sale, show me what it would actually cost and what I'd do, so the fear becomes a plan.*
3. *When I'm ready to talk to a professional, arm me with my position and the right questions, so the conversation starts at "how", not "whether".*

## 6. User stories & acceptance criteria

### Epic A — Readiness Assessment

**A1.** As a homeowner, I can enter six details (home value, mortgage balance, suburb, target price, household income, timeframe) one question at a time, so the process feels effortless.
- AC: one question per screen; progress indicator; back navigation preserves values; currency inputs format as typed; Enter advances; all six validated with friendly, specific error copy; completable in < 3 minutes.

**A2.** As a homeowner, I receive a readiness score (0–100), band (Ready / Nearly there / Building position), and confidence score, with a plain-language explanation.
- AC: score derives exclusively from the deterministic engine (peak-debt LVR, end-debt DTI, timeframe fit, post-move buffer, weights 40/30/15/15); banding thresholds: ready ≥70 *and* peak LVR ≤85%; nearly ≥45; explanation references the user's actual numbers; no lending jargon (LVR/DTI never shown as terms).

**A3.** As a homeowner, I can see my position in figures: usable equity, peak position %, loan after selling, purchase costs.
- AC: all figures rounded to nearest $1k; each stat carries a one-line plain-language hint; peak position framed as "% of combined property value".

### Epic B — Move Strategy

**B1.** As a homeowner, I see three sequencing strategies (buy first / sell first / wait) with rationale, advantages, risks and suitability, with exactly one marked as suggested for me.
- AC: recommendation logic is deterministic and explainable (band + viability rules); non-recommended options remain fully readable — no dark-pattern de-emphasis; "wait" must be recommendable (the tool can say not-yet).

### Epic C — Scenario Modeller

**C1.** As a homeowner, I can compare 30/60/90-day sale scenarios with estimated carrying cost, risk level, liquidity note, and 3 recommended actions each.
- AC: carrying cost = peak debt × bridge rate × days/365, rounded to $1k; rate parameter configurable; risk level reflects LVR position at 90 days; switching scenarios requires no reload.

### Epic D — Risk Analysis

**D1.** As a homeowner, I see four risks (equity, timing, affordability, market) each with a level (low/moderate/elevated) and a 1–2 sentence consumer-friendly summary.
- AC: levels derive from engine thresholds; summaries adapt to level; no risk is ever hidden; elevated risks use direct but non-alarmist language.

### Epic E — Next Steps Planner

**E1.** As a homeowner, I get 4 prioritised next steps with timeframes, adapted to my readiness band, plus 5 questions to ask a broker.
- AC: steps differ by band ("ready" → pre-approval path; "not-yet" → position-building plan with review date); every plan's step 1 addresses valuation uncertainty (get real appraisals).

### Epic F — AI Narrative

**F1.** As a homeowner, I receive a personalised plain-language summary of my position, generated by an LLM when available, template otherwise.
- AC: AI is explanation-only — never produces scores or recommendations; prompt forbids jargon, hype and urgency language; graceful fallback to deterministic template with no UX degradation; API failures invisible to user; no PII beyond suburb sent to the model.

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Output construed as credit assistance under NCCP | Medium | High | Legal review gate; no product recommendation tied to application; "general information" framing; disclaimer placement reviewed |
| Estimate-garbage-in → misleading verdicts | High | Medium | Confidence score; "directional, not verdict" copy; step-1 appraisal CTA; H2 valuation data |
| AI narrative hallucination / tone breach | Medium | Medium | Deterministic fallback; narrow prompt; output length cap; eval set of 50 positions reviewed pre-launch |
| Honest "not yet" verdicts suppress short-term referrals | High | Low | Accepted strategically — trust play; measure 6-mo return rate of that cohort |

## 8. Assumptions

Documented with owners and tests in opportunity-solution-tree.md (A1–A9). Load-bearing: customers will input honest approximations anonymously (A1); credit-logic-mirroring verdicts survive broker scrutiny (A3).

## 9. Dependencies

| Dependency | Stage | Notes |
|---|---|---|
| Legal/compliance review of all consumer-facing copy | Before public launch | NCCP / ASIC RG 234 (advertising credit) |
| Brand & design system alignment | Before public launch | Prototype uses placeholder palette |
| LLM provider agreement + data-handling review | Epic F production | Anonymous payload only |
| Analytics events spec | Build | Defined in metrics.md |
| (H2) Valuation data provider (CoreLogic/PropTrack) | H2 | Replaces user estimates with ranges |

## 10. Release plan

| Release | Scope | Gate |
|---|---|---|
| R0 (done) | Prototype: all six epics, deterministic engine, AI narrative with fallback | Internal review |
| R1 | Production hardening: analytics, legal copy review, accessibility (WCAG 2.1 AA), error states | Compliance sign-off |
| R2 | Public soft launch via 2–3 content pages; E1/E4 experiments live | 4 weeks of funnel data |
| R3 | Broker CTA integration (booking flow), suburb days-on-market data | R2 metrics ≥ thresholds |

## 11. Future enhancements (H2+)

Saved plans with re-check reminders; consent-based broker handoff of plan summary; valuation API integration; conversational AI mode (post guardrail design); white-label aggregator embed; post-settlement "plan vs actual" loop.
