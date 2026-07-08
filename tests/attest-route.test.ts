import { describe, expect, it } from "vitest";
import { POST } from "../src/app/api/markets/[marketId]/attest/route";

describe("POST /api/markets/[marketId]/attest", () => {
  it("returns a dry-run Solana devnet attestation for a replay receipt", async () => {
    const response = await POST(new Request("http://test.local") as never, {
      params: Promise.resolve({ marketId: "market-wc-001-winner" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mode: "replay",
      receipt: {
        marketId: "market-wc-001-winner",
        receiptHash: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
      },
      attestation: {
        mode: "dry-run",
        network: "solana-devnet",
        cluster: "devnet",
        instruction: "memo-attest-receipt-hash",
        marketId: "market-wc-001-winner",
        fixtureId: "wc-2026-demo-001",
        eventId: "txline-replay-event-001",
        proofSlot: 392100001,
        proofProgramId: "6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J",
        memo: expect.stringContaining("receipt=sha256:"),
        transactionSignature: null,
        transactionExplorerUrl: null,
        safeguards: ["devnet-only", "no-user-wallet", "no-custody", "no-real-money-wagering"],
      },
    });
  });

  it("returns a 400 for unknown markets", async () => {
    const response = await POST(new Request("http://test.local") as never, {
      params: Promise.resolve({ marketId: "missing-market" }),
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Market missing-market not found." });
  });
});
