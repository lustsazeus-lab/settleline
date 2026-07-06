import type { FanPulseExperience } from "@/domain/fan-pulse";

export function FanPulsePanel({ pulse }: { pulse: FanPulseExperience }) {
  return (
    <section className="fan-pulse-panel" aria-labelledby="fan-pulse-title">
      <div className="fan-pulse-header">
        <div>
          <p className="eyebrow">Consumer and Fan Experiences</p>
          <h2 id="fan-pulse-title">FanPulse</h2>
        </div>
        <span>{pulse.state}</span>
      </div>

      <div className="fan-pulse-layout">
        <article className="fan-hero-card">
          <p className="market-meta">{pulse.fixtureLine}</p>
          <h3>{pulse.hero.title}</h3>
          <p>{pulse.hero.subtitle}</p>
          <code>{pulse.scoreline}</code>
        </article>

        <article className="fan-game-card">
          <p className="eyebrow">Hi-Lo Stats Game</p>
          <h3>{pulse.hiLoGame.prompt}</h3>
          <div className="choice-row" aria-label="Hi-Lo choices">
            {pulse.hiLoGame.choices.map((choice) => (
              <span className={choice === pulse.hiLoGame.correctChoice ? "choice-chip correct" : "choice-chip"} key={choice}>
                {choice}
              </span>
            ))}
          </div>
          <dl>
            <div>
              <dt>Latest</dt>
              <dd>{pulse.hiLoGame.latestValue}</dd>
            </div>
            <div>
              <dt>Line</dt>
              <dd>{pulse.hiLoGame.comparisonValue}</dd>
            </div>
          </dl>
        </article>
      </div>

      <div className="moment-grid">
        {pulse.moments.map((moment) => (
          <article className="moment-card" key={`${moment.kind}-${moment.label}`}>
            <span>{moment.kind}</span>
            <h3>{moment.label}</h3>
            <p>{moment.detail}</p>
          </article>
        ))}
      </div>

      <div className="fan-bottom-grid">
        <article className="sweepstake-card">
          <h3>{pulse.sweepstake.title}</h3>
          <ol>
            {pulse.sweepstake.leaderboard.map((entry) => (
              <li key={entry.team}>
                <span>{entry.rank}</span>
                <strong>{entry.team}</strong>
                <small>{entry.label}</small>
                <code>{entry.points} pts</code>
              </li>
            ))}
          </ol>
        </article>

        <article className="proof-card">
          <h3>Judge Proof</h3>
          {pulse.proof ? (
            <dl>
              <div>
                <dt>Event</dt>
                <dd>{pulse.proof.eventId}</dd>
              </div>
              <div>
                <dt>Slot</dt>
                <dd>{pulse.proof.slot}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{pulse.proof.source}</dd>
              </div>
            </dl>
          ) : (
            <p>Waiting for TxLINE proof.</p>
          )}
          <p>{pulse.shareText}</p>
        </article>
      </div>
    </section>
  );
}
