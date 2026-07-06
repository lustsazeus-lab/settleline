# SettleLine Submission Pack

Use this pack after public deployment, public GitHub publication, demo recording, and participant-owner confirmation. Do not submit through Superteam from an AI agent account.

## Listing

- Listing: `https://superteam.fun/earn/listing/prediction-markets-and-settlement/`
- Track: TxODDS World Cup / Prediction Markets and Settlement
- Prize token: USDT

## Project Title

SettleLine

## Brief Explanation

SettleLine is a verifiable World Cup prediction settlement dashboard built on top of TxLINE-shaped data. It shows how live or replayed TxLINE match updates can drive deterministic market resolution, produce a transparent proof receipt with a deterministic SHA-256 hash, verify that receipt against market/event/proof metadata, and trigger a devnet/mock escrow settlement flow without requiring real-money wagering.

The project focuses on the settlement layer rather than gambling UX: judges can open the app without a wallet, inspect the fixture state, review the settlement condition, replay the TxLINE-shaped score event, verify the hashed receipt checks, and see how the final result maps to a proof-backed payout decision.

## Live MVP Link

TBD after deployment.

Requirements for the link:

- Public HTTPS URL.
- No login.
- No wallet connection.
- No payment.
- Replay mode remains available.
- `npm run verify:submission -- <public-url>` passes.

## Demo Video Link

TBD after recording.

Use `docs/demo-video-script.md`. Target length: under 5 minutes.

## Public Repository Link

TBD after public GitHub repo is created and pushed.

Repository should show:

- README setup and replay API instructions.
- `docs/architecture.md` for data flow, rules, proof receipt, and verification checks.
- `docs/judge-runbook.md` for local review.
- `.github/workflows/ci.yml` with audit, typecheck, tests, and build.
- Tests for settlement, proof receipt hashing, verification, API routes, and submission verifier.

## Technical Documentation Link

Preferred: public repo link to `docs/architecture.md`.

Fallback while local only:

```text
/Users/ryanai/Documents/好用工具/ProfitCollect/settleline/docs/architecture.md
```

## Verification Commands

Run before submitting:

```bash
npm audit --audit-level=moderate
npm run typecheck
npm run test
npm run build
npm run verify:submission -- <public-url>
```

Expected verifier output:

```text
PASS health
PASS settlement
PASS verification
```

## TxLINE API Experience

TxLINE's strongest point is that it treats sports data as more than a JSON feed: the API, stream model, and Solana-anchored validation primitives make it possible to build a visible proof trail from match update to settlement decision. The World Cup free tier is also useful for hackathon builders because it removes commercial data fees during the build window.

The main friction was the activation path: a builder has to keep network, Solana RPC, program ID, guest JWT, subscription transaction, and API host aligned. For future builders, a tiny end-to-end sample app or hosted sandbox token would reduce setup mistakes and let teams spend more time on the product layer.

## Safety / Compliance Boundary

SettleLine does not:

- operate real-money wagering,
- custody user funds,
- promise payouts,
- require wallet connection for judge review,
- perform live TxLINE activation without participant confirmation,
- perform Superteam submission without the natural-person participant.

## Final Submission Checklist

- [ ] Public MVP URL is live.
- [ ] Public MVP opens without login or wallet.
- [ ] Public MVP shows replay/no-real-money compliance copy.
- [ ] Public GitHub repo is available.
- [ ] GitHub Actions CI is visible and passing.
- [ ] `docs/architecture.md` is reachable in the public repo.
- [ ] `npm run verify:submission -- <public-url>` passes.
- [ ] Demo video is public and under 5 minutes.
- [ ] User confirms they are the real participant/owner.
- [ ] User confirms Superteam submission action.
