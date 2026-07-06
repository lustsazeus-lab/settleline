import type { TradingSignal } from "@/domain/signals";

export function LineSignalPanel({ signals }: { signals: TradingSignal[] }) {
  return (
    <section className="line-signal-panel" aria-labelledby="line-signal-title">
      <div className="line-signal-header">
        <div>
          <p className="eyebrow">Trading Tools and Agents</p>
          <h2 id="line-signal-title">LineSignal</h2>
        </div>
        <span>No autonomous trading or wagering.</span>
      </div>
      <div className="signal-grid">
        {signals.map((signal) => (
          <article className="signal-card" key={signal.marketId}>
            <div className="signal-card-header">
              <div>
                <p className="market-meta">{signal.fixtureLine}</p>
                <h3>{signal.label}</h3>
              </div>
              <span className={`risk-badge ${signal.riskLevel}`}>{signal.riskLevel}</span>
            </div>
            <p className="signal-summary">{signal.summary}</p>
            <dl className="signal-metrics">
              <div>
                <dt>Status</dt>
                <dd>{signal.workflowStatus}</dd>
              </div>
              <div>
                <dt>Confidence</dt>
                <dd>{Math.round(signal.confidence * 100)}%</dd>
              </div>
              <div>
                <dt>Proof slot</dt>
                <dd>{signal.proofSlot ?? "missing"}</dd>
              </div>
            </dl>
            <p className="agent-action">{signal.agentAction}</p>
            <ul className="risk-list">
              {signal.riskReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
