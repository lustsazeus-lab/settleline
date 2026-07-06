import { describe, expect, it } from "vitest";
import { GET } from "../src/app/api/signals/route";

describe("GET /api/signals", () => {
  it("returns replay trading signals for judge and agent review", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mode: "replay",
      track: "Trading Tools and Agents",
      signals: [
        {
          marketId: "market-wc-001-winner",
          workflowStatus: "settlement-ready",
          riskLevel: "medium",
          confidence: 0.84,
          proofSlot: 392100001,
        },
        {
          marketId: "market-wc-001-total-goals",
          workflowStatus: "settlement-ready",
          riskLevel: "medium",
          confidence: 0.84,
          proofSlot: 392100001,
        },
      ],
    });
  });
});
