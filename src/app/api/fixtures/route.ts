import { NextResponse } from "next/server";
import { replayAdapter } from "@/integrations/txline/replay-adapter";

export async function GET() {
  const [fixtures, markets] = await Promise.all([replayAdapter.listFixtures(), replayAdapter.listMarkets()]);
  return NextResponse.json({ mode: "replay", fixtures, markets });
}
