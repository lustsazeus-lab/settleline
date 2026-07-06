import { describe, expect, it } from "vitest";
import type { Fixture, Market } from "../src/domain/types";
import { settleMarket } from "../src/domain/settlement";

const fixture: Fixture = {
  id: "fixture-1",
  competition: "World Cup 2026",
  startsAt: "2026-07-12T19:00:00.000Z",
  status: "finished",
  homeTeam: { id: "arg", name: "Argentina", shortName: "ARG" },
  awayTeam: { id: "fra", name: "France", shortName: "FRA" },
  score: { home: 2, away: 1 },
};

describe("settleMarket", () => {
  it("settles match winner to home team", () => {
    const market: Market = {
      id: "winner",
      fixtureId: "fixture-1",
      kind: "match-winner",
      label: "Match Winner",
      condition: "highest score wins",
      selections: ["ARG", "DRAW", "FRA"],
    };

    expect(settleMarket(market, fixture)).toEqual({
      marketId: "winner",
      winningSelection: "ARG",
      reason: "Argentina defeated France 2-1.",
      settledAt: "2026-07-12T19:00:00.000Z",
    });
  });

  it("settles match winner to draw", () => {
    const drawFixture = { ...fixture, score: { home: 1, away: 1 } };
    const market: Market = {
      id: "winner",
      fixtureId: "fixture-1",
      kind: "match-winner",
      label: "Match Winner",
      condition: "highest score wins",
      selections: ["ARG", "DRAW", "FRA"],
    };

    expect(settleMarket(market, drawFixture).winningSelection).toBe("DRAW");
  });

  it("settles total goals over threshold", () => {
    const market: Market = {
      id: "total-goals",
      fixtureId: "fixture-1",
      kind: "total-goals-over",
      label: "Total Goals Over 2.5",
      condition: "total goals > 2.5",
      threshold: 2.5,
      selections: ["OVER", "UNDER"],
    };

    expect(settleMarket(market, fixture).winningSelection).toBe("OVER");
  });

  it("rejects unsettled fixtures", () => {
    const liveFixture = { ...fixture, status: "live" as const };
    const market: Market = {
      id: "winner",
      fixtureId: "fixture-1",
      kind: "match-winner",
      label: "Match Winner",
      condition: "highest score wins",
      selections: ["ARG", "DRAW", "FRA"],
    };

    expect(() => settleMarket(market, liveFixture)).toThrow("Fixture is not finished.");
  });
});
