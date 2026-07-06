import { buildProofReceipt } from "@/domain/proofs";
import { getLatestReplayEvent, getReplayFixtures, getReplayMarkets } from "@/domain/replay";
import { settleMarket } from "@/domain/settlement";
import type { ProofReceipt } from "@/domain/types";
import type { TxLineAdapter } from "./types";

export const replayAdapter: TxLineAdapter = {
  async listFixtures() {
    return getReplayFixtures();
  },

  async listMarkets() {
    return getReplayMarkets();
  },

  async latestEventForFixture(fixtureId) {
    return getLatestReplayEvent(fixtureId);
  },

  async settleMarket(marketId): Promise<ProofReceipt> {
    const market = getReplayMarkets().find(item => item.id === marketId);
    if (!market) {
      throw new Error(`Market ${marketId} not found.`);
    }

    const fixture = getReplayFixtures().find(item => item.id === market.fixtureId);
    if (!fixture) {
      throw new Error(`Fixture ${market.fixtureId} not found.`);
    }

    const event = getLatestReplayEvent(fixture.id);
    if (!event) {
      throw new Error(`No TxLINE event found for fixture ${fixture.id}.`);
    }

    const outcome = settleMarket(market, fixture);
    return buildProofReceipt(fixture.id, outcome, event);
  },
};
