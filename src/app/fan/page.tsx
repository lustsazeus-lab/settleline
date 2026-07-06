import Link from "next/link";
import { FanPulsePanel } from "@/components/FanPulsePanel";
import { buildFanPulseExperience } from "@/domain/fan-pulse";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "@/domain/replay";

export default function FanPage() {
  const pulse = buildFanPulseExperience({
    fixtures: getReplayFixtures(),
    markets: getReplayMarkets(),
    events: getReplayEvents(),
  });

  return (
    <main className="shell">
      <Link className="back-link" href="/">
        Back to dashboard
      </Link>
      <section className="intro-panel fan-intro">
        <p className="eyebrow">World Cup fan layer</p>
        <h1 className="headline">Live data becomes a room fans open during the match.</h1>
        <p className="lead">
          FanPulse converts TxLINE match events into a consumer-safe watch-party recap, Hi-Lo challenge, proof-backed
          sweepstake leaderboard, and shareable story without custody or real-money wagering.
        </p>
      </section>
      <FanPulsePanel pulse={pulse} />
    </main>
  );
}
