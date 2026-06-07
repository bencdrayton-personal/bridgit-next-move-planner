# Metrics Framework — Next Move Planner

## North Star

**Move Readiness Assessments completed** (weekly).

Why this metric: it is the moment value is exchanged — the customer gets their verdict, Bridgit gets a readiness signal in the market. It leads every downstream business outcome (referrals, applications) and can't be gamed without actually helping more people. Loan volume would be a lagging vanity choice at this stage; traffic would be a leading vanity choice.

## Metrics tree

```
Move Readiness Assessments completed (North Star)
├── Acquisition
│   ├── Unique visitors to planner entry
│   ├── Entry → assessment start rate
│   └── Source mix (content / portal / broker / direct)
├── Activation
│   ├── Assessment completion rate (start → results)        target ≥55%
│   ├── Median time to complete                              target <3 min
│   └── Drop-off by question (income question watched closely)
├── Engagement
│   ├── Results sections viewed (≥2 of 5)                    target ≥70%
│   ├── Scenario switches per session
│   ├── Non-recommended strategy reads (honesty signal)
│   └── Broker-questions panel dwell / copy events
├── Conversion
│   ├── Broker-conversation CTA rate                          target ≥8%
│   ├── (R3+) Booking completion and show rate
│   └── Assessment-sourced application rate (90-day window)
├── Retention / Trust
│   ├── Return within 90 days                                 target ≥15%
│   ├── "Not yet" cohort return rate (6 mo)                   the trust metric
│   └── Plan re-runs with changed inputs
└── Quality
    ├── Post-session confidence uplift (single question)      target ≥ +2 / 10
    ├── Assessment-sourced application approval rate           target ≥ baseline +10pts
    └── CSAT on results page (thumbs + optional comment)
```

## Guardrail metrics

| Guardrail | Threshold | Why |
|---|---|---|
| Complaint / "this misled me" reports | ~0 | Directional tool must never feel like a broken promise |
| Compliance escalations on copy or AI output | 0 | NCCP exposure |
| P95 results render time | < 2s | Confidence products can't feel fragile |
| AI fallback rate visible to users | 0 UX degradation | Fallback must be invisible |
| Score distribution drift (weekly) | Investigate >10pt shift | Engine bug or input-mix change detection |

## Counter-metrics (what we refuse to optimise)

- **CTA conversion at the cost of honesty** — if pushing "ready" banding up raises referrals, that's score inflation, not growth. Banding thresholds change only with broker-panel evidence.
- **Session length** — longer isn't better; clarity is fast.
- **Email capture** — H1 is anonymous by design; capture would lift "leads" while killing input honesty (assumption A1).

## Event spec (core)

| Event | Properties |
|---|---|
| `planner_started` | source, persona_hint (entry content page) |
| `question_answered` | index, field, ms_on_question |
| `assessment_completed` | score, band, confidence, peak_lvr_bucket, dti_bucket |
| `results_section_viewed` | section, order |
| `scenario_switched` | from_days, to_days |
| `strategy_expanded` | strategy_id, recommended_bool |
| `broker_cta_clicked` | band, score_bucket |
| `confidence_survey` | pre (asked on landing), post |
| `plan_rerun` | fields_changed |

All events anonymous-session scoped in H1. Buckets, not raw figures, for financial properties — no income or property values in analytics.

## Review cadence

Weekly: North Star + activation funnel. Monthly: full tree + counter-metric audit. Quarterly: score-calibration review against broker panel and (once flowing) application outcomes.
