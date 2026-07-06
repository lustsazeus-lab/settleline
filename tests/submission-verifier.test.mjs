import { describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { promisify } from "node:util";
import { verifySubmissionTarget } from "../scripts/verify-submission.mjs";

const execFileAsync = promisify(execFile);

function jsonResponse(body) {
  return {
    ok: true,
    status: 200,
    async json() {
      return body;
    },
  };
}

describe("verifySubmissionTarget", () => {
  it("checks the health, settle, verify, and signals endpoints for a deployment URL", async () => {
    const calls = [];
    const fetcher = async (url, init = {}) => {
      calls.push({ url, method: init.method ?? "GET" });

      if (url.endsWith("/api/health")) {
        return jsonResponse({ status: "ok", mode: "replay", realMoneyWagering: false });
      }

      if (url.endsWith("/api/markets/market-wc-001-winner/settle")) {
        return jsonResponse({
          receipt: {
            receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
            outcome: { winningSelection: "ARG" },
          },
        });
      }

      if (url.endsWith("/api/markets/market-wc-001-winner/verify")) {
        return jsonResponse({ verification: { valid: true } });
      }

      if (url.endsWith("/api/fan-pulse")) {
        return jsonResponse({
          track: "Consumer and Fan Experiences",
          fanPulse: {
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

    await expect(verifySubmissionTarget("https://settleline.example/", fetcher)).resolves.toEqual({
      ok: true,
      checks: [
        { label: "health", passed: true },
        { label: "settlement", passed: true },
        { label: "verification", passed: true },
        { label: "fan-pulse", passed: true },
        { label: "signals", passed: true },
      ],
    });
    expect(calls).toEqual([
      { url: "https://settleline.example/api/health", method: "GET" },
      { url: "https://settleline.example/api/markets/market-wc-001-winner/settle", method: "POST" },
      { url: "https://settleline.example/api/markets/market-wc-001-winner/verify", method: "POST" },
      { url: "https://settleline.example/api/fan-pulse", method: "GET" },
      { url: "https://settleline.example/api/signals", method: "GET" },
    ]);
  });

  it("marks verification as failed when the proof endpoint is not valid", async () => {
    const fetcher = async (url) => {
      if (url.endsWith("/api/health")) {
        return jsonResponse({ status: "ok", mode: "replay", realMoneyWagering: false });
      }

      if (url.endsWith("/api/markets/market-wc-001-winner/settle")) {
        return jsonResponse({
          receipt: {
            receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
            outcome: { winningSelection: "ARG" },
          },
        });
      }

      if (url.endsWith("/api/fan-pulse")) {
        return jsonResponse({
          track: "Consumer and Fan Experiences",
          fanPulse: {
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

      return jsonResponse({ verification: { valid: false } });
    };

    await expect(verifySubmissionTarget("https://settleline.example", fetcher)).resolves.toEqual({
      ok: false,
      checks: [
        { label: "health", passed: true },
        { label: "settlement", passed: true },
        { label: "verification", passed: false },
        { label: "fan-pulse", passed: true },
        { label: "signals", passed: true },
      ],
    });
  });

  it("prints PASS lines when invoked as a CLI", async () => {
    const server = createServer((request, response) => {
      response.setHeader("content-type", "application/json");

      if (request.url === "/api/health") {
        response.end(JSON.stringify({ status: "ok", mode: "replay", realMoneyWagering: false }));
        return;
      }

      if (request.url === "/api/markets/market-wc-001-winner/settle") {
        response.end(
          JSON.stringify({
            receipt: {
              receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
              outcome: { winningSelection: "ARG" },
            },
          }),
        );
        return;
      }

      if (request.url === "/api/signals") {
        response.end(
          JSON.stringify({
            track: "Trading Tools and Agents",
            signals: [{ marketId: "market-wc-001-winner", workflowStatus: "settlement-ready", riskLevel: "medium" }],
          }),
        );
        return;
      }

      if (request.url === "/api/fan-pulse") {
        response.end(
          JSON.stringify({
            track: "Consumer and Fan Experiences",
            fanPulse: {
              scoreline: "ARG 2-1 FRA",
              hiLoGame: { correctChoice: "HI" },
              proof: { slot: 392100001 },
              safety: { realMoneyWagering: false },
            },
          }),
        );
        return;
      }

      response.end(JSON.stringify({ verification: { valid: true } }));
    });

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();

    try {
      const { stdout } = await execFileAsync("node", [
        "scripts/verify-submission.mjs",
        `http://127.0.0.1:${address.port}`,
      ]);

      expect(stdout).toContain("PASS health");
      expect(stdout).toContain("PASS settlement");
      expect(stdout).toContain("PASS verification");
      expect(stdout).toContain("PASS fan-pulse");
      expect(stdout).toContain("PASS signals");
    } finally {
      await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
  });
});
