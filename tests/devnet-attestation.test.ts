import { describe, expect, it } from "vitest";
import {
  buildDevnetAttestationDraft,
  buildDevnetReceiptMemo,
  buildSolanaExplorerTxUrl,
} from "../src/domain/devnet-attestation";
import type { ProofReceipt } from "../src/domain/types";

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

describe("buildDevnetReceiptMemo", () => {
  it("builds a bounded memo that anchors the receipt hash and market context", () => {
    const memo = buildDevnetReceiptMemo(receipt);

    expect(memo).toBe(
      "SettleLine|receipt=sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072|market=market-wc-001-winner|event=txline-replay-event-001|slot=392100001",
    );
    expect(Buffer.byteLength(memo, "utf8")).toBeLessThanOrEqual(180);
  });
});

describe("buildSolanaExplorerTxUrl", () => {
  it("builds a Solana devnet transaction explorer URL", () => {
    expect(buildSolanaExplorerTxUrl("abc123")).toBe("https://explorer.solana.com/tx/abc123?cluster=devnet");
  });

  it("rejects blank signatures", () => {
    expect(() => buildSolanaExplorerTxUrl(" ")).toThrow("Missing Solana transaction signature.");
  });
});

describe("buildDevnetAttestationDraft", () => {
  it("returns a dry-run attestation with no wallet secret or mainnet claim", () => {
    expect(buildDevnetAttestationDraft(receipt)).toEqual({
      mode: "dry-run",
      network: "solana-devnet",
      cluster: "devnet",
      instruction: "memo-attest-receipt-hash",
      receiptId: "receipt-market-wc-001-winner-txline-replay-event-001-392100001",
      receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
      marketId: "market-wc-001-winner",
      fixtureId: "wc-2026-demo-001",
      eventId: "txline-replay-event-001",
      proofSlot: 392100001,
      proofProgramId: "6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J",
      memo:
        "SettleLine|receipt=sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072|market=market-wc-001-winner|event=txline-replay-event-001|slot=392100001",
      transactionSignature: null,
      transactionExplorerUrl: null,
      safeguards: ["devnet-only", "no-user-wallet", "no-custody", "no-real-money-wagering"],
    });
  });
});
