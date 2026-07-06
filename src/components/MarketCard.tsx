import Link from "next/link";
import type { Fixture, Market } from "@/domain/types";

export function MarketCard({ market, fixture }: { market: Market; fixture: Fixture }) {
  return (
    <article className="market-card">
      <p className="market-meta">{fixture.competition}</p>
      <h2>{market.label}</h2>
      <p className="fixture-line">
        {fixture.homeTeam.shortName} vs {fixture.awayTeam.shortName} / final score {fixture.score.home}-
        {fixture.score.away}
      </p>
      <p className="market-condition">{market.condition}</p>
      <div className="selection-row" aria-label="Selections">
        {market.selections.map(selection => (
          <span className="selection-chip" key={selection}>
            {selection}
          </span>
        ))}
      </div>
      <Link className="button-link" href={`/market/${market.id}`}>
        Open settlement demo
      </Link>
    </article>
  );
}
