import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LineSignalPanel } from "../src/components/LineSignalPanel";
import { getReplayEvents, getReplayFixtures, getReplayMarkets } from "../src/domain/replay";
import { buildTradingSignals } from "../src/domain/signals";

describe("LineSignalPanel", () => {
  it("renders the trading-agent signal evidence without implying real wagering", () => {
    const signals = buildTradingSignals({
      markets: getReplayMarkets(),
      fixtures: getReplayFixtures(),
      events: getReplayEvents(),
    });
    const html = renderToStaticMarkup(<LineSignalPanel signals={signals} />);

    expect(html).toContain("LineSignal");
    expect(html).toContain("Trading Tools and Agents");
    expect(html).toContain("ARG vs FRA");
    expect(html).toContain("settlement-ready");
    expect(html).toContain("Verify the proof receipt before releasing mock escrow.");
    expect(html).toContain("No autonomous trading or wagering.");
  });
});
