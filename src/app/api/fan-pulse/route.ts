import { NextResponse } from "next/server";
import { buildFanPulseExperience } from "@/domain/fan-pulse";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "@/domain/replay";

export function GET() {
  const fanPulse = buildFanPulseExperience({
    fixtures: getReplayFixtures(),
    markets: getReplayMarkets(),
    events: getReplayEvents(),
  });

  return NextResponse.json({
    mode: "replay",
    track: "Consumer and Fan Experiences",
    fanPulse,
  });
}
