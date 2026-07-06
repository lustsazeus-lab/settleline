# SettleLine Judge Runbook

This runbook is for local review before a public deployment exists.

## Start

```bash
cd /Users/ryanai/Documents/好用工具/ProfitCollect/settleline
npm install
npm run dev -- --hostname 127.0.0.1 --port 3027
```

Open:

```text
http://127.0.0.1:3027
```

## What to Check

1. Dashboard loads without login or wallet connection.
2. Compliance notice says the app is a hackathon demo and does not enable real-money wagering.
3. The dashboard shows two demo markets.
4. Opening `Match Winner` shows:
   - settlement timeline,
   - proof receipt,
   - winning selection `ARG`,
   - reason `Argentina defeated France 2-1`,
   - Solana devnet program ID,
   - Merkle root.

## API Checks

```bash
curl -s http://127.0.0.1:3027/api/fixtures
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/settle
```

Expected settlement receipt id:

```text
receipt-market-wc-001-winner-txline-replay-event-001-392100001
```

Expected winning selection:

```text
ARG
```

## Verification Commands

```bash
npm audit --audit-level=moderate
npm run typecheck
npm run test
npm run build
```

Expected:

- no audit vulnerabilities at moderate level or higher,
- TypeScript exits cleanly,
- 5 Vitest tests pass,
- Next build includes `/`, `/market/[marketId]`, `/api/fixtures`, and `/api/markets/[marketId]/settle`.

## What Is Intentionally Out of Scope

- No production betting.
- No real-money deposits.
- No custodial wallet flow.
- No public submission by an AI agent.
- No live TxLINE token activation until the participant confirms wallet/API actions.
