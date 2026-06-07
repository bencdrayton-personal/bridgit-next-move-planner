"use client";

import { useState } from "react";
import { PlannerInputs } from "@/lib/types";

interface Props {
  onSubmit: (inputs: PlannerInputs) => void;
}

interface Field {
  key: keyof PlannerInputs;
  question: string;
  helper: string;
  type: "currency" | "text" | "months";
  placeholder: string;
}

const FIELDS: Field[] = [
  {
    key: "currentValue",
    question: "What's your current home worth?",
    helper: "Your best estimate is fine — a recent appraisal or online estimate works. We'll treat it as a starting point, not a fact.",
    type: "currency",
    placeholder: "1,200,000",
  },
  {
    key: "mortgageBalance",
    question: "What's left on your mortgage?",
    helper: "The approximate payout figure on your current home loan. Round numbers are fine.",
    type: "currency",
    placeholder: "450,000",
  },
  {
    key: "suburb",
    question: "Which suburb is your home in?",
    helper: "This helps frame your sale timing and local market context.",
    type: "text",
    placeholder: "e.g. Lane Cove",
  },
  {
    key: "purchasePrice",
    question: "What would your next home cost?",
    helper: "The price range you're realistically looking at — use the top of your range to keep the plan honest.",
    type: "currency",
    placeholder: "1,650,000",
  },
  {
    key: "householdIncome",
    question: "What's your household income?",
    helper: "Combined gross annual income, before tax. This stays on your device — we don't store it.",
    type: "currency",
    placeholder: "240,000",
  },
  {
    key: "timeframeMonths",
    question: "When would you like to move?",
    helper: "Your ideal timeframe. There's no wrong answer — it changes the strategy, not the verdict.",
    type: "months",
    placeholder: "6",
  },
];

const MONTH_OPTIONS = [
  { value: 2, label: "As soon as possible" },
  { value: 6, label: "Within 6 months" },
  { value: 12, label: "Within a year" },
  { value: 24, label: "1–2 years away" },
];

export default function AssessmentForm({ onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const field = FIELDS[step];
  const isLast = step === FIELDS.length - 1;

  const formatCurrencyInput = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("en-AU");
  };

  const handleChange = (raw: string) => {
    setError(null);
    if (field.type === "currency") {
      setValues({ ...values, [field.key]: formatCurrencyInput(raw) });
    } else {
      setValues({ ...values, [field.key]: raw });
    }
  };

  const numeric = (key: string) => Number((values[key] || "").replace(/[^0-9]/g, ""));

  const validate = (): string | null => {
    if (field.type === "currency") {
      const n = numeric(field.key);
      if (!n) return "Enter an approximate figure — estimates are fine.";
      if (field.key === "currentValue" && n < 100000) return "That looks low for a property value — double-check the digits.";
      if (field.key === "purchasePrice" && n < 100000) return "That looks low for a purchase price — double-check the digits.";
      if (field.key === "householdIncome" && n < 20000) return "That looks low for an annual figure — double-check the digits.";
    }
    if (field.type === "text" && !(values[field.key] || "").trim()) {
      return "Add your suburb so the plan has local context.";
    }
    if (field.type === "months" && !values[field.key]) {
      return "Pick the timeframe that feels closest.";
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    if (isLast) {
      onSubmit({
        currentValue: numeric("currentValue"),
        mortgageBalance: numeric("mortgageBalance"),
        suburb: (values.suburb || "").trim(),
        purchasePrice: numeric("purchasePrice"),
        householdIncome: numeric("householdIncome"),
        timeframeMonths: Number(values.timeframeMonths),
      });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl fade-up" key={step}>
      <div className="mb-8 flex items-center gap-2">
        {FIELDS.map((f, i) => (
          <div
            key={f.key}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-leaf" : "bg-mint"
            }`}
          />
        ))}
      </div>

      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-leaf">
        Step {step + 1} of {FIELDS.length}
      </p>
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-forest">
        {field.question}
      </h2>
      <p className="mb-8 text-base leading-relaxed text-ink/60">{field.helper}</p>

      {field.type === "months" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {MONTH_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setError(null);
                setValues({ ...values, timeframeMonths: String(opt.value) });
              }}
              className={`rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition-all ${
                values.timeframeMonths === String(opt.value)
                  ? "border-leaf bg-mint text-forest"
                  : "border-ink/10 bg-white text-ink/70 hover:border-leaf/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="relative">
          {field.type === "currency" && (
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl font-semibold text-ink/40">
              $
            </span>
          )}
          <input
            autoFocus
            inputMode={field.type === "currency" ? "numeric" : "text"}
            value={values[field.key] || ""}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && next()}
            placeholder={field.placeholder}
            className={`w-full rounded-2xl border-2 border-ink/10 bg-white py-4 text-xl font-semibold text-forest outline-none transition-colors placeholder:font-normal placeholder:text-ink/25 focus:border-leaf ${
              field.type === "currency" ? "pl-10 pr-5" : "px-5"
            }`}
          />
        </div>
      )}

      {error && <p className="mt-3 text-sm font-medium text-clay">{error}</p>}

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          className={`text-sm font-semibold text-ink/50 hover:text-ink ${step === 0 ? "invisible" : ""}`}
        >
          ← Back
        </button>
        <button
          onClick={next}
          className="rounded-full bg-forest px-8 py-3.5 text-base font-semibold text-white shadow-card transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLast ? "See my position" : "Continue"}
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-ink/40">
        Nothing you enter is stored or sent anywhere except to generate your plan.
      </p>
    </div>
  );
}
