export type Team = {
  id: string;
  name: string;
  shortName: string;
};

export type FixtureStatus = "scheduled" | "live" | "finished";

export type Score = {
  home: number;
  away: number;
};

export type Fixture = {
  id: string;
  competition: string;
  startsAt: string;
  status: FixtureStatus;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
};

export type MarketKind = "match-winner" | "total-goals-over";

export type Market = {
  id: string;
  fixtureId: string;
  kind: MarketKind;
  label: string;
  condition: string;
  threshold?: number;
  selections: string[];
};

export type TxLineReplayEvent = {
  id: string;
  fixtureId: string;
  receivedAt: string;
  source: "txline-replay" | "txline-live";
  serviceLevel: 1 | 12;
  status: FixtureStatus;
  score: Score;
  proof: {
    merkleRoot: string;
    signature: string;
    slot: number;
    programId: string;
  };
};

export type SettlementOutcome = {
  marketId: string;
  winningSelection: string;
  reason: string;
  settledAt: string;
};

export type ProofReceipt = {
  receiptId: string;
  marketId: string;
  fixtureId: string;
  outcome: SettlementOutcome;
  eventId: string;
  proof: TxLineReplayEvent["proof"];
};
