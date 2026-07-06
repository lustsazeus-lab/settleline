import { describe, expect, it } from "vitest";
import { POST } from "../src/app/api/markets/[marketId]/verify/route";

describe("POST /api/markets/[marketId]/verify", () => {
  it("returns proof verification checks for a replay market", async () => {
    const response = await POST(new Request("http://test.local") as never, {
      params: Promise.resolve({ marketId: "market-wc-001-winner" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mode: "replay",
      verification: {
        valid: true,
        checks: expect.arrayContaining([
          { label: "Receipt id", passed: true },
          { label: "Receipt hash", passed: true },
          { label: "Market binding", passed: true },
          { label: "Fixture binding", passed: true },
          { label: "Event binding", passed: true },
          { label: "Proof metadata", passed: true },
          { label: "Winning selection", passed: true },
        ]),
      },
    });
  });
});
