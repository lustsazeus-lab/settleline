#!/usr/bin/env node

import { fileURLToPath } from "node:url";

const DEFAULT_MARKET_ID = "market-wc-001-winner";

export async function buildEvidenceBundle(
  baseUrl,
  { fetcher = fetch, now = () => new Date().toISOString(), marketId = DEFAULT_MARKET_ID } = {},
) {
  const origin = normalizeBaseUrl(baseUrl);
  const [health, settlement, verification] = await Promise.all([
    readJson(fetcher(`${origin}/api/health`)),
    readJson(fetcher(`${origin}/api/markets/${marketId}/settle`, { method: "POST" })),
    readJson(fetcher(`${origin}/api/markets/${marketId}/verify`, { method: "POST" })),
  ]);

  return {
    generatedAt: now(),
    baseUrl: origin,
    marketId,
    health,
    receipt: settlement.receipt,
    mockEscrow: settlement.mockEscrow,
    verification: verification.verification,
    judgeCommands: [
      `curl -s ${origin}/api/health`,
      `curl -s -X POST ${origin}/api/markets/${marketId}/settle`,
      `curl -s -X POST ${origin}/api/markets/${marketId}/verify`,
      `npm run verify:submission -- ${origin}`,
    ],
  };
}

export function formatEvidenceBundleJson(bundle) {
  return `${JSON.stringify(bundle, null, 2)}\n`;
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
    const bundle = await buildEvidenceBundle(baseUrl);
    process.stdout.write(formatEvidenceBundleJson(bundle));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
