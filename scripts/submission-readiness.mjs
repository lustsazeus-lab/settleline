#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import { buildEvidenceBundle } from "./evidence-bundle.mjs";

const LISTING_URL = "https://superteam.fun/earn/listing/prediction-markets-and-settlement/";

export async function buildSubmissionReadiness(
  baseUrl,
  {
    evidenceBundleBuilder = buildEvidenceBundle,
    links = {},
    participantConfirmed = false,
    submissionConfirmed = false,
  } = {},
) {
  const evidence = await evidenceBundleBuilder(baseUrl);
  const publicRepoUrl = links.publicRepoUrl ?? "";
  const demoVideoUrl = links.demoVideoUrl ?? "";

  return {
    projectTitle: "SettleLine",
    listingUrl: LISTING_URL,
    prizeToken: "USDT",
    baseUrl,
    publicMvpReady: isPublicHttpsUrl(baseUrl),
    publicRepoUrl,
    demoVideoUrl,
    evidence,
    gates: [
      { label: "Public HTTPS MVP", passed: isPublicHttpsUrl(baseUrl) },
      { label: "Public GitHub repo", passed: isPublicHttpsUrl(publicRepoUrl) },
      { label: "Public demo video", passed: isPublicHttpsUrl(demoVideoUrl) },
      { label: "Participant owner confirmation", passed: participantConfirmed },
      { label: "Superteam submission confirmation", passed: submissionConfirmed },
    ],
  };
}

export function formatSubmissionReadinessMarkdown(packet) {
  return [
    "# SettleLine Submission Readiness",
    "",
    `Listing: ${packet.listingUrl}`,
    `Prize token: ${packet.prizeToken}`,
    `Live MVP: ${packet.baseUrl}`,
    `Public MVP ready: ${packet.publicMvpReady ? "yes" : "no"}`,
    `Repository: ${packet.publicRepoUrl || "TBD"}`,
    `Demo video: ${packet.demoVideoUrl || "TBD"}`,
    "",
    "## Copyable Submission Fields",
    "",
    `Project title: ${packet.projectTitle}`,
    "",
    "Brief explanation:",
    "SettleLine is a verifiable World Cup prediction settlement dashboard built on TxLINE-shaped data. It turns replayed match updates into deterministic market resolution, proof receipts, SHA-256 receipt hashes, verification checks, and a replay-only mock escrow release without requiring real-money wagering, custody, login, payment, or wallet connection for judge review.",
    "",
    "## Evidence",
    "",
    `Health: ${packet.evidence.health.status} / ${packet.evidence.health.mode} / realMoneyWagering=${packet.evidence.health.realMoneyWagering}`,
    `Receipt: ${packet.evidence.receipt.receiptId}`,
    `Receipt hash: ${packet.evidence.receipt.receiptHash}`,
    `Winner: ${packet.evidence.receipt.outcome.winningSelection}`,
    `Mock escrow: ${packet.evidence.mockEscrow.escrowId}`,
    `Mock escrow asset: ${packet.evidence.mockEscrow.asset}`,
    `Verification valid: ${packet.evidence.verification.valid}`,
    "",
    "Judge commands:",
    ...packet.evidence.judgeCommands.map((command) => `- \`${command}\``),
    "",
    "## Remaining Gates",
    "",
    ...packet.gates.map((gate) => `- [${gate.passed ? "x" : " "}] ${gate.label}`),
    "",
  ].join("\n");
}

export function isPublicHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const baseUrl = process.argv[2] ?? "http://127.0.0.1:3027";

  try {
    const packet = await buildSubmissionReadiness(baseUrl, {
      links: {
        publicRepoUrl: process.env.PUBLIC_REPO_URL ?? "",
        demoVideoUrl: process.env.DEMO_VIDEO_URL ?? "",
      },
      participantConfirmed: process.env.PARTICIPANT_CONFIRMED === "1",
      submissionConfirmed: process.env.SUPERTEAM_SUBMISSION_CONFIRMED === "1",
    });
    process.stdout.write(formatSubmissionReadinessMarkdown(packet));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
