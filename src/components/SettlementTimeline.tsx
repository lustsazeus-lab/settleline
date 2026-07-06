import type { Fixture, Market, TxLineReplayEvent } from "@/domain/types";

export function SettlementTimeline({
  fixture,
  market,
  event,
}: {
  fixture: Fixture;
  market: Market;
  event: TxLineReplayEvent;
}) {
  return (
    <section className="timeline">
      <h2>Settlement Timeline</h2>
      <ol>
        <li>
          Fixture loaded: {fixture.homeTeam.name} vs {fixture.awayTeam.name}
        </li>
        <li>Market selected: {market.label}</li>
        <li>TxLINE-shaped event received: {event.id}</li>
        <li>
          Final score: {event.score.home}-{event.score.away}
        </li>
        <li>Settlement can be calculated deterministically from this event.</li>
      </ol>
    </section>
  );
}
