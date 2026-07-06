import { NextRequest, NextResponse } from "next/server";
import { buildMockEscrowSettlement } from "@/domain/escrow";
import { getReplayMarkets } from "@/domain/replay";
import { replayAdapter } from "@/integrations/txline/replay-adapter";

export async function POST(_request: NextRequest, context: { params: Promise<unknown> }) {
  try {
    const params = await context.params;
    const marketId = extractMarketId(params);
    const market = getReplayMarkets().find(item => item.id === marketId);

    if (!market) {
      throw new Error(`Market ${marketId} not found.`);
    }

    const receipt = await replayAdapter.settleMarket(marketId);
    const mockEscrow = buildMockEscrowSettlement(receipt, market);
    return NextResponse.json({ mode: "replay", receipt, mockEscrow });
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
