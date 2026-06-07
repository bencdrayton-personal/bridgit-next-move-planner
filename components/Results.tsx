"use client";

import { useEffect, useState } from "react";
import { PlannerResult, Scenario } from "@/lib/types";
import { aud, pct } from "@/lib/format";

interface Props {
  result: PlannerResult;
  onRestart: () => void;
}

const BAND_META = {
  ready: { label: "Ready to move", color: "text-leaf", ring: "#1F8A5D" },
  nearly: { label: "Nearly there", color: "text-amber", ring: "#B7791F" },
  "not-yet": { label: "Building position", color: "text-clay", ring: "#C2410C" },
} as const;

const LEVEL_STYLES = {
  low: "bg-mint text-forest",
  moderate: "bg-amber/10 text-amber",
  elevated: "bg-clay/10 text-clay",
} as const;

const LEVEL_LABELS = { low: "Low", moderate: "Moderate", elevated: "Elevated" } as const;

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  return (
    <svg viewBox="0 0 140 140" className="h-36 w-36">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#D9F2E5" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${c - filled}`}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="66" textAnchor="middle" className="fill-forest" fontSize="32" fontWeight="800">
        {score}
      </text>
      <text x="70" y="88" textAnchor="middle" className="fill-ink" opacity="0.45" fontSize="12" fontWeight="600">
        / 100
      </text>
    </svg>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-1 text-2xl font-bold text-forest">{value}</p>
      {hint && <p className="mt-1 text-xs leading-relaxed text-ink/50">{hint}</p>}
    </div>
  );
}

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-leaf">{kicker}</p>
      <h3 className="text-2xl font-bold tracking-tight text-forest">{title}</h3>
      {sub && <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink/60">{sub}</p>}
    </div>
  );
}

export default function Results({ result, onRestart }: Props) {
  const meta = BAND_META[result.readinessBand];
  const [scenario, setScenario] = useState<Scenario>(result.scenarios[1]);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [narrativeSource, setNarrativeSource] = useState<string>("");
  const recommended = result.strategies.find((s) => s.recommended);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/insights", {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        suburb: result.inputs.suburb,
        readinessScore: result.readinessScore,
        readinessBand: result.readinessBand,
        equity: result.equity,
        peakLvr: result.peakLvr,
        endDebt: result.endDebt,
        timeframeMonths: result.inputs.timeframeMonths,
        recommendedStrategy: recommended?.title ?? "",
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setNarrative(d.narrative);
        setNarrativeSource(d.source);
      })
      .catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fade-up space-y-16">
      {/* ===== Readiness ===== */}
      <section className="rounded-3xl bg-white p-8 shadow-card sm:p-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="shrink-0 text-center">
            <ScoreRing score={result.readinessScore} color={meta.ring} />
            <p className={`mt-2 text-base font-bold ${meta.color}`}>{meta.label}</p>
            <p className="mt-1 text-xs text-ink/45">Confidence {result.confidenceScore}%</p>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-leaf">
              Your move readiness
            </p>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-forest sm:text-3xl">
              {result.inputs.suburb ? `Your position in ${result.inputs.suburb}` : "Your position"}
            </h2>
            <p className="text-base leading-relaxed text-ink/70">{result.explanation}</p>
            {narrative && narrative !== result.explanation && (
              <div className="mt-5 rounded-2xl bg-sage p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-leaf">
                  {narrativeSource === "claude" ? "AI summary" : "Plain-language summary"}
                </p>
                <p className="text-sm leading-relaxed text-ink/70">{narrative}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Usable equity"
            value={aud(result.equity)}
            hint={`You own about ${pct(result.equityPct)} of your current home.`}
          />
          <Stat
            label="Peak position"
            value={pct(result.peakLvr)}
            hint="Total borrowing against both properties during the transition."
          />
          <Stat
            label="Loan after selling"
            value={aud(result.endDebt)}
            hint="What you'd carry forward once your current home settles."
          />
          <Stat
            label="Purchase costs"
            value={aud(result.purchaseCosts)}
            hint="Estimated stamp duty and transaction costs on your next home."
          />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {result.scoreFactors.map((f) => (
            <div key={f.label} className="rounded-2xl bg-sage p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-forest">{f.label}</p>
                <p className="text-sm font-bold text-forest">{f.score}</p>
              </div>
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-leaf"
                  style={{ width: `${f.score}%` }}
                />
              </div>
              <p className="text-xs leading-relaxed text-ink/55">{f.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Strategies ===== */}
      <section>
        <SectionTitle
          kicker="Move strategy"
          title="Three ways to sequence your move"
          sub="There's no universally right order — only the right order for your position. Here's how each path looks for you."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {result.strategies.map((s) => (
            <div
              key={s.id}
              className={`relative flex flex-col rounded-3xl p-7 shadow-card ${
                s.recommended ? "bg-forest text-white ring-2 ring-leaf" : "bg-white"
              }`}
            >
              {s.recommended && (
                <span className="absolute -top-3 left-6 rounded-full bg-leaf px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Suggested for you
                </span>
              )}
              <h4 className={`mb-2 text-xl font-bold ${s.recommended ? "text-white" : "text-forest"}`}>
                {s.title}
              </h4>
              <p className={`mb-5 text-sm leading-relaxed ${s.recommended ? "text-white/80" : "text-ink/60"}`}>
                {s.rationale}
              </p>
              <div className="mb-4">
                <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${s.recommended ? "text-mint" : "text-leaf"}`}>
                  Works in your favour
                </p>
                <ul className="space-y-1.5">
                  {s.advantages.map((a) => (
                    <li key={a} className={`text-sm leading-relaxed ${s.recommended ? "text-white/85" : "text-ink/70"}`}>
                      <span className={s.recommended ? "text-mint" : "text-leaf"}>✓</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-5">
                <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${s.recommended ? "text-white/60" : "text-ink/40"}`}>
                  Worth watching
                </p>
                <ul className="space-y-1.5">
                  {s.risks.map((r) => (
                    <li key={r} className={`text-sm leading-relaxed ${s.recommended ? "text-white/70" : "text-ink/55"}`}>
                      <span>•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <p className={`mt-auto border-t pt-4 text-xs leading-relaxed ${s.recommended ? "border-white/15 text-white/60" : "border-ink/10 text-ink/50"}`}>
                {s.suitability}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Scenarios ===== */}
      <section>
        <SectionTitle
          kicker="Scenario modelling"
          title="What if your sale takes longer?"
          sub="The biggest unknown in buying first is how quickly your current home sells. Here's what each timeline means for you, in dollars and decisions."
        />
        <div className="rounded-3xl bg-white p-7 shadow-card sm:p-8">
          <div className="mb-7 flex gap-2">
            {result.scenarios.map((s) => (
              <button
                key={s.days}
                onClick={() => setScenario(s)}
                className={`flex-1 rounded-2xl px-4 py-3 text-center transition-colors ${
                  scenario.days === s.days
                    ? "bg-forest text-white"
                    : "bg-sage text-ink/60 hover:bg-mint"
                }`}
              >
                <span className="block text-lg font-bold">{s.days} days</span>
                <span className={`block text-xs ${scenario.days === s.days ? "text-white/70" : "text-ink/45"}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2" key={scenario.days}>
            <div>
              <div className="mb-5 flex items-baseline gap-3">
                <p className="text-3xl font-extrabold text-forest">{aud(scenario.bridgingCost)}</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${LEVEL_STYLES[scenario.riskLevel]}`}>
                  {LEVEL_LABELS[scenario.riskLevel]} risk
                </span>
              </div>
              <p className="mb-4 text-sm text-ink/55">
                Estimated carrying cost if your sale takes {scenario.days} days — interest accrues
                during the bridge rather than as monthly repayments.
              </p>
              <p className="text-sm leading-relaxed text-ink/70">{scenario.liquidity}</p>
              <ul className="mt-4 space-y-2">
                {scenario.risks.map((r) => (
                  <li key={r} className="text-sm leading-relaxed text-ink/55">
                    • {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-sage p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-leaf">
                What to do in this scenario
              </p>
              <ol className="space-y-3">
                {scenario.actions.map((a, i) => (
                  <li key={a} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Risks ===== */}
      <section>
        <SectionTitle
          kicker="Risk picture"
          title="Four things that shape your move"
          sub="Plain-language risk, no fine print. Knowing these now is what 'moving with confidence' actually means."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {result.risks.map((r) => (
            <div key={r.id} className="rounded-3xl bg-white p-6 shadow-card">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-base font-bold text-forest">{r.title}</h4>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${LEVEL_STYLES[r.level]}`}>
                  {LEVEL_LABELS[r.level]}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink/60">{r.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Next steps ===== */}
      <section>
        <SectionTitle
          kicker="Next steps"
          title="Your plan from here"
          sub="Confidence comes from knowing the next step, not all twenty. Here are yours."
        />
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            {result.nextSteps.map((s, i) => (
              <div key={s.title} className="flex gap-4 rounded-3xl bg-white p-6 shadow-card">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-bold text-forest">
                  {i + 1}
                </span>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-forest">{s.title}</h4>
                    <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-semibold text-ink/50">
                      {s.timeframe}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/60">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-forest p-7 text-white shadow-card lg:col-span-2">
            <h4 className="mb-1 text-lg font-bold">Questions to ask a broker</h4>
            <p className="mb-5 text-sm text-white/60">
              Walk in informed. These five questions turn a sales conversation into a planning one.
            </p>
            <ul className="space-y-3">
              {result.brokerQuestions.map((q) => (
                <li key={q} className="flex gap-2.5 text-sm leading-relaxed text-white/85">
                  <span className="text-mint">→</span> {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Footer actions ===== */}
      <section className="rounded-3xl bg-mint p-8 text-center sm:p-10">
        <h3 className="mb-2 text-2xl font-bold text-forest">This is a starting point, not a verdict</h3>
        <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-ink/60">
          Everything above is built from your estimates and simplified assumptions. The numbers are
          directional — designed to help you walk into a real conversation informed, not to replace one.
        </p>
        <button
          onClick={onRestart}
          className="rounded-full bg-forest px-8 py-3.5 text-base font-semibold text-white shadow-card transition-transform hover:scale-[1.02]"
        >
          Try different numbers
        </button>
      </section>
    </div>
  );
}
