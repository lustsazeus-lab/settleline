import { describe, expect, it } from "vitest";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "../src/domain/replay";
import { buildTradingSignals } from "../src/domain/signals";

describe("buildTradingSignals", () => {
  it("builds deterministic agent signals from TxLINE replay events", () => {
    const signals = buildTradingSignals({
      markets: getReplayMarkets(),
      fixtures: getReplayFixtures(),
      events: getReplayEvents(),
    });

    expect(signals).toHaveLength(2);
    expect(signals[0]).toMatchObject({
      marketId: "market-wc-001-winner",
      fixtureId: "wc-2026-demo-001",
      fixtureLine: "ARG vs FRA",
      workflowStatus: "settlement-ready",
      riskLevel: "medium",
      confidence: 0.84,
      proofSlot: 392100001,
      agentAction: "Verify the proof receipt before releasing mock escrow.",
    });
    expect(signals[0].summary).toContain("ARG leads settled result from final TxLINE replay score 2-1");
    expect(signals[0].riskReasons).toContain("One-goal final margin; keep the proof check visible before release.");

    expect(signals[1]).toMatchObject({
      marketId: "market-wc-001-total-goals",
      workflowStatus: "settlement-ready",
      riskLevel: "medium",
      confidence: 0.84,
    });
    expect(signals[1].riskReasons).toContain("Total finished 0.5 goals above the threshold.");
  });
});
