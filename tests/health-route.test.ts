import { describe, expect, it } from "vitest";
import { GET } from "../src/app/api/health/route";

describe("GET /api/health", () => {
  it("returns deployment and judge-readiness status", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      status: "ok",
      app: "SettleLine",
      mode: "replay",
      realMoneyWagering: false,
      checks: {
        fixtures: true,
        markets: true,
        events: true,
      },
      routes: [
        "/api/fixtures",
        "/api/signals",
        "/api/markets/[marketId]/settle",
        "/api/markets/[marketId]/verify",
      ],
    });
  });
});
