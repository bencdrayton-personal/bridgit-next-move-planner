export interface PlannerInputs {
  currentValue: number; // estimated value of current home
  mortgageBalance: number; // outstanding mortgage
  suburb: string;
  purchasePrice: number; // desired purchase price
  householdIncome: number; // gross annual household income
  timeframeMonths: number; // desired timeframe to move (months)
}

export type StrategyId = "buy-first" | "sell-first" | "wait";

export interface Strategy {
  id: StrategyId;
  title: string;
  recommended: boolean;
  rationale: string;
  advantages: string[];
  risks: string[];
  suitability: string; // who this suits
}

export interface Scenario {
  days: 30 | 60 | 90;
  label: string;
  bridgingCost: number; // estimated capitalised interest for the period
  riskLevel: "low" | "moderate" | "elevated";
  risks: string[];
  liquidity: string;
  actions: string[];
}

export interface RiskItem {
  id: "equity" | "timing" | "affordability" | "market";
  title: string;
  level: "low" | "moderate" | "elevated";
  summary: string;
}

export interface NextStep {
  title: string;
  detail: string;
  timeframe: string;
}

export interface PlannerResult {
  inputs: PlannerInputs;
  // Position
  equity: number;
  equityPct: number;
  currentLvr: number;
  peakDebt: number;
  peakLvr: number;
  endDebt: number;
  endLvr: number;
  purchaseCosts: number;
  // Scores
  readinessScore: number; // 0-100
  confidenceScore: number; // 0-100
  readinessBand: "ready" | "nearly" | "not-yet";
  explanation: string;
  scoreFactors: { label: string; score: number; note: string }[];
  // Features
  strategies: Strategy[];
  scenarios: Scenario[];
  risks: RiskItem[];
  nextSteps: NextStep[];
  brokerQuestions: string[];
}
