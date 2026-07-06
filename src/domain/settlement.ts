import type { Fixture, Market, SettlementOutcome } from "./types";

export function settleMarket(market: Market, fixture: Fixture): SettlementOutcome {
  if (fixture.status !== "finished") {
    throw new Error("Fixture is not finished.");
  }

  if (market.fixtureId !== fixture.id) {
    throw new Error(`Market ${market.id} does not belong to fixture ${fixture.id}.`);
  }

  if (market.kind === "match-winner") {
    return settleMatchWinner(market, fixture);
  }

  if (market.kind === "total-goals-over") {
    return settleTotalGoalsOver(market, fixture);
  }

  const unsupported: never = market.kind;
  throw new Error(`Unsupported market kind: ${unsupported}`);
}

function settleMatchWinner(market: Market, fixture: Fixture): SettlementOutcome {
  const { home, away } = fixture.score;
  const winningSelection =
    home > away ? fixture.homeTeam.shortName : away > home ? fixture.awayTeam.shortName : "DRAW";

  const winningTeamName = winningSelection === fixture.homeTeam.shortName ? fixture.homeTeam.name : fixture.awayTeam.name;
  const losingTeamName = winningSelection === fixture.homeTeam.shortName ? fixture.awayTeam.name : fixture.homeTeam.name;
  const reason =
    winningSelection === "DRAW"
      ? `${fixture.homeTeam.name} drew ${fixture.awayTeam.name} ${home}-${away}.`
      : `${winningTeamName} defeated ${losingTeamName} ${home}-${away}.`;

  return {
    marketId: market.id,
    winningSelection,
    reason,
    settledAt: fixture.startsAt,
  };
}

function settleTotalGoalsOver(market: Market, fixture: Fixture): SettlementOutcome {
  if (typeof market.threshold !== "number") {
    throw new Error(`Market ${market.id} is missing a numeric threshold.`);
  }

  const totalGoals = fixture.score.home + fixture.score.away;
  const winningSelection = totalGoals > market.threshold ? "OVER" : "UNDER";

  return {
    marketId: market.id,
    winningSelection,
    reason: `Total goals were ${totalGoals}, threshold was ${market.threshold}.`,
    settledAt: fixture.startsAt,
  };
}
