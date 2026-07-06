const judgeEndpoints = [
  {
    method: "GET",
    path: "/api/health",
    signal: "status: ok",
  },
  {
    method: "POST",
    path: "/api/markets/market-wc-001-winner/settle",
    signal: "receiptHash: sha256",
  },
  {
    method: "POST",
    path: "/api/markets/market-wc-001-winner/verify",
    signal: "valid: true",
  },
];

export function JudgeApiPanel() {
  return (
    <section className="judge-panel" aria-labelledby="judge-api-title">
      <div className="judge-panel-header">
        <div>
          <p className="eyebrow">Local review</p>
          <h2 id="judge-api-title">Judge API</h2>
        </div>
        <span>Replay only</span>
      </div>
      <div className="judge-endpoint-grid">
        {judgeEndpoints.map((endpoint) => (
          <div className="judge-endpoint" key={endpoint.path}>
            <span className="method">{endpoint.method}</span>
            <code>{endpoint.path}</code>
            <small>{endpoint.signal}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
