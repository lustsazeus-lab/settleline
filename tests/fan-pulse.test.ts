import { describe, expect, it } from "vitest";
import { buildFanPulseExperience } from "../src/domain/fan-pulse";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "../src/domain/replay";

describe("buildFanPulseExperience", () => {
  it("turns TxLINE replay data into a consumer fan experience", () => {
    const pulse = buildFanPulseExperience({
      fixtures: getReplayFixtures(),
      markets: getReplayMarkets(),
      events: getReplayEvents(),
    });

    expect(pulse).toMatchObject({
      track: "Consumer and Fan Experiences",
      fixtureId: "wc-2026-demo-001",
      fixtureLine: "Argentina vs France",
      scoreline: "ARG 2-1 FRA",
      state: "final",
      hero: {
        title: "Argentina 2-1 France",
      },
      hiLoGame: {
        prompt: "Will total goals finish higher or lower than 2.5?",
        latestValue: 3,
        comparisonValue: 2.5,
        correctChoice: "HI",
      },
      proof: {
        eventId: "txline-replay-event-001",
        slot: 392100001,
        source: "txline-replay",
      },
      safety: {
        realMoneyWagering: false,
        custody: false,
      },
    });
    expect(pulse.moments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "score", label: "Final score" }),
        expect.objectContaining({ kind: "proof", label: "TxLINE proof" }),
      ]),
    );
    expect(pulse.sweepstake.leaderboard[0]).toMatchObject({
      team: "ARG",
      label: "Argentina",
      points: 7,
    });
    expect(pulse.shareText).toContain("TxLINE proof slot 392100001");
    expect(pulse.commercialPath).toContain("sponsor-safe");
  });

  it("stays in watch mode when no TxLINE event is available", () => {
    const pulse = buildFanPulseExperience({
      fixtures: getReplayFixtures(),
      markets: getReplayMarkets(),
      events: [],
    });

    expect(pulse).toMatchObject({
      state: "watching",
      scoreline: "ARG 2-1 FRA",
      proof: null,
      hiLoGame: {
        correctChoice: null,
      },
    });
    expect(pulse.moments).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "watch", label: "Waiting for TxLINE" })]),
    );
  });
});
