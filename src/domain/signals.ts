import { settleMarket } from "./settlement";
import type { Fixture, Market, SettlementOutcome, TxLineReplayEvent } from "./types";

export type TradingSignal = {
  marketId: string;
  fixtureId: string;
  fixtureLine: string;
  label: string;
  summary: string;
  workflowStatus: "settlement-ready" | "watching" | "needs-review";
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  proofSlot: number | null;
  agentAction: string;
  riskReasons: string[];
};

export function buildTradingSignals({
  markets,
  fixtures,
  events,
}: {
  markets: Market[];
  fixtures: Fixture[];
  events: TxLineReplayEvent[];
}): TradingSignal[] {
  return markets.map((market) => {
    const fixture = fixtures.find((item) => item.id === market.fixtureId);
    const event = latestEventForFixture(events, market.fixtureId);

    if (!fixture || !event) {
      return buildMissingDataSignal(market, fixture);
    }

    const eventFixture: Fixture = {
      ...fixture,
      score: event.score,
      status: event.status,
    };
    const outcome = event.status === "finished" ? settleMarket(market, eventFixture) : undefined;
    const riskReasons = buildRiskReasons(market, eventFixture, event);
    const closeMarket = riskReasons.some((reason) => reason.includes("margin") || reason.includes("threshold"));
    const riskLevel = event.status !== "finished" ? "high" : closeMarket || event.serviceLevel === 12 ? "medium" : "low";

    return {
      marketId: market.id,
      fixtureId: fixture.id,
      fixtureLine: `${fixture.homeTeam.shortName} vs ${fixture.awayTeam.shortName}`,
      label: market.label,
      summary: buildSignalSummary(market, eventFixture, outcome),
      workflowStatus: event.status === "finished" ? "settlement-ready" : "watching",
      riskLevel,
      confidence: confidenceFor(event, closeMarket),
      proofSlot: event.proof.slot,
      agentAction:
        event.status === "finished"
          ? "Verify the proof receipt before releasing mock escrow."
          : "Wait for a finished TxLINE event before settlement.",
      riskReasons,
    };
  });
}

function latestEventForFixture(events: TxLineReplayEvent[], fixtureId: string): TxLineReplayEvent | undefined {
  return events
    .filter((event) => event.fixtureId === fixtureId)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))[0];
}

function buildMissingDataSignal(market: Market, fixture: Fixture | undefined): TradingSignal {
  return {
    marketId: market.id,
    fixtureId: market.fixtureId,
    fixtureLine: fixture ? `${fixture.homeTeam.shortName} vs ${fixture.awayTeam.shortName}` : "Fixture missing",
    label: market.label,
    summary: "No current TxLINE event is available for this market.",
    workflowStatus: "needs-review",
    riskLevel: "high",
    confidence: 0,
    proofSlot: null,
    agentAction: "Do not settle or simulate release until replay data is restored.",
    riskReasons: ["Missing fixture or TxLINE event data."],
  };
}

function buildSignalSummary(market: Market, fixture: Fixture, outcome: SettlementOutcome | undefined): string {
  if (!outcome) {
    return `${market.label} is still waiting on a final TxLINE event.`;
  }

  const score = `${fixture.score.home}-${fixture.score.away}`;
  if (market.kind === "match-winner") {
    return `${outcome.winningSelection} leads settled result from final TxLINE replay score ${score}.`;
  }

  return `${outcome.winningSelection} resolves total goals from final TxLINE replay score ${score}.`;
}

function buildRiskReasons(market: Market, fixture: Fixture, event: TxLineReplayEvent): string[] {
  const reasons = [`TxLINE service level ${event.serviceLevel} replay proof attached at slot ${event.proof.slot}.`];

  if (fixture.status !== "finished") {
    reasons.push("Fixture is not final; signal remains watch-only.");
  }

  if (market.kind === "match-winner") {
    const margin = Math.abs(fixture.score.home - fixture.score.away);
    if (margin <= 1) {
      reasons.push("One-goal final margin; keep the proof check visible before release.");
    }
  }

  if (market.kind === "total-goals-over" && typeof market.threshold === "number") {
    const totalGoals = fixture.score.home + fixture.score.away;
    const thresholdGap = Math.abs(totalGoals - market.threshold);
    if (thresholdGap <= 0.5) {
      reasons.push(`Total finished ${thresholdGap} goals above the threshold.`);
    }
  }

  reasons.push("No autonomous trading or wagering.");
  return reasons;
}

function confidenceFor(event: TxLineReplayEvent, closeMarket: boolean): number {
  const base = event.serviceLevel === 1 ? 0.92 : 0.78;
  const closeMarketPenalty = closeMarket ? 0.08 : 0;
  const livePenalty = event.status === "finished" ? 0 : 0.18;
  return Number(Math.max(0, base - closeMarketPenalty - livePenalty).toFixed(2));
}
