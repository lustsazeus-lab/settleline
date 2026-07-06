# SettleLine Submission Pack

Use this pack after demo recording and participant-owner confirmation. Do not submit through Superteam from an AI agent account.

## Listing

- Listing: `https://superteam.fun/earn/listing/prediction-markets-and-settlement/`
- Track: TxODDS World Cup / Prediction Markets and Settlement
- Prize token: USDT

## Project Title

SettleLine

## Brief Explanation

SettleLine is a verifiable World Cup prediction settlement and trading-agent dashboard built on top of TxLINE-shaped data. It shows how live or replayed TxLINE match updates can drive deterministic market resolution, produce a transparent proof receipt with a deterministic SHA-256 hash, verify that receipt against market/event/proof metadata, generate LineSignal risk summaries for agent review, and trigger a devnet/mock escrow settlement flow without requiring real-money wagering.

The project focuses on the settlement and pre-release review layer rather than gambling UX: judges can open the app without a wallet, inspect the fixture state, review the settlement condition, replay the TxLINE-shaped score event, inspect LineSignal readiness/risk cards, verify the hashed receipt checks, and see how the final result maps to a proof-backed payout decision.

## Live MVP Link

https://settleline.vercel.app

Deployment provider: Vercel.

Canonical deployment URL:

```text
https://settleline-hbk23cgzb-yihangdeng-9983s-projects.vercel.app
```

Deployment runbook: `docs/deployment.md`.

Requirements for the link:

- Public HTTPS URL.
- No login.
- No wallet connection.
- No payment.
- Replay mode remains available.
- `npm run verify:submission -- <public-url>` passes.

## Demo Video Link

https://github.com/lustsazeus-lab/settleline/releases/download/settleline-demo-2026-07-07/settleline-demo.mp4

Release page:

```text
https://github.com/lustsazeus-lab/settleline/releases/tag/settleline-demo-2026-07-07
```

Video SHA-256:

```text
b5dfb396a7728da272b5cb2bbe7f87f3006de4af5c3807dfb76ad640f904509a
```

Generated from `docs/demo-video-script.md`. Runtime: about 76 seconds.

## Public Repository Link

https://github.com/lustsazeus-lab/settleline

Repository should show:

- README setup and replay API instructions.
- `docs/architecture.md` for data flow, rules, proof receipt, and verification checks.
- `docs/judge-runbook.md` for local review.
- `.github/workflows/ci.yml` with audit, typecheck, tests, and build.
- Tests for settlement, proof receipt hashing, verification, API routes, and submission verifier.

## Technical Documentation Link

https://github.com/lustsazeus-lab/settleline/blob/main/docs/architecture.md

Passing GitHub Actions evidence:

```text
https://github.com/lustsazeus-lab/settleline/actions/runs/28815710008
```

## Verification Commands

Run before submitting:

```bash
npm audit --audit-level=moderate
npm run typecheck
npm run test
npm run build
npm run verify:submission -- https://settleline.vercel.app
npm run evidence:bundle -- https://settleline.vercel.app
PUBLIC_REPO_URL=https://github.com/lustsazeus-lab/settleline DEMO_VIDEO_URL=https://github.com/lustsazeus-lab/settleline/releases/download/settleline-demo-2026-07-07/settleline-demo.mp4 npm run submission:readiness -- https://settleline.vercel.app
```

Expected verifier output:

```text
PASS health
PASS settlement
PASS verification
PASS signals
```

The evidence bundle command prints JSON containing:

- deployment health and replay/no-real-money status,
- deterministic proof receipt,
- replay-only mock escrow release,
- SHA-256 receipt hash,
- receipt verification checks,
- LineSignal Trading Tools and Agents output,
- copyable judge commands.

The readiness command prints a Markdown packet containing copyable Superteam form fields, evidence summary, judge commands, and the remaining gates.

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

- [x] Public MVP URL is live.
- [x] Deployment runbook stop conditions are clear.
- [x] Public MVP opens without login or wallet.
- [x] Public MVP shows replay/no-real-money compliance copy.
- [x] Public GitHub repo is available.
- [x] GitHub Actions CI is visible and passing.
- [x] `docs/architecture.md` is reachable in the public repo.
- [x] `npm run verify:submission -- https://settleline.vercel.app` passes.
- [x] `npm run evidence:bundle -- https://settleline.vercel.app` includes mock escrow release and `valid: true`.
- [x] `npm run submission:readiness -- https://settleline.vercel.app` marks public MVP, repo, and demo video gates ready.
- [x] Demo video is public and under 5 minutes.
- [ ] User confirms they are the real participant/owner.
- [ ] User confirms Superteam submission action.
