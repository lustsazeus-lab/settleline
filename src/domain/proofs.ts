import type { Market, ProofReceipt, SettlementOutcome, TxLineReplayEvent } from "./types";

export type ProofCheck = {
  label: string;
  passed: boolean;
};

export type ProofVerification = {
  valid: boolean;
  checks: ProofCheck[];
};

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

export function verifyProofReceipt(
  receipt: ProofReceipt,
  context: { market: Market; event: TxLineReplayEvent },
): ProofVerification {
  const expectedReceiptId = `receipt-${receipt.outcome.marketId}-${context.event.id}-${context.event.proof.slot}`;
  const checks: ProofCheck[] = [
    { label: "Receipt id", passed: receipt.receiptId === expectedReceiptId },
    { label: "Market binding", passed: receipt.marketId === context.market.id && receipt.outcome.marketId === context.market.id },
    { label: "Fixture binding", passed: receipt.fixtureId === context.market.fixtureId && receipt.fixtureId === context.event.fixtureId },
    { label: "Event binding", passed: receipt.eventId === context.event.id },
    {
      label: "Proof metadata",
      passed:
        receipt.proof.merkleRoot === context.event.proof.merkleRoot &&
        receipt.proof.signature === context.event.proof.signature &&
        receipt.proof.slot === context.event.proof.slot &&
        receipt.proof.programId === context.event.proof.programId,
    },
    {
      label: "Winning selection",
      passed: context.market.selections.includes(receipt.outcome.winningSelection),
    },
  ];

  return {
    valid: checks.every((check) => check.passed),
    checks,
  };
}
