import { NextRequest, NextResponse } from "next/server";
import { replayAdapter } from "@/integrations/txline/replay-adapter";

export async function POST(_request: NextRequest, context: { params: Promise<unknown> }) {
  try {
    const params = await context.params;
    const marketId = extractMarketId(params);
    const receipt = await replayAdapter.settleMarket(marketId);
    return NextResponse.json({ mode: "replay", receipt });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown settlement error." },
      { status: 400 },
    );
  }
}

function extractMarketId(params: unknown): string {
  if (
    typeof params === "object" &&
    params !== null &&
    "marketId" in params &&
    typeof params.marketId === "string" &&
    params.marketId.length > 0
  ) {
    return params.marketId;
  }

  throw new Error("Missing marketId route parameter.");
}
