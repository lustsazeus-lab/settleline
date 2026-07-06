import Link from "next/link";
import { LineSignalPanel } from "@/components/LineSignalPanel";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "@/domain/replay";
import { buildTradingSignals } from "@/domain/signals";

export default function SignalsPage() {
  const signals = buildTradingSignals({
    markets: getReplayMarkets(),
    fixtures: getReplayFixtures(),
    events: getReplayEvents(),
  });

  return (
    <main className="shell">
      <Link className="back-link" href="/">
        Back to dashboard
      </Link>
      <section className="intro-panel">
        <p className="eyebrow">TxODDS trading-agent track</p>
        <h1 className="headline">Explainable signals before settlement.</h1>
        <p className="lead">
          LineSignal turns TxLINE replay events into risk-aware market workflow signals for agents, desks, or judges
          reviewing when proof-backed settlement is ready.
        </p>
      </section>
      <LineSignalPanel signals={signals} />
    </main>
  );
}
