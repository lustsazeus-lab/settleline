import { describe, expect, it } from "vitest";
import {
  buildSubmissionReadiness,
  formatSubmissionReadinessMarkdown,
  isPublicHttpsUrl,
} from "../scripts/submission-readiness.mjs";

const evidence = {
  generatedAt: "2026-07-07T00:00:00.000Z",
  baseUrl: "http://127.0.0.1:3027",
  marketId: "market-wc-001-winner",
  health: { status: "ok", mode: "replay", realMoneyWagering: false },
  receipt: {
    receiptId: "receipt-market-wc-001-winner-txline-replay-event-001-392100001",
    receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
    outcome: { winningSelection: "ARG" },
  },
  mockEscrow: {
    escrowId: "mock-escrow-market-wc-001-winner-txline-replay-event-001",
    network: "solana-devnet-mock",
    asset: "demo-usdt-accounting-units",
    winningSelection: "ARG",
  },
  verification: { valid: true, checks: [{ label: "Receipt hash", passed: true }] },
  judgeCommands: [
    "curl -s http://127.0.0.1:3027/api/health",
    "npm run verify:submission -- http://127.0.0.1:3027",
  ],
};

describe("isPublicHttpsUrl", () => {
  it("accepts public https URLs and rejects localhost review URLs", () => {
    expect(isPublicHttpsUrl("https://settleline.example")).toBe(true);
    expect(isPublicHttpsUrl("http://127.0.0.1:3027")).toBe(false);
    expect(isPublicHttpsUrl("https://localhost:3027")).toBe(false);
  });
});

describe("buildSubmissionReadiness", () => {
  it("builds a submission packet from the evidence bundle and external links", async () => {
    await expect(
      buildSubmissionReadiness("http://127.0.0.1:3027", {
        evidenceBundleBuilder: async () => evidence,
        links: {
          publicRepoUrl: "https://github.com/example/settleline",
          demoVideoUrl: "",
        },
      }),
    ).resolves.toEqual({
      projectTitle: "SettleLine",
      listingUrl: "https://superteam.fun/earn/listing/prediction-markets-and-settlement/",
      prizeToken: "USDT",
      baseUrl: "http://127.0.0.1:3027",
      publicMvpReady: false,
      publicRepoUrl: "https://github.com/example/settleline",
      demoVideoUrl: "",
      evidence,
      gates: [
        { label: "Public HTTPS MVP", passed: false },
        { label: "Public GitHub repo", passed: true },
        { label: "Public demo video", passed: false },
        { label: "Participant owner confirmation", passed: false },
        { label: "Superteam submission confirmation", passed: false },
      ],
    });
  });
});

describe("formatSubmissionReadinessMarkdown", () => {
  it("formats copyable submission fields, evidence, and remaining gates", () => {
    const markdown = formatSubmissionReadinessMarkdown({
      projectTitle: "SettleLine",
      listingUrl: "https://superteam.fun/earn/listing/prediction-markets-and-settlement/",
      prizeToken: "USDT",
      baseUrl: "http://127.0.0.1:3027",
      publicMvpReady: false,
      publicRepoUrl: "https://github.com/example/settleline",
      demoVideoUrl: "",
      evidence,
      gates: [
        { label: "Public HTTPS MVP", passed: false },
        { label: "Public GitHub repo", passed: true },
      ],
    });

    expect(markdown).toContain("# SettleLine Submission Readiness");
    expect(markdown).toContain("Prize token: USDT");
    expect(markdown).toContain("Live MVP: http://127.0.0.1:3027");
    expect(markdown).toContain("Public MVP ready: no");
    expect(markdown).toContain("Repository: https://github.com/example/settleline");
    expect(markdown).toContain("Receipt hash: sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072");
    expect(markdown).toContain("Mock escrow: mock-escrow-market-wc-001-winner-txline-replay-event-001");
    expect(markdown).toContain("- [ ] Public HTTPS MVP");
    expect(markdown).toContain("- [x] Public GitHub repo");
  });
});
