import { describe, expect, it } from "vitest";
import { buildEvidenceBundle, formatEvidenceBundleJson } from "../scripts/evidence-bundle.mjs";

function jsonResponse(body) {
  return {
    ok: true,
    status: 200,
    async json() {
      return body;
    },
  };
}

describe("buildEvidenceBundle", () => {
  it("collects judge evidence from health, settlement, verification, and signals endpoints", async () => {
    const calls = [];
    const fetcher = async (url, init = {}) => {
      calls.push({ url, method: init.method ?? "GET" });

      if (url.endsWith("/api/health")) {
        return jsonResponse({ status: "ok", mode: "replay", realMoneyWagering: false });
      }

      if (url.endsWith("/api/markets/market-wc-001-winner/settle")) {
        return jsonResponse({
          receipt: {
            receiptId: "receipt-market-wc-001-winner-txline-replay-event-001-392100001",
            receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
            marketId: "market-wc-001-winner",
            fixtureId: "fixture-wc-final-2026",
            eventId: "txline-replay-event-001",
            outcome: { winningSelection: "ARG" },
          },
          mockEscrow: {
            escrowId: "mock-escrow-market-wc-001-winner-txline-replay-event-001",
            network: "solana-devnet-mock",
            asset: "demo-usdt-accounting-units",
            winningSelection: "ARG",
          },
        });
      }

      if (url.endsWith("/api/markets/market-wc-001-winner/verify")) {
        return jsonResponse({
          verification: {
            valid: true,
            checks: [
              { label: "Receipt id", passed: true },
              { label: "Receipt hash", passed: true },
            ],
          },
        });
      }

      if (url.endsWith("/api/markets/market-wc-001-winner/attest")) {
        return jsonResponse({
          attestation: {
            mode: "dry-run",
            network: "solana-devnet",
            cluster: "devnet",
            instruction: "memo-attest-receipt-hash",
            memo:
              "SettleLine|receipt=sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072|market=market-wc-001-winner|event=txline-replay-event-001|slot=392100001",
            transactionSignature: null,
            transactionExplorerUrl: null,
            safeguards: ["devnet-only", "no-user-wallet", "no-custody", "no-real-money-wagering"],
          },
        });
      }

      if (url.endsWith("/api/fan-pulse")) {
        return jsonResponse({
          track: "Consumer and Fan Experiences",
          fanPulse: {
            fixtureId: "wc-2026-demo-001",
            scoreline: "ARG 2-1 FRA",
            hiLoGame: { correctChoice: "HI" },
            proof: { slot: 392100001 },
            safety: { realMoneyWagering: false },
          },
        });
      }

      if (url.endsWith("/api/signals")) {
        return jsonResponse({
          track: "Trading Tools and Agents",
          signals: [{ marketId: "market-wc-001-winner", workflowStatus: "settlement-ready", riskLevel: "medium" }],
        });
      }

      throw new Error(`Unexpected URL ${url}`);
    };

    await expect(
      buildEvidenceBundle("https://settleline.example/", {
        fetcher,
        now: () => "2026-07-07T00:00:00.000Z",
      }),
    ).resolves.toEqual({
      generatedAt: "2026-07-07T00:00:00.000Z",
      baseUrl: "https://settleline.example",
      marketId: "market-wc-001-winner",
      health: { status: "ok", mode: "replay", realMoneyWagering: false },
      receipt: {
        receiptId: "receipt-market-wc-001-winner-txline-replay-event-001-392100001",
        receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
        marketId: "market-wc-001-winner",
        fixtureId: "fixture-wc-final-2026",
        eventId: "txline-replay-event-001",
        outcome: { winningSelection: "ARG" },
      },
      mockEscrow: {
        escrowId: "mock-escrow-market-wc-001-winner-txline-replay-event-001",
        network: "solana-devnet-mock",
        asset: "demo-usdt-accounting-units",
        winningSelection: "ARG",
      },
      verification: {
        valid: true,
        checks: [
          { label: "Receipt id", passed: true },
          { label: "Receipt hash", passed: true },
        ],
      },
      attestation: {
        mode: "dry-run",
        network: "solana-devnet",
        cluster: "devnet",
        instruction: "memo-attest-receipt-hash",
        memo:
          "SettleLine|receipt=sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072|market=market-wc-001-winner|event=txline-replay-event-001|slot=392100001",
        transactionSignature: null,
        transactionExplorerUrl: null,
        safeguards: ["devnet-only", "no-user-wallet", "no-custody", "no-real-money-wagering"],
      },
      fanPulse: {
        track: "Consumer and Fan Experiences",
        fanPulse: {
          fixtureId: "wc-2026-demo-001",
          scoreline: "ARG 2-1 FRA",
          hiLoGame: { correctChoice: "HI" },
          proof: { slot: 392100001 },
          safety: { realMoneyWagering: false },
        },
      },
      signals: {
        track: "Trading Tools and Agents",
        signals: [{ marketId: "market-wc-001-winner", workflowStatus: "settlement-ready", riskLevel: "medium" }],
      },
      judgeCommands: [
        "curl -s https://settleline.example/api/health",
        "curl -s -X POST https://settleline.example/api/markets/market-wc-001-winner/settle",
        "curl -s -X POST https://settleline.example/api/markets/market-wc-001-winner/verify",
        "curl -s -X POST https://settleline.example/api/markets/market-wc-001-winner/attest",
        "curl -s https://settleline.example/api/fan-pulse",
        "curl -s https://settleline.example/api/signals",
        "npm run verify:submission -- https://settleline.example",
      ],
    });

    expect(calls).toEqual([
      { url: "https://settleline.example/api/health", method: "GET" },
      { url: "https://settleline.example/api/markets/market-wc-001-winner/settle", method: "POST" },
      { url: "https://settleline.example/api/markets/market-wc-001-winner/verify", method: "POST" },
      { url: "https://settleline.example/api/markets/market-wc-001-winner/attest", method: "POST" },
      { url: "https://settleline.example/api/fan-pulse", method: "GET" },
      { url: "https://settleline.example/api/signals", method: "GET" },
    ]);
  });

  it("formats evidence JSON with a trailing newline for redirected artifacts", () => {
    expect(formatEvidenceBundleJson({ ok: true })).toBe('{\n  "ok": true\n}\n');
  });
});
