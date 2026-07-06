import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JudgeApiPanel } from "../src/components/JudgeApiPanel";

describe("JudgeApiPanel", () => {
  it("renders the judge-facing API endpoints and expected signals", () => {
    const html = renderToStaticMarkup(<JudgeApiPanel />);

    expect(html).toContain("Judge API");
    expect(html).toContain("/api/health");
    expect(html).toContain("/api/markets/market-wc-001-winner/settle");
    expect(html).toContain("/api/markets/market-wc-001-winner/verify");
    expect(html).toContain("status: ok");
    expect(html).toContain("receiptHash: sha256");
    expect(html).toContain("valid: true");
  });
});
