# SettleLine Architecture

SettleLine is a replay-first TxODDS hackathon MVP for verifiable prediction-market settlement, trading-agent risk signals, and consumer fan experiences. It demonstrates the settlement, proof, fan engagement, and pre-release review layer without enabling real-money wagering, deposits, custody, or wallet-gated review.

## Review Mode

- Mode: TxLINE-shaped replay data.
- Access: no login, no wallet, no payment.
- Scope: deterministic settlement and receipt verification.
- Chain context: Solana devnet metadata only.
- Production betting: intentionally out of scope.

## Data Flow

```text
TxLINE-shaped replay event
  -> fixture and market lookup
  -> deterministic settlement rule
  -> proof receipt
  -> FanPulse consumer story, Hi-Lo game, and sweepstake leaderboard
  -> LineSignal readiness and risk summary
  -> replay-only mock escrow release
  -> receipt verification checks
  -> dashboard and JSON APIs
```

Core files:

- `src/data/worldcup-replay.json`: replay fixtures, markets, and TxLINE-shaped event proof metadata.
- `src/domain/replay.ts`: read-only replay data access.
- `src/domain/settlement.ts`: deterministic rule engine.
- `src/domain/fan-pulse.ts`: consumer fan experience builder for story cards, Hi-Lo game state, sweepstake points, proof metadata, and no-wagering safeguards.
- `src/domain/signals.ts`: trading-agent signal builder for settlement readiness, confidence, proof slot, and risk reasons.
- `src/domain/escrow.ts`: deterministic replay-only mock escrow release mapping.
- `src/domain/proofs.ts`: receipt construction, stable SHA-256 hash, and verification checks.
- `src/integrations/txline/replay-adapter.ts`: adapter used by pages and API routes.
- `src/integrations/txline/http-adapter.ts`: guarded placeholder for future live TxLINE activation.

## Settlement Rules

The MVP includes two market kinds:

- `match-winner`: resolves to the home team short name, away team short name, or `DRAW`.
- `total-goals-over`: resolves to `OVER` when total goals are greater than the configured threshold, otherwise `UNDER`.

Before resolving, the engine rejects:

- fixtures that are not `finished`,
- markets that do not belong to the supplied fixture,
- total-goals markets without a numeric threshold.

## Proof Receipt

A proof receipt binds:

- receipt id,
- deterministic receipt hash,
- market id,
- fixture id,
- settlement outcome,
- TxLINE replay event id,
- Merkle root,
- signature,
- Solana devnet slot,
- Solana devnet program id.

The receipt hash is a `sha256:` digest over a stable, sorted JSON representation of the receipt payload excluding `receiptHash` itself. This makes local tampering visible without requiring judges to run a wallet or sign a transaction.

## Mock Escrow Settlement

`buildMockEscrowSettlement` maps a verified proof receipt to a replay-only settlement instruction:

- `network`: `solana-devnet-mock`,
- `asset`: `demo-usdt-accounting-units`,
- `instruction`: `release-to-winning-selection`,
- payout destination: deterministic demo vault for the winning selection,
- safeguards: `replay-only`, `no-custody`, and `no-real-money-wagering`.

This is an accounting proof for judges, not a live payment rail. It shows the exact point where a compliant devnet or production escrow program would release funds after receipt verification succeeds.

## Verification Checks

`verifyProofReceipt` returns a structured result with one boolean per check:

- `Receipt id`: receipt id matches the market, event, and slot.
- `Receipt hash`: SHA-256 hash matches the receipt payload.
- `Market binding`: receipt and outcome market ids match the selected market.
- `Fixture binding`: receipt fixture matches the market and event fixture.
- `Event binding`: receipt event id matches the TxLINE-shaped event.
- `Proof metadata`: Merkle root, signature, slot, and program id match the event.
- `Winning selection`: outcome selection exists in the market selections.

The dashboard shows these checks on the market detail page. The same verification is available through:

```bash
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/verify
```

## LineSignal Trading-Agent Layer

LineSignal is the Trading Tools and Agents extension. It does not place trades or recommend wagers. It turns the same TxLINE replay event into a judge-readable workflow signal for each market:

- `workflowStatus`: whether the market is settlement-ready, still watching, or needs review.
- `riskLevel`: low, medium, or high based on fixture finality, service level, and close-score/threshold sensitivity.
- `confidence`: deterministic confidence score derived from TxLINE service level and market sensitivity.
- `proofSlot`: Solana devnet proof slot attached to the replay event.
- `riskReasons`: concise reasons an agent or reviewer should verify before releasing mock escrow.

The layer is intentionally a pure domain function over replay fixtures, markets, and events, so a future live adapter can reuse it without changing UI or API contracts.

## FanPulse Consumer Layer

FanPulse is the Consumer and Fan Experiences extension. It is a fan-facing page and API over the same TxLINE-shaped replay data, designed for mainstream World Cup viewers rather than market operators.

It produces:

- `hero`: a plain-language match story such as Argentina 2-1 France.
- `moments`: score, Hi-Lo challenge, proof, and shareable recap cards.
- `hiLoGame`: a deterministic higher/lower stat prompt derived from total goals and the market threshold.
- `sweepstake`: a friend leaderboard that awards points for goals, match result, and TxLINE proof.
- `proof`: event id, source, slot, and program id exposed for judge review.
- `safety`: explicit `realMoneyWagering: false`, `custody: false`, and replay/no-custody/no-real-money safeguards.

The live page is:

```text
/fan
```

The judge API is:

```bash
curl -s http://127.0.0.1:3027/api/fan-pulse
```

FanPulse intentionally avoids betting UX, deposit flows, wallet signatures, and custodial prizes. Its monetization path is sponsor-safe watch rooms, branded community packages, and replay archives.

## API Surface

```bash
GET  /api/health
GET  /api/fixtures
GET  /api/fan-pulse
GET  /api/signals
POST /api/markets/[marketId]/settle
POST /api/markets/[marketId]/verify
```

Use the submission verifier for an end-to-end check:

```bash
npm run verify:submission -- http://127.0.0.1:3027
npm run evidence:bundle -- http://127.0.0.1:3027
```

Expected output:

```text
PASS health
PASS settlement
PASS verification
PASS fan-pulse
PASS signals
```

The evidence bundle also includes the proof receipt, mock escrow release JSON, FanPulse payload, and LineSignal output.

## Live TxLINE Extension Path

The production extension is intentionally narrow:

1. Activate real TxLINE credentials and subscription outside the judge replay flow.
2. Replace `replayAdapter.latestEventForFixture` with a live TxLINE HTTP/SSE adapter.
3. Preserve the same `settleMarket`, `buildProofReceipt`, and `verifyProofReceipt` domain APIs.
4. Add devnet escrow resolution after receipt verification passes.
5. Keep public review mode no-wallet and no-real-money unless a compliant production wagering program exists.

## CI

`.github/workflows/ci.yml` runs:

- `npm ci`,
- `npm audit --audit-level=moderate`,
- `npm run typecheck`,
- `npm run test`,
- `npm run build`.

The local equivalent plus API verifier is documented in `docs/judge-runbook.md`.
