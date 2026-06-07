import {
  PlannerInputs,
  PlannerResult,
  Strategy,
  Scenario,
  RiskItem,
  NextStep,
} from "./types";

/**
 * Deterministic readiness engine.
 *
 * The maths deliberately mirrors how a bridging lender actually assesses a
 * transition (peak debt, combined-security LVR, end debt) rather than a
 * generic mortgage calculator. Parameters are anchored to publicly listed
 * Bridgit lending criteria as at June 2026:
 *   - peak-debt LVR cap ~85% (12-month term)
 *   - bridge rate ~8.99% p.a., capitalised (no monthly repayments)
 *   - minimum loan $300k
 * All outputs are illustrative and rounded for a consumer audience.
 * This is a discovery prototype, not credit advice.
 */

const BRIDGE_RATE = 0.0899; // p.a., capitalised during bridge period
const PEAK_LVR_CAP = 0.85;
const COMFORT_LVR = 0.75; // comfortable headroom threshold
const STAMP_DUTY_RATE = 0.045; // simplified NSW-ish blended estimate
const TRANSACTION_COSTS = 3500; // legal + misc, simplified
const SELLING_COST_RATE = 0.02; // agent fees + marketing on sale
const DTI_CAP = 6; // common serviceability ceiling
const DTI_COMFORT = 4.5;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round1k = (n: number) => Math.round(n / 1000) * 1000;

export function assess(inputs: PlannerInputs): PlannerResult {
  const { currentValue, mortgageBalance, purchasePrice, householdIncome, timeframeMonths } = inputs;

  // --- Position ---
  const equity = Math.max(0, currentValue - mortgageBalance);
  const equityPct = currentValue > 0 ? equity / currentValue : 0;
  const currentLvr = currentValue > 0 ? mortgageBalance / currentValue : 0;

  const purchaseCosts = purchasePrice * STAMP_DUTY_RATE + TRANSACTION_COSTS;
  // Peak debt: payout existing mortgage + fund new purchase + costs
  const peakDebt = mortgageBalance + purchasePrice + purchaseCosts;
  const combinedSecurity = currentValue + purchasePrice;
  const peakLvr = combinedSecurity > 0 ? peakDebt / combinedSecurity : 1;

  // End debt: what remains after sale proceeds (net of selling costs) repay the bridge
  const netSaleProceeds = currentValue * (1 - SELLING_COST_RATE);
  const endDebt = Math.max(0, peakDebt - netSaleProceeds);
  const endLvr = purchasePrice > 0 ? endDebt / purchasePrice : 0;

  // If nothing is carried forward after the sale, there is nothing to service —
  // affordability is a non-issue regardless of income (the asset-rich downsizer case).
  const dti = endDebt === 0 ? 0 : householdIncome > 0 ? endDebt / householdIncome : Infinity;

  // --- Score factors (each 0-100) ---
  // 1. Equity headroom: how far peak LVR sits inside the 85% cap
  const equityScore = clamp(((PEAK_LVR_CAP - peakLvr) / (PEAK_LVR_CAP - 0.5)) * 100, 0, 100);
  // 2. Affordability: end-debt-to-income against serviceability ceiling
  const affordabilityScore = clamp(((DTI_CAP - dti) / (DTI_CAP - 2)) * 100, 0, 100);
  // 3. Timeframe: bridging suits 3-12 month horizons; very short or very long is harder
  const timeframeScore =
    timeframeMonths >= 3 && timeframeMonths <= 12
      ? 100
      : timeframeMonths < 3
        ? 60
        : clamp(100 - (timeframeMonths - 12) * 8, 30, 100);
  // 4. Buffer: equity remaining after the move as a share of new home value
  const bufferScore = clamp((1 - endLvr) * 125, 0, 100);

  const readinessScore = Math.round(
    equityScore * 0.4 + affordabilityScore * 0.3 + timeframeScore * 0.15 + bufferScore * 0.15
  );

  // Confidence reflects how clear-cut the position is (distance from thresholds)
  const edgeDistance = Math.min(
    Math.abs(PEAK_LVR_CAP - peakLvr) / 0.1,
    Math.abs(DTI_CAP - dti) / 1.5,
    1
  );
  const confidenceScore = Math.round(clamp(55 + edgeDistance * 45, 0, 100));

  const readinessBand: PlannerResult["readinessBand"] =
    readinessScore >= 70 && peakLvr <= PEAK_LVR_CAP ? "ready"
    : readinessScore >= 45 ? "nearly"
    : "not-yet";

  const explanation = buildExplanation(readinessBand, peakLvr, dti, equity, endDebt);

  const scoreFactors = [
    {
      label: "Equity headroom",
      score: Math.round(equityScore),
      note: `Peak position is ${(peakLvr * 100).toFixed(0)}% of combined property value (lenders typically cap around ${PEAK_LVR_CAP * 100}%).`,
    },
    {
      label: "Affordability",
      score: Math.round(affordabilityScore),
      note: `Your remaining loan after selling would be about ${dti === Infinity ? "—" : dti.toFixed(1)}× household income.`,
    },
    {
      label: "Timing fit",
      score: Math.round(timeframeScore),
      note: timeframeMonths <= 12
        ? "Your timeframe fits a typical bridging window."
        : "A longer timeframe gives flexibility but extends carrying costs.",
    },
    {
      label: "Post-move buffer",
      score: Math.round(bufferScore),
      note: `After selling, you'd own roughly ${clamp((1 - endLvr) * 100, 0, 100).toFixed(0)}% of your next home.`,
    },
  ];

  // --- Strategies ---
  const strategies = buildStrategies(readinessBand, peakLvr, dti, equity, timeframeMonths);

  // --- Scenarios ---
  const scenarios = ([30, 60, 90] as const).map((days) =>
    buildScenario(days, peakDebt, peakLvr)
  );

  // --- Risks ---
  const risks = buildRisks(peakLvr, dti, timeframeMonths, equityPct);

  // --- Next steps ---
  const { nextSteps, brokerQuestions } = buildNextSteps(readinessBand, inputs);

  return {
    inputs,
    equity: round1k(equity),
    equityPct,
    currentLvr,
    peakDebt: round1k(peakDebt),
    peakLvr,
    endDebt: round1k(endDebt),
    endLvr,
    purchaseCosts: round1k(purchaseCosts),
    readinessScore,
    confidenceScore,
    readinessBand,
    explanation,
    scoreFactors,
    strategies,
    scenarios,
    risks,
    nextSteps,
    brokerQuestions,
  };
}

function buildExplanation(
  band: PlannerResult["readinessBand"],
  peakLvr: number,
  dti: number,
  equity: number,
  endDebt: number
): string {
  const equityStr = `$${Math.round(equity / 1000)}k of equity`;
  if (band === "ready") {
    return `Your position looks solid. With ${equityStr} and a peak borrowing position around ${(peakLvr * 100).toFixed(0)}% of combined property value, buying before you sell is realistic. After your current home sells, you'd carry roughly $${Math.round(endDebt / 1000)}k forward — a manageable load for your income.`;
  }
  if (band === "nearly") {
    return `You're close. ${equityStr} gives you a genuine starting point, but your peak position (${(peakLvr * 100).toFixed(0)}% of combined value) ${peakLvr > 0.85 ? "sits above the level most bridging lenders accept" : "leaves limited headroom"}${dti > DTI_COMFORT ? ", and the loan you'd carry afterwards is on the higher side for your income" : ""}. Small changes — a sharper purchase price, a stronger sale result, or a little more time — shift this meaningfully.`;
  }
  return `Buying before selling would stretch your position right now. The numbers suggest your equity and income would be working very hard to carry both properties at once. That doesn't mean you can't move — it means sequencing matters. Selling first, or waiting while your equity builds, puts you in a far stronger position.`;
}

function buildStrategies(
  band: PlannerResult["readinessBand"],
  peakLvr: number,
  dti: number,
  equity: number,
  timeframeMonths: number
): Strategy[] {
  const buyFirstViable = peakLvr <= PEAK_LVR_CAP && dti <= DTI_CAP;
  const recommended: Strategy["id"] =
    band === "ready" ? "buy-first" : band === "nearly" ? (buyFirstViable ? "buy-first" : "sell-first") : timeframeMonths > 9 ? "wait" : "sell-first";

  return [
    {
      id: "buy-first",
      title: "Buy before you sell",
      recommended: recommended === "buy-first",
      rationale: buyFirstViable
        ? "Your equity can carry both properties through a bridging window, which means you can secure the right home when it appears and sell on your own timeline."
        : "Your peak borrowing position sits beyond the headroom most bridging lenders allow, so this path would need a lower purchase price or more equity first.",
      advantages: [
        "Move once — no renting, storage or double moves in between",
        "Buy when the right property appears, not when your sale forces you to",
        "Sell from a settled position, with time to present and price well",
      ],
      risks: [
        "Carrying costs accrue until your current home sells",
        "A slower sale or softer price increases the loan you carry forward",
        "Requires discipline on the purchase price to protect headroom",
      ],
      suitability: "Suits homeowners with solid equity who have found (or expect to find) their next home before they're ready to sell.",
    },
    {
      id: "sell-first",
      title: "Sell, then buy",
      recommended: recommended === "sell-first",
      rationale: "Selling first converts your equity to certainty — you know exactly what you have to spend before you commit. The trade-off is the gap between homes.",
      advantages: [
        "Complete certainty on your budget before you buy",
        "No bridging or carrying costs",
        "Stronger negotiating position as an unconditional buyer",
      ],
      risks: [
        "You may need to rent or store between homes (industry research puts the typical cost above $8,000)",
        "Pressure to buy quickly can mean compromising on the next home",
        "If the market rises while you're out of it, your budget shrinks in real terms",
      ],
      suitability: "Suits homeowners whose equity is tight, or who value budget certainty over convenience.",
    },
    {
      id: "wait",
      title: "Wait and build position",
      recommended: recommended === "wait",
      rationale: "Time is a financial strategy. Reducing your mortgage and letting equity build moves you from 'stretched' to 'strong' — often within 12–24 months.",
      advantages: [
        "Every repayment and market movement adds headroom",
        "You watch the market for your next suburb without pressure",
        "More options (including buy-first) become available later",
      ],
      risks: [
        "Your target market may rise faster than your equity builds",
        "Life timing (school, family, work) doesn't always wait",
        "Motivation can fade — set a review date, not an open-ended pause",
      ],
      suitability: "Suits homeowners early in their equity journey, or whose move is desirable rather than necessary.",
    },
  ];
}

function buildScenario(days: 30 | 60 | 90, peakDebt: number, peakLvr: number): Scenario {
  const bridgingCost = round1k(peakDebt * BRIDGE_RATE * (days / 365));
  const riskLevel: Scenario["riskLevel"] = days === 30 ? "low" : days === 60 ? "moderate" : peakLvr > COMFORT_LVR ? "elevated" : "moderate";

  const base = {
    30: {
      label: "Fast sale",
      risks: [
        "Minimal carrying cost, but a fast sale can mean accepting an early offer",
        "Less time to prepare and present the property at its best",
      ],
      liquidity: "Carrying costs stay small. The main liquidity question is whether a quick result leaves money on the table.",
      actions: [
        "Have the property photo-ready and legally prepared (contract, pest/building) before listing",
        "Set a realistic reserve with your agent before the campaign starts",
        "Line up your settlement dates so the bridge closes cleanly",
      ],
    },
    60: {
      label: "Typical campaign",
      risks: [
        "Carrying costs accumulate through a standard 4–6 week campaign plus settlement",
        "Buyer interest depends on presentation and pricing in the first two weeks",
      ],
      liquidity: "This is the planning baseline for most suburbs. Budget the carrying cost into your move so it never surprises you.",
      actions: [
        "List within 2–3 weeks of settling your purchase to keep the window tight",
        "Review pricing feedback at the end of week two and adjust early, not late",
        "Keep a contingency buffer for one extra month of carrying costs",
      ],
    },
    90: {
      label: "Slow market",
      risks: [
        "Carrying costs become material and compound the longer the sale runs",
        "Extended campaigns can signal staleness to buyers, pressuring price",
      ],
      liquidity: "A 90-day sale tests your buffer. If this scenario worries you, that's a signal to discuss price strategy and lender flexibility upfront.",
      actions: [
        "Agree a price-reduction trigger with your agent before listing, not during",
        "Confirm your lender's term flexibility before you need it",
        "Consider staging and a refreshed campaign rather than waiting passively",
      ],
    },
  }[days];

  return { days, bridgingCost, riskLevel, ...base };
}

function buildRisks(peakLvr: number, dti: number, timeframeMonths: number, equityPct: number): RiskItem[] {
  return [
    {
      id: "equity",
      title: "Equity risk",
      level: peakLvr > PEAK_LVR_CAP ? "elevated" : peakLvr > COMFORT_LVR ? "moderate" : "low",
      summary:
        peakLvr > PEAK_LVR_CAP
          ? "Your combined borrowing would exceed the level most lenders accept. More equity, a lower purchase price, or selling first closes this gap."
          : peakLvr > COMFORT_LVR
            ? "Your equity covers the move, but with limited spare room. A weaker sale price would be felt — keep a margin in your purchase budget."
            : "Your equity comfortably covers the move with room to spare, even if the sale lands below expectations.",
    },
    {
      id: "timing",
      title: "Timing risk",
      level: timeframeMonths < 3 ? "elevated" : timeframeMonths > 12 ? "moderate" : "low",
      summary:
        timeframeMonths < 3
          ? "A very tight timeframe compresses every decision — pre-approval, purchase, and sale prep need to run in parallel."
          : timeframeMonths > 12
            ? "A long runway is comfortable but markets move. Re-check your numbers each quarter so the plan stays current."
            : "Your timeframe fits a standard transition window — enough time to do each step properly without drifting.",
    },
    {
      id: "affordability",
      title: "Affordability risk",
      level: dti > DTI_CAP ? "elevated" : dti > DTI_COMFORT ? "moderate" : "low",
      summary:
        dti > DTI_CAP
          ? "The loan you'd carry after selling is large relative to income. A lender will want to see how this services — worth modelling carefully with a broker."
          : dti > DTI_COMFORT
            ? "The ongoing loan is serviceable but meaningful. Stress-test it against a rate rise before committing."
            : "The loan you'd carry forward sits comfortably within typical serviceability levels for your income.",
    },
    {
      id: "market",
      title: "Market uncertainty",
      level: equityPct < 0.3 ? "moderate" : "low",
      summary:
        equityPct < 0.3
          ? "With a thinner equity base, you're more exposed to valuation movement between buying and selling. Conservative price assumptions are your friend."
          : "Your equity base absorbs normal market movement. Use conservative sale assumptions anyway — upside should be a bonus, not a requirement.",
    },
  ];
}

function buildNextSteps(
  band: PlannerResult["readinessBand"],
  inputs: PlannerInputs
): { nextSteps: NextStep[]; brokerQuestions: string[] } {
  const common: NextStep[] = [
    {
      title: "Get a real valuation, not an estimate",
      detail: `Online estimates for ${inputs.suburb || "your suburb"} can vary 10%+ from appraisal. Two local agent appraisals anchor everything else in this plan.`,
      timeframe: "This week",
    },
    {
      title: "Confirm your borrowing position",
      detail: "A broker or lender can convert this directional picture into a verified one — income, expenses, and the structure that fits your move.",
      timeframe: "Next 2 weeks",
    },
  ];

  const byBand: Record<PlannerResult["readinessBand"], NextStep[]> = {
    ready: [
      {
        title: "Get pre-approved before you fall in love with a property",
        detail: "Pre-approval converts your readiness into buying power. It also reveals any surprises while there's still time to fix them.",
        timeframe: "Next 2–4 weeks",
      },
      {
        title: "Prepare your sale in parallel",
        detail: "Contract of sale, building/pest, and presentation work done now means you can list within weeks of buying — shrinking your bridging window and its cost.",
        timeframe: "Next 4–6 weeks",
      },
    ],
    nearly: [
      {
        title: "Decide which lever to pull",
        detail: "You're one move from ready: a lower purchase target, a stronger valuation, or modest debt reduction. Pick the lever you control most.",
        timeframe: "Next 4 weeks",
      },
      {
        title: "Re-run this plan after each change",
        detail: "Readiness isn't static. When your valuation or balance changes, the picture changes with it.",
        timeframe: "Ongoing",
      },
    ],
    "not-yet": [
      {
        title: "Set a building-position plan",
        detail: "Work out the gap between today's equity and a comfortable move, then set a monthly target. Concrete numbers beat vague intentions.",
        timeframe: "This month",
      },
      {
        title: "Put a review date in the calendar",
        detail: "Markets and balances move. A six-month review keeps the goal alive without daily anxiety.",
        timeframe: "6 months",
      },
    ],
  };

  const brokerQuestions = [
    "What loan amount would I realistically be approved for, and at what rate?",
    "How would a bridging structure work for my situation — and what happens if my sale takes longer than expected?",
    "What does my repayment look like after the sale, and how does it change if rates rise 1%?",
    "Are there costs or conditions in my current loan (break fees, discharge timing) I should plan around?",
    "What paperwork should I prepare now to make approval fast when I'm ready?",
  ];

  return { nextSteps: [...common, ...byBand[band]], brokerQuestions };
}
