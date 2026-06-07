# Bridgit Next Move Planner

**Helping homeowners understand whether they're financially ready to buy before they sell.**

A product discovery, strategy and prototype project by [Ben Drayton](https://www.linkedin.com/in/bendrayton) — built as a working answer to the question: *if I joined Bridgit as Senior Product Manager, how would I identify, validate and prototype a strategic product opportunity?*

> ⚠️ This is an independent portfolio project. It is not affiliated with or endorsed by Bridgit, and it is not a lending product. All outputs are illustrative estimates — not financial, credit or property advice.

**Live demo:** _deployed on Vercel — link in repo About section_

---

## The problem

Australian homeowners considering a move can't get an honest, structured answer to the question that gates everything else: **"Can we buy our next home before selling this one?"**

Bank calculators answer loan size. Portals answer property value. Brokers answer everything — but customers delay that conversation until they privately believe they're viable. The result: finance understanding arrives *after* purchase decisions instead of before, forced sales, double moves (typically $8,000+ in avoidable cost), and a market where most eligible customers never discover bridging finance exists.

Bridgit's brand promise is *moving forward with confidence*. This project moves that promise upstream of the application.

## The product

A five-minute, anonymous planning experience:

1. **Move Readiness Assessment** — six plain-language questions → readiness score, confidence score, equity position, plain-English explanation
2. **Move Strategy Agent** — buy-first vs sell-first vs wait, with honest trade-offs and one suggested path (including "wait")
3. **Scenario Modeller** — 30/60/90-day sale scenarios with carrying costs in dollars and actions per scenario
4. **Risk Analysis** — equity, timing, affordability and market risk in consumer-friendly language
5. **Next Steps Planner** — band-specific action plan plus five questions to ask a broker

### The design principle that matters

**AI explains; deterministic maths decides.** The readiness engine mirrors real bridging credit logic — peak debt, combined-security LVR (capped at 85%, per Bridgit's published criteria), end-debt serviceability — and is fully auditable. The LLM layer (Claude, with graceful template fallback) translates positions into calm, jargon-free language. It never generates a number or a recommendation. In regulated consumer lending, that separation is the architecture.

## Product artefacts

The discovery and strategy work lives in [`/docs`](./docs):

| Artefact | What it covers |
|---|---|
| [vision.md](./docs/vision.md) | Three-horizon vision; the strategic bet |
| [product-strategy.md](./docs/product-strategy.md) | Where to play, how to win, what we won't do |
| [customer-research.md](./docs/customer-research.md) | Five personas with JTBD; cross-persona insights |
| [journey-maps.md](./docs/journey-maps.md) | Current vs future state, awareness → settlement |
| [opportunity-solution-tree.md](./docs/opportunity-solution-tree.md) | Outcome → opportunities → solutions → experiments |
| [prd.md](./docs/prd.md) | Full PRD: objectives, stories, acceptance criteria, risks, release plan |
| [roadmap.md](./docs/roadmap.md) | Outcome-based Now/Next/Later with kill criteria |
| [metrics.md](./docs/metrics.md) | North Star tree, guardrails, counter-metrics, event spec |
| [experiments.md](./docs/experiments.md) | Nine discovery experiments with pass/kill signals |
| [ai-opportunities.md](./docs/ai-opportunities.md) | AI across the full lending journey, prioritised |
| [risk-assessment.md](./docs/risk-assessment.md) | Regulatory (NCCP/RG 234), model, commercial risk |
| [delivery-plan.md](./docs/delivery-plan.md) | Sprint-level delivery plan with working agreements |
| [demo-script.md](./docs/demo-script.md) | 3–4 minute walkthrough script |

## Architecture

```
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Vercel

app/
  page.tsx              landing → assessment → results (client state machine)
  api/insights/route.ts AI narrative endpoint (Claude API, template fallback)
components/
  AssessmentForm.tsx    six-question stepper
  Results.tsx           score, strategies, scenarios, risks, next steps
lib/
  engine.ts             deterministic readiness engine (the credit logic)
  types.ts              domain model
```

No database, no auth, no stored PII — anonymity is a product decision (it's what makes the inputs honest), not a shortcut. The only network call sends suburb + derived ratios to the LLM; with no `ANTHROPIC_API_KEY` set, the app runs fully self-contained.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000

# optional — enables Claude-generated narratives:
echo "ANTHROPIC_API_KEY=sk-..." > .env.local
```

Try the demo persona: home $1,200,000 · mortgage $450,000 · target $1,650,000 · income $240,000 · 6 months — a "Nearly there" verdict that shows the honesty positioning.

## Walkthrough

1. Landing → **Check my readiness**
2. Six questions, one per screen (~2 minutes)
3. Results: readiness ring + four-factor breakdown + AI summary
4. Compare three sequencing strategies (one suggested, all honest)
5. Stress-test the sale timeline: 30/60/90 days in dollars
6. Leave with a plan and five broker questions

## What this project demonstrates

Product discovery (personas → opportunity tree → experiments with kill signals), lending domain depth (peak debt, end debt, LVR caps, serviceability, NCCP boundaries), AI judgement (where it helps, where it shouldn't decide, eval-gated rollout), and delivery thinking (iterative releases, pre-committed kill criteria, compliance as a first-class dependency). The full rationale is in the docs above — they're the actual portfolio piece; the prototype is the proof the thinking ships.

---

*Ben Drayton · June 2026 · [bencdrayton@gmail.com](mailto:bencdrayton@gmail.com)*
