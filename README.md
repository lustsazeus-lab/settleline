# SettleLine

SettleLine is a TxODDS World Cup hackathon MVP showing verifiable prediction-market settlement using TxLINE-shaped match data.

## What It Demonstrates

- TxLINE-shaped fixture and event ingestion.
- Deterministic market resolution.
- Proof receipts with deterministic SHA-256 hashes and Solana program metadata.
- Receipt verification checks for market, fixture, event, proof metadata, and winning selection.
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
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/settle
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/verify
```

## Test

```bash
npm run typecheck
npm run test
npm run build
```

## Review Aids

- Demo video script: `docs/demo-video-script.md`
- Local judge runbook: `docs/judge-runbook.md`

## TxLINE References

- World Cup docs: `https://txline.txodds.com/documentation/worldcup`
- Quickstart: `https://txline.txodds.com/documentation/quickstart`
- Streaming data: `https://txline.txodds.com/documentation/examples/streaming-data`
- On-chain validation: `https://txline.txodds.com/documentation/examples/onchain-validation`
- Devnet program: `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J`

## Compliance Note

This project is a hackathon prototype. It does not operate real-money wagering, custody user funds, or promise payouts. The default public flow uses replay/devnet data so judges can review the settlement design without a wallet or payment.
