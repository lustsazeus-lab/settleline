import { ComplianceNotice } from "@/components/ComplianceNotice";
import { JudgeApiPanel } from "@/components/JudgeApiPanel";
import { LineSignalPanel } from "@/components/LineSignalPanel";
import { MarketCard } from "@/components/MarketCard";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "@/domain/replay";
import { buildTradingSignals } from "@/domain/signals";

export default function HomePage() {
  const fixtures = getReplayFixtures();
  const markets = getReplayMarkets();
  const signals = buildTradingSignals({ markets, fixtures, events: getReplayEvents() });

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <img src="/settleline-mark.svg" alt="" aria-hidden="true" />
          <div>
            <p className="brand-title">SettleLine</p>
            <p className="brand-subtitle">TxLINE settlement proof demo</p>
          </div>
        </div>
        <span className="status-pill">Replay mode / no wallet required</span>
      </header>

      <section className="intro-grid">
        <div className="intro-panel">
          <p className="eyebrow">World Cup prediction settlement</p>
          <h1 className="headline">Proof-first markets without real-money risk.</h1>
          <p className="lead">
            SettleLine demonstrates how TxLINE-shaped match data can drive deterministic prediction resolution, produce
            a proof receipt, and prepare a clean path to devnet escrow settlement.
          </p>
        </div>
        <aside className="facts-panel" aria-label="Demo facts">
          <div className="fact">
            <span className="fact-label">Data mode</span>
            <span className="fact-value">TxLINE replay</span>
          </div>
          <div className="fact">
            <span className="fact-label">Markets</span>
            <span className="fact-value">{markets.length}</span>
          </div>
          <div className="fact">
            <span className="fact-label">Program</span>
            <span className="fact-value">Solana devnet</span>
          </div>
          <div className="fact">
            <span className="fact-label">Access</span>
            <span className="fact-value">No login</span>
          </div>
        </aside>
      </section>

      <ComplianceNotice />
      <JudgeApiPanel />
      <LineSignalPanel signals={signals} />

      <section className="section" aria-labelledby="markets-title">
        <h2 className="section-title" id="markets-title">
          Demo Markets
        </h2>
        <div className="market-grid">
          {markets.map(market => {
            const fixture = fixtures.find(item => item.id === market.fixtureId);
            if (!fixture) return null;
            return <MarketCard key={market.id} market={market} fixture={fixture} />;
          })}
        </div>
      </section>
    </main>
  );
}
