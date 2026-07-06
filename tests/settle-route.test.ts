import { describe, expect, it } from "vitest";
import { POST } from "../src/app/api/markets/[marketId]/settle/route";

describe("POST /api/markets/[marketId]/settle", () => {
  it("returns a replay proof receipt and mock escrow release", async () => {
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
        outcome: { winningSelection: "ARG" },
      },
      mockEscrow: {
        escrowId: "mock-escrow-market-wc-001-winner-txline-replay-event-001",
        network: "solana-devnet-mock",
        asset: "demo-usdt-accounting-units",
        instruction: "release-to-winning-selection",
        winningSelection: "ARG",
        safeguards: ["replay-only", "no-custody", "no-real-money-wagering"],
      },
    });
  });
});
