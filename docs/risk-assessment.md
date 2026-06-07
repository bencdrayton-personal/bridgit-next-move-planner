# Risk Assessment — Next Move Planner

## Regulatory & compliance

| Risk | Detail | Mitigation |
|---|---|---|
| Credit assistance boundary (NCCP) | If the planner "suggests" a credit product tied to an application, it may constitute credit assistance requiring disclosure obligations | H1 outputs are general information about *sequencing strategies*, not product recommendations; no application linkage; legal review gate before launch and before any H2 personalisation; copy avoids "you should get a bridging loan" formulations |
| Advertising standards (ASIC RG 234) | Readiness scores could be read as implied approval likelihood | Explicit "not an approval, not advice" framing at score, CTA and footer; banding language reviewed ("ready to move" ≠ "you will be approved") |
| Financial advice perimeter | Strategy comparison brushes against personal advice if framed as "you should" | "Suggested for you" framed as information relevance, not recommendation; all three strategies always presented with full trade-offs; legal review of the recommendation copy specifically |
| Privacy (APPs) | Financial inputs are sensitive even when anonymous | H1: no storage, no accounts, session-scoped; analytics carry buckets not raw values; LLM payload limited to suburb + derived ratios; data-flow documented for OAIC-readiness |

## Product & model

| Risk | Detail | Mitigation |
|---|---|---|
| Garbage-in verdicts | Customers misestimate home value by ±10–15% routinely; verdict inherits the error | Confidence score communicates input sensitivity; step 1 of every plan is "get real appraisals"; H2 valuation ranges; copy discipline ("directional", "starting point, not verdict") |
| Score miscalibration | Engine thresholds drift from real credit outcomes | Broker panel validation pre-launch (E3); quarterly calibration review; score-distribution drift guardrail in metrics |
| AI tone/content breach | LLM output could introduce hype, jargon, or implied guarantees | Narrow prompt with explicit prohibitions; output length caps; deterministic fallback; 50-case eval set reviewed pre-launch; AI never generates numbers |
| False confidence (the over-trust failure mode) | A "ready" verdict read as a green light to make unconditional offers | Risk section always rendered; scenario modelling shows downside in dollars; CTA routes to a human conversation, not an application |
| False discouragement (the opposite error) | A "not yet" verdict deterring a household a broker could actually help | "Not yet" path always includes concrete levers + review date + broker option; banding thresholds deliberately conservative on *cap* breaches only |

## Commercial

| Risk | Detail | Mitigation |
|---|---|---|
| Referral leakage | Educated customers shop elsewhere | Accepted in H1 (category growth favours the category leader); consent-based handoff in H2 captures intent earlier |
| Broker channel tension | Brokers may read a consumer planner as disintermediation | Position as broker-prep tool from day one (E3/E9 conversations); H3 white-label makes brokers the beneficiaries |
| Copycat risk | A portal or major could clone the surface | The defensible layers are calibration data (plan-vs-actual outcomes) and broker distribution, not the UI — hence the roadmap's data-compounding logic |

## Technical

| Risk | Detail | Mitigation |
|---|---|---|
| LLM dependency | Provider outage degrades experience | Fallback templates ship in the same release; fallback rate monitored; zero user-visible failure |
| Calculation correctness | A maths bug in a finance tool is a trust-ending event | Engine unit-tested against hand-worked cases; broker panel cross-check; single-source-of-truth constants with citations to public lending criteria |

## The risk we accept deliberately

The planner will tell some viable customers "not yet" and some "ready" customers will be declined at application. **No directional tool escapes both errors.** The design choice is to be conservative at the cap boundaries (peak LVR, DTI ceiling) where false confidence does damage, and generous with paths-forward where false discouragement does damage. Both error costs are documented so future tuning is a decision, not a drift.
