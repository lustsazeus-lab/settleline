# SettleLine

SettleLine is a TxODDS World Cup hackathon MVP showing verifiable prediction-market settlement and trading-agent risk signals using TxLINE-shaped match data.

Live MVP: https://settleline.vercel.app

Public repo: https://github.com/lustsazeus-lab/settleline

Demo video: https://github.com/lustsazeus-lab/settleline/releases/download/settleline-demo-2026-07-07/settleline-demo.mp4

## What It Demonstrates

- TxLINE-shaped fixture and event ingestion.
- Deterministic market resolution.
- Proof receipts with deterministic SHA-256 hashes and Solana program metadata.
- Receipt verification checks for market, fixture, event, proof metadata, and winning selection.
- Solana devnet receipt-attestation drafts that turn each receipt hash into a bounded memo payload for a devnet transaction.
- Replay-only mock escrow release mapping for the winning selection.
- LineSignal trading-agent summaries that classify settlement readiness, confidence, proof slot, and risk reasons before mock escrow release.
- Judge-facing API panel for health, settlement, verification, and signal checks.
- No-wallet judge mode.
- Compliance-safe devnet/replay behavior without real-money wagering.

## Run Locally

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3027
```

Open `http://127.0.0.1:3027`.

## Replay APIs

```bash
curl -s http://127.0.0.1:3027/api/health
curl -s http://127.0.0.1:3027/api/fixtures
curl -s http://127.0.0.1:3027/api/signals
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/settle
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/verify
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/attest
```

## Test

```bash
npm audit --audit-level=moderate
npm run typecheck
npm run test
npm run build
```

## CI

The GitHub Actions workflow in `.github/workflows/ci.yml` runs dependency audit, typecheck, tests, and production build on pushes to `main` and pull requests.

Passing public CI evidence: https://github.com/lustsazeus-lab/settleline/actions/runs/28815710008

Public demo release: https://github.com/lustsazeus-lab/settleline/releases/tag/settleline-demo-2026-07-07

## Submission Verifier

```bash
npm run verify:submission -- http://127.0.0.1:3027
npm run verify:submission -- https://settleline.vercel.app
```

Use the same command with a public deployment URL before submitting to Superteam.

## Judge Evidence Bundle

```bash
npm run evidence:bundle -- http://127.0.0.1:3027
npm run evidence:bundle -- https://settleline.vercel.app
```

This prints a JSON bundle with the replay health response, deterministic receipt, mock escrow release, receipt hash, verification checks, devnet attestation draft, and copyable judge commands. Use the same command with a public deployment URL after deployment.

## Submission Readiness Packet

```bash
npm run submission:readiness -- http://127.0.0.1:3027
PUBLIC_REPO_URL=https://github.com/lustsazeus-lab/settleline npm run submission:readiness -- https://settleline.vercel.app
PUBLIC_REPO_URL=https://github.com/lustsazeus-lab/settleline DEMO_VIDEO_URL=https://github.com/lustsazeus-lab/settleline/releases/download/settleline-demo-2026-07-07/settleline-demo.mp4 npm run submission:readiness -- https://settleline.vercel.app
```

This prints a Markdown packet with copyable Superteam fields, evidence summary, judge commands, and remaining public-submission gates. Use a public HTTPS URL plus `PUBLIC_REPO_URL` and `DEMO_VIDEO_URL` after deployment.

## Review Aids

- Architecture and proof model: `docs/architecture.md`
- Devnet attestation model: `docs/solana-devnet-attestation.md`
- Deployment runbook: `docs/deployment.md`
- Demo video script: `docs/demo-video-script.md`
- Local judge runbook: `docs/judge-runbook.md`
- Submission pack: `docs/submission.md`

## TxLINE References

- World Cup docs: `https://txline.txodds.com/documentation/worldcup`
- Quickstart: `https://txline.txodds.com/documentation/quickstart`
- Streaming data: `https://txline.txodds.com/documentation/examples/streaming-data`
- On-chain validation: `https://txline.txodds.com/documentation/examples/onchain-validation`
- Devnet program: `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J`

## Compliance Note

This project is a hackathon prototype. It does not operate real-money wagering, custody user funds, or promise payouts. The default public flow uses replay/devnet data so judges can review the settlement design without a wallet or payment.
