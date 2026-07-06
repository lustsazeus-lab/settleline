import { describe, expect, it } from "vitest";
import { GET } from "../src/app/api/fan-pulse/route";

describe("GET /api/fan-pulse", () => {
  it("returns the judge-facing consumer fan payload", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      mode: "replay",
      track: "Consumer and Fan Experiences",
      fanPulse: {
        fixtureId: "wc-2026-demo-001",
        scoreline: "ARG 2-1 FRA",
        safety: {
          realMoneyWagering: false,
          custody: false,
        },
      },
    });
  });
});
