import type { Market, MockEscrowSettlement, ProofReceipt } from "./types";

export function buildMockEscrowSettlement(receipt: ProofReceipt, market: Market): MockEscrowSettlement {
  const { winningSelection } = receipt.outcome;

  if (!market.selections.includes(winningSelection)) {
    throw new Error(`Winning selection ${winningSelection} is not valid for market ${market.id}.`);
  }

  return {
    escrowId: `mock-escrow-${receipt.marketId}-${receipt.eventId}`,
    marketId: receipt.marketId,
    receiptHash: receipt.receiptHash,
    status: "settled",
    network: "solana-devnet-mock",
    asset: "demo-usdt-accounting-units",
    instruction: "release-to-winning-selection",
    winningSelection,
    payouts: [
      {
        selection: winningSelection,
        destination: `demo-vault-${winningSelection.toLowerCase()}-winners`,
        amount: "100.00",
      },
    ],
    safeguards: ["replay-only", "no-custody", "no-real-money-wagering"],
  };
}
