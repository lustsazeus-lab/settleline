import type { Fixture, Market, ProofReceipt, TxLineReplayEvent } from "@/domain/types";

export type TxLineAdapter = {
  listFixtures(): Promise<Fixture[]>;
  listMarkets(): Promise<Market[]>;
  latestEventForFixture(fixtureId: string): Promise<TxLineReplayEvent | undefined>;
  settleMarket(marketId: string): Promise<ProofReceipt>;
};
