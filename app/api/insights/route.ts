import { NextRequest, NextResponse } from "next/server";

/**
 * AI narrative endpoint.
 *
 * Given the deterministic assessment, this produces a warm, personalised
 * summary in plain language. If ANTHROPIC_API_KEY is configured, it calls
 * Claude; otherwise it falls back to a well-crafted template so the demo
 * works with zero configuration. The scoring itself is ALWAYS deterministic —
 * the AI explains, it never decides. That separation is deliberate: in a
 * regulated lending context, the numbers must be auditable.
 */

export const runtime = "nodejs";
export const maxDuration = 30;

interface InsightRequest {
  suburb: string;
  readinessScore: number;
  readinessBand: string;
  equity: number;
  peakLvr: number;
  endDebt: number;
  timeframeMonths: number;
  recommendedStrategy: string;
}

export async function POST(req: NextRequest) {
  let body: InsightRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const narrative = await generateWithClaude(apiKey, body);
      if (narrative) {
        return NextResponse.json({ narrative, source: "claude" });
      }
    } catch {
      // fall through to template
    }
  }

  return NextResponse.json({ narrative: templateNarrative(body), source: "template" });
}

async function generateWithClaude(apiKey: string, d: InsightRequest): Promise<string | null> {
  const prompt = `You are a calm, plain-spoken property finance guide for Australian homeowners, writing inside a "Next Move Planner" tool. A homeowner just completed a readiness assessment. Write a single warm paragraph (90-130 words) summarising their position and what to do next.

Their numbers:
- Suburb: ${d.suburb || "not provided"}
- Readiness score: ${d.readinessScore}/100 (band: ${d.readinessBand})
- Usable equity: $${Math.round(d.equity / 1000)}k
- Peak borrowing vs combined property value: ${(d.peakLvr * 100).toFixed(0)}%
- Loan carried after selling: $${Math.round(d.endDebt / 1000)}k
- Timeframe to move: ${d.timeframeMonths} months
- Suggested path: ${d.recommendedStrategy}

Rules: no jargon (never say LVR, DTI, serviceability), no exclamation marks, no hype, no "don't miss out". Honest about trade-offs. Encourage talking to a broker as the natural next step, not a sales pitch. Australian context. Plain text only.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  return typeof text === "string" ? text.trim() : null;
}

function templateNarrative(d: InsightRequest): string {
  const equityK = `$${Math.round(d.equity / 1000)}k`;
  if (d.readinessBand === "ready") {
    return `You're in a strong position to make your next move${d.suburb ? ` from ${d.suburb}` : ""}. With ${equityK} of equity working for you, buying before you sell is a realistic path — you could secure the right home when it appears and sell on your own timeline rather than the market's. The numbers suggest the loan you'd carry afterwards is manageable for your household. The next step is turning this directional picture into a verified one: a conversation with a broker will confirm your borrowing power and surface anything these estimates can't see.`;
  }
  if (d.readinessBand === "nearly") {
    return `You're closer than you might think. ${equityK} of equity gives you a real foundation, though the numbers suggest your position would be working hard to carry both properties at once. Small changes shift this meaningfully — a sharper purchase budget, a stronger sale result, or a few more months of repayments. Rather than waiting passively, it's worth a conversation with a broker now: they can tell you exactly which lever moves you from nearly-ready to ready, and what to prepare in the meantime.`;
  }
  return `Right now, buying before you sell would stretch your position — and knowing that clearly is worth a lot. Your ${equityK} of equity is a starting point, not a verdict. The practical path is to build position: selling first if you need to move soon, or reducing your loan while the market does some of the work. Set a review date rather than an open-ended pause, and consider a short conversation with a broker to map exactly what 'ready' looks like for your situation.`;
}
