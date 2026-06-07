# Discovery Experiments — Backlog & Design

Each experiment names the assumption it tests (IDs from opportunity-solution-tree.md), the method, the kill/pass signal, and cost. Ordered by leverage: cheapest test of the most load-bearing assumption first.

## E1 — Fake-door demand test

- **Assumption:** A1 (people want a readiness check enough to start one)
- **Method:** Landing page + "Check my readiness" CTA placed on two property-transition content pages; CTA leads to "coming soon + 1 question survey"
- **Pass:** ≥12% content→CTA click-through; survey shows sequencing language unprompted
- **Cost:** 3 days build, 1 week run
- **Status:** Ready to run

## E2 — Prototype usability (5 × 5 personas)

- **Assumptions:** A2 (directional score is actionable), A4 (scenario costs calm rather than alarm), A6 (sequencing is a felt decision)
- **Method:** 25 moderated sessions on the live prototype, recruited per persona screener; think-aloud through assessment → results; pre/post confidence question
- **Pass:** ≥80% correctly restate their verdict and next step unprompted; median post-pre confidence ≥ +2; no participant reads the output as a loan approval
- **Kill signal:** participants anchor on the score as a guarantee → redesign confidence presentation before any launch
- **Cost:** 2 weeks incl. recruitment
- **Status:** Prototype ready

## E3 — Broker credibility panel

- **Assumptions:** A3 (engine verdicts survive expert scrutiny), A9 (brokers see value)
- **Method:** 20 synthetic cases scored by the engine; 5 accredited brokers independently band the same cases; compare; then interview on the planner-prepared-customer concept
- **Pass:** ≥75% band agreement; brokers describe planner-prepared customers as time-saving, not threatening
- **Kill signal:** systematic disagreement on a factor (e.g. engine too lenient on serviceability) → recalibrate weights before launch
- **Cost:** 2 weeks, parallel with E2

## E4 — Scenario modelling A/B

- **Assumption:** A4 at scale
- **Method:** 50/50 results page with/without scenario section post-soft-launch
- **Pass:** scenario arm ≥ +15% relative on CTA conversion with no drop in confidence survey
- **Cost:** Free (flag), 4 weeks of traffic

## E5 — Sequencing-language interviews

- **Assumptions:** A5, A6
- **Method:** 10 interviews, pre-tool: "walk me through how you'd time the buy and the sell." Code for 30/60/90-day mental models and order-of-operations confusion
- **Pass:** ≥7/10 express sequencing uncertainty unprompted
- **Cost:** 1 week

## E6 — Honesty engagement instrumentation

- **Assumption:** A7 (honest "wait" verdicts build rather than burn)
- **Method:** Instrument non-recommended strategy reads + "not yet" cohort return rate; no UI change
- **Pass:** "not yet" users read ≥2 strategies and ≥10% return within 6 months
- **Cost:** Analytics only; longitudinal

## E7 — Wizard-of-Oz conversational mode

- **Assumption:** Conversational AI (S3.3) is worth its guardrail cost
- **Method:** 10 sessions; "ask anything about your plan" chat box answered live by a human PM behind the curtain; transcript analysis of question types
- **Pass:** ≥60% of questions are answerable from engine outputs (safe automation surface); <10% seek personal credit advice (the dangerous surface)
- **Cost:** 1 week
- **Note:** runs *before* any LLM chat build — the transcript corpus becomes the eval set

## E8 — Broker-questions panel as intent signal

- **Assumption:** A8
- **Method:** Track copy/dwell on the questions panel; correlate with CTA clicks
- **Pass:** panel engagement predicts CTA at ≥2× base rate → invest in the handoff flow (S4.2)
- **Cost:** Analytics only

## E9 — Aggregator white-label conversation

- **Assumption:** A9 / H3 distribution thesis
- **Method:** Structured conversations with 2 aggregator product leads using the live prototype as the prop
- **Pass:** at least one "we'd pilot this" with named conditions
- **Cost:** 2 conversations; senior stakeholder time

## Sequencing

Weeks 1–2: E1, E5 (cheap, pre-launch). Weeks 2–4: E2 + E3 in parallel (the launch gate). Post-soft-launch: E4, E6, E8 (instrumented). Then E7, E9 (H2 bets).
