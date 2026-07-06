import { describe, expect, it } from "vitest";
import { buildMockEscrowSettlement } from "../src/domain/escrow";
import type { Market, ProofReceipt } from "../src/domain/types";

const market: Market = {
  id: "market-wc-001-winner",
  fixtureId: "wc-2026-demo-001",
  kind: "match-winner",
  label: "Match Winner",
  condition: "Settle to the team with the higher final score.",
  selections: ["ARG", "DRAW", "FRA"],
};

const receipt: ProofReceipt = {
  receiptId: "receipt-market-wc-001-winner-txline-replay-event-001-392100001",
  receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
  marketId: "market-wc-001-winner",
  fixtureId: "wc-2026-demo-001",
  outcome: {
    marketId: "market-wc-001-winner",
    winningSelection: "ARG",
    reason: "Argentina defeated France 2-1.",
    settledAt: "2026-07-12T19:00:00.000Z",
  },
  eventId: "txline-replay-event-001",
  proof: {
    merkleRoot: "0xabc",
    signature: "0xsig",
    slot: 392100001,
    programId: "6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J",
  },
};

describe("buildMockEscrowSettlement", () => {
  it("builds a deterministic replay-only escrow release from a verified receipt", () => {
    expect(buildMockEscrowSettlement(receipt, market)).toEqual({
      escrowId: "mock-escrow-market-wc-001-winner-txline-replay-event-001",
      marketId: "market-wc-001-winner",
      receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
      status: "settled",
      network: "solana-devnet-mock",
      asset: "demo-usdt-accounting-units",
      instruction: "release-to-winning-selection",
      winningSelection: "ARG",
      payouts: [
        {
          selection: "ARG",
          destination: "demo-vault-arg-winners",
          amount: "100.00",
        },
      ],
      safeguards: ["replay-only", "no-custody", "no-real-money-wagering"],
    });
  });

  it("rejects a receipt whose winning selection is not in the market", () => {
    expect(() =>
      buildMockEscrowSettlement(
        {
          ...receipt,
          outcome: { ...receipt.outcome, winningSelection: "BRA" },
        },
        market,
      ),
    ).toThrow("Winning selection BRA is not valid for market market-wc-001-winner.");
  });
});
