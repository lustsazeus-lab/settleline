import replayData from "@/data/worldcup-replay.json";
import type { Fixture, Market, TxLineReplayEvent } from "./types";

type ReplayData = {
  fixtures: Fixture[];
  markets: Market[];
  events: TxLineReplayEvent[];
};

const data = replayData as ReplayData;

export function getReplayFixtures(): Fixture[] {
  return data.fixtures;
}

export function getReplayMarkets(): Market[] {
  return data.markets;
}

export function getReplayEvents(): TxLineReplayEvent[] {
  return data.events;
}

export function getLatestReplayEvent(fixtureId: string): TxLineReplayEvent | undefined {
  return data.events
    .filter(event => event.fixtureId === fixtureId)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))[0];
}
