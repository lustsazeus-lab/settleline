import type { MockEscrowSettlement } from "@/domain/types";

export function MockEscrowPanel({ settlement }: { settlement: MockEscrowSettlement }) {
  return (
    <section className="escrow">
      <h2>Mock Escrow Settlement</h2>
      <dl>
        <dt>Escrow</dt>
        <dd>{settlement.escrowId}</dd>
        <dt>Network</dt>
        <dd>{settlement.network}</dd>
        <dt>Instruction</dt>
        <dd>{settlement.instruction}</dd>
        <dt>Asset</dt>
        <dd>{settlement.asset}</dd>
        <dt>Winner</dt>
        <dd className="winner">{settlement.winningSelection}</dd>
      </dl>
      <div className="escrow-payouts">
        {settlement.payouts.map((payout) => (
          <div className="escrow-payout" key={`${payout.selection}-${payout.destination}`}>
            <span>{payout.selection}</span>
            <strong>{payout.amount}</strong>
            <code>{payout.destination}</code>
          </div>
        ))}
      </div>
      <p className="escrow-safeguards">{settlement.safeguards.join(" / ")}</p>
    </section>
  );
}
