import { NextResponse } from "next/server";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "@/domain/replay";
import { buildTradingSignals } from "@/domain/signals";

export function GET() {
  const signals = buildTradingSignals({
    markets: getReplayMarkets(),
    fixtures: getReplayFixtures(),
    events: getReplayEvents(),
  });

  return NextResponse.json({
    mode: "replay",
    track: "Trading Tools and Agents",
    signals,
  });
}
