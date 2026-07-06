import { describe, expect, it } from "vitest";
import { buildProofReceipt } from "../src/domain/proofs";
import type { SettlementOutcome, TxLineReplayEvent } from "../src/domain/types";

describe("buildProofReceipt", () => {
  it("creates a deterministic receipt id", () => {
    const outcome: SettlementOutcome = {
      marketId: "market-1",
      winningSelection: "ARG",
      reason: "Argentina defeated France 2-1.",
      settledAt: "2026-07-12T19:00:00.000Z",
    };
    const event: TxLineReplayEvent = {
      id: "event-1",
      fixtureId: "fixture-1",
      receivedAt: "2026-07-12T21:03:00.000Z",
      source: "txline-replay",
      serviceLevel: 1,
      status: "finished",
      score: { home: 2, away: 1 },
      proof: {
        merkleRoot: "0xabc",
        signature: "0xsig",
        slot: 392100001,
        programId: "6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J",
      },
    };

    expect(buildProofReceipt("fixture-1", outcome, event)).toEqual({
      receiptId: "receipt-market-1-event-1-392100001",
      marketId: "market-1",
      fixtureId: "fixture-1",
      outcome,
      eventId: "event-1",
      proof: event.proof,
    });
  });
});
