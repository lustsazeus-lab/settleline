import type { Fixture, Market, Score, TxLineReplayEvent } from "./types";

export type FanPulseState = "watching" | "live" | "final";

export type FanMoment = {
  kind: "watch" | "score" | "shift" | "proof" | "share";
  label: string;
  detail: string;
};

export type FanSweepstakeEntry = {
  rank: number;
  team: string;
  label: string;
  points: number;
  reason: string;
};

export type FanPulseExperience = {
  track: "Consumer and Fan Experiences";
  fixtureId: string;
  fixtureLine: string;
  scoreline: string;
  state: FanPulseState;
  hero: {
    title: string;
    subtitle: string;
  };
  moments: FanMoment[];
  hiLoGame: {
    prompt: string;
    stat: "total-goals";
    latestValue: number;
    comparisonValue: number;
    choices: ["HI", "LO"];
    correctChoice: "HI" | "LO" | null;
  };
  sweepstake: {
    title: string;
    leaderboard: FanSweepstakeEntry[];
  };
  proof: {
    eventId: string;
    slot: number;
    source: TxLineReplayEvent["source"];
    programId: string;
  } | null;
  shareText: string;
  commercialPath: string;
  safety: {
    realMoneyWagering: false;
    custody: false;
    safeguards: Array<"replay-only" | "no-custody" | "no-real-money-wagering">;
  };
};

export function buildFanPulseExperience({
  fixtures,
  markets,
  events,
}: {
  fixtures: Fixture[];
  markets: Market[];
  events: TxLineReplayEvent[];
}): FanPulseExperience {
  const fixture = fixtures[0];

  if (!fixture) {
    throw new Error("FanPulse requires at least one fixture.");
  }

  const event = latestEventForFixture(events, fixture.id);
  const score = event?.score ?? fixture.score;
  const state = event ? (event.status === "finished" ? "final" : "live") : "watching";
  const totalGoalsMarket = markets.find((market) => market.fixtureId === fixture.id && market.kind === "total-goals-over");
  const comparisonValue = totalGoalsMarket?.threshold ?? 2.5;
  const latestValue = score.home + score.away;

  return {
    track: "Consumer and Fan Experiences",
    fixtureId: fixture.id,
    fixtureLine: `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`,
    scoreline: formatShortScore(fixture, score),
    state,
    hero: {
      title: `${fixture.homeTeam.name} ${score.home}-${score.away} ${fixture.awayTeam.name}`,
      subtitle: buildHeroSubtitle(fixture, score, event),
    },
    moments: buildMoments(fixture, score, event, comparisonValue),
    hiLoGame: {
      prompt: `Will total goals finish higher or lower than ${comparisonValue}?`,
      stat: "total-goals",
      latestValue,
      comparisonValue,
      choices: ["HI", "LO"],
      correctChoice: event ? (latestValue > comparisonValue ? "HI" : "LO") : null,
    },
    sweepstake: {
      title: "Friends sweepstake",
      leaderboard: buildSweepstakeLeaderboard(fixture, score, event),
    },
    proof: event
      ? {
          eventId: event.id,
          slot: event.proof.slot,
          source: event.source,
          programId: event.proof.programId,
        }
      : null,
    shareText: buildShareText(fixture, score, event),
    commercialPath:
      "The sponsor-safe fan room can sell branded watch-party placements, club community packages, and premium replay archives without custody or real-money wagering.",
    safety: {
      realMoneyWagering: false,
      custody: false,
      safeguards: ["replay-only", "no-custody", "no-real-money-wagering"],
    },
  };
}

function latestEventForFixture(events: TxLineReplayEvent[], fixtureId: string): TxLineReplayEvent | undefined {
  return events
    .filter((event) => event.fixtureId === fixtureId)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))[0];
}

function formatShortScore(fixture: Fixture, score: Score): string {
  return `${fixture.homeTeam.shortName} ${score.home}-${score.away} ${fixture.awayTeam.shortName}`;
}

function buildHeroSubtitle(fixture: Fixture, score: Score, event: TxLineReplayEvent | undefined): string {
  const leader = winningTeamName(fixture, score);

  if (!event) {
    return "Waiting for the next TxLINE event before unlocking verified fan moments.";
  }

  if (!leader) {
    return `A tied ${score.home}-${score.away} match is ready for replayable fan challenges.`;
  }

  return `${leader} edges the match while TxLINE turns the score, market pulse, and proof into a shareable fan room.`;
}

function buildMoments(
  fixture: Fixture,
  score: Score,
  event: TxLineReplayEvent | undefined,
  comparisonValue: number,
): FanMoment[] {
  if (!event) {
    return [
      {
        kind: "watch",
        label: "Waiting for TxLINE",
        detail: "FanPulse keeps the room in watch mode until a live or replay event arrives.",
      },
    ];
  }

  const totalGoals = score.home + score.away;
  const hiLo = totalGoals > comparisonValue ? "higher" : "lower";

  return [
    {
      kind: "score",
      label: event.status === "finished" ? "Final score" : "Live score",
      detail: `${fixture.homeTeam.shortName} ${score.home}-${score.away} ${fixture.awayTeam.shortName}`,
    },
    {
      kind: "shift",
      label: "Hi-Lo challenge",
      detail: `${totalGoals} total goals finishes ${hiLo} than ${comparisonValue}.`,
    },
    {
      kind: "proof",
      label: "TxLINE proof",
      detail: `Replay event ${event.id} includes proof slot ${event.proof.slot}.`,
    },
    {
      kind: "share",
      label: "Shareable recap",
      detail: "The room can publish a consumer-safe recap with no betting action and no custody.",
    },
  ];
}

function buildSweepstakeLeaderboard(
  fixture: Fixture,
  score: Score,
  event: TxLineReplayEvent | undefined,
): FanSweepstakeEntry[] {
  const winningShortName = winningTeamShortName(fixture, score);
  const proofBonus = event ? 1 : 0;
  const entries = [
    {
      team: fixture.homeTeam.shortName,
      label: fixture.homeTeam.name,
      goals: score.home,
    },
    {
      team: fixture.awayTeam.shortName,
      label: fixture.awayTeam.name,
      goals: score.away,
    },
  ].map((entry) => {
    const winPoints = winningShortName === null ? 2 : winningShortName === entry.team ? 4 : 0;
    const points = entry.goals + winPoints + proofBonus;
    return {
      team: entry.team,
      label: entry.label,
      points,
      reason: `${entry.goals} goal points + ${winPoints} result points + ${proofBonus} proof point`,
    };
  });

  return entries
    .sort((a, b) => b.points - a.points || a.team.localeCompare(b.team))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function buildShareText(fixture: Fixture, score: Score, event: TxLineReplayEvent | undefined): string {
  const base = `${fixture.homeTeam.name} ${score.home}-${score.away} ${fixture.awayTeam.name}`;

  if (!event) {
    return `${base} is waiting for TxLINE verification in FanPulse.`;
  }

  return `${base} with TxLINE proof slot ${event.proof.slot}. Replay-only fan room, no wagering.`;
}

function winningTeamName(fixture: Fixture, score: Score): string | null {
  const shortName = winningTeamShortName(fixture, score);

  if (shortName === fixture.homeTeam.shortName) return fixture.homeTeam.name;
  if (shortName === fixture.awayTeam.shortName) return fixture.awayTeam.name;
  return null;
}

function winningTeamShortName(fixture: Fixture, score: Score): string | null {
  if (score.home > score.away) return fixture.homeTeam.shortName;
  if (score.away > score.home) return fixture.awayTeam.shortName;
  return null;
}
