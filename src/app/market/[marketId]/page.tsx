import Link from "next/link";
import { ProofReceipt } from "@/components/ProofReceipt";
import { ProofVerificationPanel } from "@/components/ProofVerificationPanel";
import { SettlementTimeline } from "@/components/SettlementTimeline";
import { verifyProofReceipt } from "@/domain/proofs";
import { getLatestReplayEvent, getReplayFixtures, getReplayMarkets } from "@/domain/replay";
import { replayAdapter } from "@/integrations/txline/replay-adapter";

export default async function MarketPage({ params }: { params: Promise<{ marketId: string }> }) {
  const { marketId } = await params;
  const market = getReplayMarkets().find(item => item.id === marketId);

  if (!market) {
    return (
      <main className="shell">
        <Link className="back-link" href="/">
          Back to dashboard
        </Link>
        <h1>Market not found</h1>
      </main>
    );
  }

  const fixture = getReplayFixtures().find(item => item.id === market.fixtureId);
  const event = getLatestReplayEvent(market.fixtureId);

  if (!fixture || !event) {
    return (
      <main className="shell">
        <Link className="back-link" href="/">
          Back to dashboard
        </Link>
        <h1>Replay data missing</h1>
      </main>
    );
  }

  const receipt = await replayAdapter.settleMarket(market.id);
  const verification = verifyProofReceipt(receipt, { market, event });

  return (
    <main className="shell">
      <Link className="back-link" href="/">
        Back to dashboard
      </Link>
      <section className="intro-panel">
        <p className="eyebrow">Settlement demo</p>
        <h1 className="headline">{market.label}</h1>
        <p className="lead">{market.condition}</p>
      </section>
      <div className="detail-grid">
        <SettlementTimeline fixture={fixture} market={market} event={event} />
        <ProofReceipt receipt={receipt} />
        <ProofVerificationPanel verification={verification} />
      </div>
    </main>
  );
}
