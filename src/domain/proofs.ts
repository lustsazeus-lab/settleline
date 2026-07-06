import type { ProofReceipt, SettlementOutcome, TxLineReplayEvent } from "./types";

export function buildProofReceipt(
  fixtureId: string,
  outcome: SettlementOutcome,
  event: TxLineReplayEvent,
): ProofReceipt {
  return {
    receiptId: `receipt-${outcome.marketId}-${event.id}-${event.proof.slot}`,
    marketId: outcome.marketId,
    fixtureId,
    outcome,
    eventId: event.id,
    proof: event.proof,
  };
}
