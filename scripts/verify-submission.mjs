#!/usr/bin/env node

import { fileURLToPath } from "node:url";

const MARKET_ID = "market-wc-001-winner";

export async function verifySubmissionTarget(baseUrl, fetcher = fetch) {
  const origin = normalizeBaseUrl(baseUrl);
  const checks = [
    await checkHealth(origin, fetcher),
    await checkSettlement(origin, fetcher),
    await checkVerification(origin, fetcher),
    await checkSignals(origin, fetcher),
  ];

  return {
    ok: checks.every((check) => check.passed),
    checks,
  };
}

async function checkHealth(origin, fetcher) {
  const body = await readJson(fetcher(`${origin}/api/health`));

  return {
    label: "health",
    passed: body.status === "ok" && body.mode === "replay" && body.realMoneyWagering === false,
  };
}

async function checkSettlement(origin, fetcher) {
  const body = await readJson(fetcher(`${origin}/api/markets/${MARKET_ID}/settle`, { method: "POST" }));
  const receiptHash = body.receipt?.receiptHash;

  return {
    label: "settlement",
    passed:
      typeof receiptHash === "string" &&
      /^sha256:[a-f0-9]{64}$/.test(receiptHash) &&
      body.receipt?.outcome?.winningSelection === "ARG",
  };
}

async function checkVerification(origin, fetcher) {
  const body = await readJson(fetcher(`${origin}/api/markets/${MARKET_ID}/verify`, { method: "POST" }));

  return {
    label: "verification",
    passed: body.verification?.valid === true,
  };
}

async function checkSignals(origin, fetcher) {
  const body = await readJson(fetcher(`${origin}/api/signals`));

  return {
    label: "signals",
    passed:
      body.track === "Trading Tools and Agents" &&
      Array.isArray(body.signals) &&
      body.signals.some(
        (signal) =>
          signal.marketId === MARKET_ID &&
          signal.workflowStatus === "settlement-ready" &&
          ["low", "medium", "high"].includes(signal.riskLevel),
      ),
  };
}

async function readJson(responsePromise) {
  const response = await responsePromise;

  if (!response.ok) {
    throw new Error(`Request failed with HTTP ${response.status}`);
  }

  return response.json();
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "");
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const baseUrl = process.argv[2] ?? "http://127.0.0.1:3027";

  try {
    const result = await verifySubmissionTarget(baseUrl);
    for (const check of result.checks) {
      console.log(`${check.passed ? "PASS" : "FAIL"} ${check.label}`);
    }
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
