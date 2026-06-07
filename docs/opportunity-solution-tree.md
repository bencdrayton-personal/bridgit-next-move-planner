# Opportunity Solution Tree

Following Teresa Torres' discovery framing: outcome → opportunities → solutions → experiments. Solutions are kept deliberately plural — the prototype implements one branch, not the tree.

## Desired outcome

**Increase qualified application volume by converting pre-application uncertainty into readiness** (proxy North Star: Move Readiness Assessments completed → broker-conversation conversions).

---

## Opportunity 1: "I don't know if buying before selling is even possible for us"

The viability question. Customers can't find an honest answer without committing to a sales process.

**Key assumptions**
- A1: Customers will enter real (approximate) financial details into an anonymous tool — *tested by: completion rate of assessment funnel*
- A2: A directional readiness score is meaningful enough to act on, despite estimate-based inputs — *tested by: % of users who proceed to strategy/next-step content; qualitative follow-up*
- A3: Mirroring real bridging credit logic (peak debt, end debt) produces verdicts that survive broker scrutiny — *tested by: broker review panel of 20 synthetic cases*

**Solutions**
- S1.1 Readiness assessment with score + confidence (✅ prototyped)
- S1.2 Anonymous "position check" via single slider (equity vs target price) — lighter, viral, less precise
- S1.3 Broker-administered version: broker enters details with client in-meeting

**Experiments**
- E1: Fake-door landing page → measure click-through to "check my readiness" from property-content traffic (cheap, 1 week)
- E2: Prototype usability tests, 5 per persona — do users understand "peak position" framing? (2 weeks)
- E3: Broker panel review of scoring outputs vs their judgement on 20 cases (2 weeks, parallel)

## Opportunity 2: "What happens if our house doesn't sell quickly?"

The fear that blocks buy-first decisions even when the equity supports it.

**Key assumptions**
- A4: Showing the cost of a slow sale in dollars *reduces* anxiety rather than amplifying it (the "informed calm" hypothesis) — *tested by: pre/post confidence question in usability tests*
- A5: 30/60/90-day framing matches how customers naturally think about sale timelines — *tested by: card-sort / interview language analysis*

**Solutions**
- S2.1 Scenario modeller with carrying cost + actions per timeline (✅ prototyped)
- S2.2 Suburb-level days-on-market data integration to ground scenarios in local reality (H2)
- S2.3 "Sale readiness" checklist that shortens the bridge by preparing the sale in parallel (✅ partially, in next steps)

**Experiments**
- E4: A/B the results page with and without scenario modelling → measure completion-to-CTA rate and post-session confidence
- E5: Interview prompt: "walk me through what a 90-day sale would mean for you" before/after using the tool

## Opportunity 3: "I don't know what order to do things in"

Sequencing confusion — buy-first vs sell-first vs wait is the actual decision, and nothing on the market frames it as a choice.

**Key assumptions**
- A6: Customers experience sequencing as a decision they're unequipped for (vs a non-decision) — *tested by: interview coding for sequencing language*
- A7: Recommending "wait" to weak positions builds enough trust to outweigh lost short-term referrals — *tested by: 6-month return rate of "not yet" cohort (H2 metric)*

**Solutions**
- S3.1 Three-strategy comparison with honest trade-offs and a single recommendation (✅ prototyped)
- S3.2 Interactive trade-off explorer ("what would make buy-first viable for me?") — slider on purchase price / timeline
- S3.3 AI conversational mode: "ask anything about your plan" (H2; needs guardrail design first)

**Experiments**
- E6: Monitor strategy-card engagement: do users read the non-recommended options? (instrumentation)
- E7: Wizard-of-Oz the conversational mode with a human answering behind the curtain, 10 sessions — what do people actually ask?

## Opportunity 4: "I'm not ready to talk to a broker / I don't know what to ask"

The handoff gap between self-service confidence and human advice.

**Key assumptions**
- A8: A prepared-questions list lowers the activation energy of booking the conversation — *tested by: CTA conversion with/without the questions panel*
- A9: Brokers value planner-prepared customers enough to co-distribute the tool — *tested by: 5 broker interviews + one aggregator pilot conversation*

**Solutions**
- S4.1 Broker question list + preparation checklist (✅ prototyped)
- S4.2 Consent-based plan handoff: customer shares their planner summary with a chosen broker (H2)
- S4.3 White-label planner for aggregator portals (H3)

**Experiments**
- E8: Track "questions panel" dwell + copy events as leading indicator of broker-conversation intent
- E9: Broker interviews: would a planner summary shorten your fact-find? What would make it useless?

---

## Prioritisation rationale

Opportunity 1 was built first: it gates everything else (no readiness verdict → no scenario, no strategy, no handoff). Opportunities 2 and 3 ship in the same prototype because they share the assessment's data model at near-zero marginal build cost — and together they answer the three questions every persona asks in sequence: *Can we? What if? In what order?*
