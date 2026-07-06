import { NextResponse } from "next/server";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "@/domain/replay";

export function GET() {
  return NextResponse.json({
    status: "ok",
    app: "SettleLine",
    mode: "replay",
    realMoneyWagering: false,
    checks: {
      fixtures: getReplayFixtures().length > 0,
      markets: getReplayMarkets().length > 0,
      events: getReplayEvents().length > 0,
    },
    routes: [
      "/api/fixtures",
      "/api/signals",
      "/api/markets/[marketId]/settle",
      "/api/markets/[marketId]/verify",
    ],
  });
}
