import type { ProofReceipt as ProofReceiptType } from "@/domain/types";

export function ProofReceipt({ receipt }: { receipt: ProofReceiptType }) {
  return (
    <section className="receipt">
      <h2>Proof Receipt</h2>
      <dl>
        <dt>Receipt</dt>
        <dd>{receipt.receiptId}</dd>
        <dt>Receipt hash</dt>
        <dd>{receipt.receiptHash}</dd>
        <dt>Winning selection</dt>
        <dd className="winner">{receipt.outcome.winningSelection}</dd>
        <dt>Reason</dt>
        <dd>{receipt.outcome.reason}</dd>
        <dt>Merkle root</dt>
        <dd>{receipt.proof.merkleRoot}</dd>
        <dt>Program</dt>
        <dd>{receipt.proof.programId}</dd>
        <dt>Slot</dt>
        <dd>{receipt.proof.slot}</dd>
      </dl>
    </section>
  );
}
