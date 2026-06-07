"use client";

import { useState } from "react";
import AssessmentForm from "@/components/AssessmentForm";
import Results from "@/components/Results";
import { assess } from "@/lib/engine";
import { PlannerInputs, PlannerResult } from "@/lib/types";

type Stage = "landing" | "assess" | "results";

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [result, setResult] = useState<PlannerResult | null>(null);

  const handleSubmit = (inputs: PlannerInputs) => {
    setResult(assess(inputs));
    setStage("results");
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="min-h-screen">
      <header className="border-b border-ink/5 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={() => setStage("landing")}
            className="text-lg font-extrabold tracking-tight text-forest"
          >
            Next Move <span className="text-leaf">Planner</span>
          </button>
          <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-ink/50">
            Product concept — not financial advice
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {stage === "landing" && (
          <div className="fade-up mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-leaf">
              From what is, to what&apos;s next
            </p>
            <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-forest sm:text-5xl">
              Could you buy your next home before selling this one?
            </h1>
            <p className="mx-auto mb-9 max-w-xl text-lg leading-relaxed text-ink/60">
              Most homeowners don&apos;t know their real position until they&apos;re deep in the
              process. Five minutes here gives you a clear, honest picture — your equity, your
              options, your risks, and your next step. Before you talk to anyone.
            </p>
            <button
              onClick={() => setStage("assess")}
              className="rounded-full bg-forest px-10 py-4 text-lg font-semibold text-white shadow-card transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Check my readiness
            </button>
            <p className="mt-4 text-xs text-ink/40">
              No sign-up. No credit check. Nothing stored.
            </p>

            <div className="mt-16 grid gap-4 text-left sm:grid-cols-3">
              {[
                {
                  title: "Know your position",
                  body: "A readiness score built on how bridging lenders actually assess a move — equity, peak borrowing, and what you'd carry after selling.",
                },
                {
                  title: "Compare your paths",
                  body: "Buy first, sell first, or wait — each path scored against your numbers, with honest trade-offs instead of a sales pitch.",
                },
                {
                  title: "Plan the what-ifs",
                  body: "See what a 30, 60 or 90-day sale means in dollars, and exactly what to do in each scenario.",
                },
              ].map((c) => (
                <div key={c.title} className="rounded-3xl bg-white p-6 shadow-card">
                  <h3 className="mb-2 text-base font-bold text-forest">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/55">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "assess" && <AssessmentForm onSubmit={handleSubmit} />}

        {stage === "results" && result && (
          <Results result={result} onRestart={() => setStage("assess")} />
        )}
      </div>

      <footer className="border-t border-ink/5 py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs leading-relaxed text-ink/40">
          <p>
            Next Move Planner is an independent product discovery prototype by Ben Drayton,
            exploring pre-application experiences for Buy Now, Sell Later property finance. It is
            not affiliated with, endorsed by, or built for production use by Bridgit. All outputs
            are illustrative estimates based on simplified assumptions — not financial, credit or
            property advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
