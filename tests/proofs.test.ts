import { describe, expect, it } from "vitest";
import { buildProofReceipt, verifyProofReceipt } from "../src/domain/proofs";
import type { Market, SettlementOutcome, TxLineReplayEvent } from "../src/domain/types";

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

const market: Market = {
  id: "market-1",
  fixtureId: "fixture-1",
  kind: "match-winner",
  label: "Match Winner",
  condition: "Winner after regular time",
  selections: ["ARG", "FRA", "DRAW"],
};

describe("buildProofReceipt", () => {
  it("creates a deterministic receipt id", () => {
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

describe("verifyProofReceipt", () => {
  it("accepts a receipt that matches the market, fixture, outcome, and TxLINE event", () => {
    const receipt = buildProofReceipt("fixture-1", outcome, event);

    expect(verifyProofReceipt(receipt, { market, event })).toEqual({
      valid: true,
      checks: [
        { label: "Receipt id", passed: true },
        { label: "Market binding", passed: true },
        { label: "Fixture binding", passed: true },
        { label: "Event binding", passed: true },
        { label: "Proof metadata", passed: true },
        { label: "Winning selection", passed: true },
      ],
    });
  });

  it("rejects a receipt whose market binding was tampered with", () => {
    const receipt = {
      ...buildProofReceipt("fixture-1", outcome, event),
      marketId: "market-2",
    };

    expect(verifyProofReceipt(receipt, { market, event })).toEqual({
      valid: false,
      checks: expect.arrayContaining([{ label: "Market binding", passed: false }]),
    });
  });
});
