import type { ProofReceipt } from "./types";

export type DevnetAttestationDraft = {
  mode: "dry-run";
  network: "solana-devnet";
  cluster: "devnet";
  instruction: "memo-attest-receipt-hash";
  receiptId: string;
  receiptHash: string;
  marketId: string;
  fixtureId: string;
  eventId: string;
  proofSlot: number;
  proofProgramId: string;
  memo: string;
  transactionSignature: null;
  transactionExplorerUrl: null;
  safeguards: Array<"devnet-only" | "no-user-wallet" | "no-custody" | "no-real-money-wagering">;
};

export function buildDevnetReceiptMemo(receipt: ProofReceipt): string {
  return [
    "SettleLine",
    `receipt=${receipt.receiptHash}`,
    `market=${receipt.marketId}`,
    `event=${receipt.eventId}`,
    `slot=${receipt.proof.slot}`,
  ].join("|");
}

export function buildSolanaExplorerTxUrl(signature: string): string {
  const trimmedSignature = signature.trim();

  if (!trimmedSignature) {
    throw new Error("Missing Solana transaction signature.");
  }

  return `https://explorer.solana.com/tx/${encodeURIComponent(trimmedSignature)}?cluster=devnet`;
}

export function buildDevnetAttestationDraft(receipt: ProofReceipt): DevnetAttestationDraft {
  return {
    mode: "dry-run",
    network: "solana-devnet",
    cluster: "devnet",
    instruction: "memo-attest-receipt-hash",
    receiptId: receipt.receiptId,
    receiptHash: receipt.receiptHash,
    marketId: receipt.marketId,
    fixtureId: receipt.fixtureId,
    eventId: receipt.eventId,
    proofSlot: receipt.proof.slot,
    proofProgramId: receipt.proof.programId,
    memo: buildDevnetReceiptMemo(receipt),
    transactionSignature: null,
    transactionExplorerUrl: null,
    safeguards: ["devnet-only", "no-user-wallet", "no-custody", "no-real-money-wagering"],
  };
}
