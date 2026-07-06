# SettleLine Deployment Runbook

Use this runbook only after the participant confirms public deployment. It does not require wallet signing, KYC, paid services, or Superteam submission.

## Confirmation Gate

Required phrase before public deployment:

```text
确认部署 SettleLine 公开 MVP
```

Do not deploy if any of these are true:

- the public URL would require login,
- the public URL would require a wallet,
- the public URL would enable real-money wagering,
- the platform requires payment or KYC without fresh approval,
- the deployment would expose private tokens or secrets.

## Public URL Requirements

The deployed MVP must provide:

- HTTPS URL.
- No login.
- No wallet connection.
- No deposits or payouts.
- Replay mode visible on the dashboard.
- `GET /api/health` returns `status: ok`, `mode: replay`, and `realMoneyWagering: false`.
- `POST /api/markets/market-wc-001-winner/settle` returns a `sha256:` receipt hash.
- `POST /api/markets/market-wc-001-winner/verify` returns `valid: true`.

## Pre-Deploy Checks

Run locally before connecting a public host:

```bash
npm audit --audit-level=moderate
npm run typecheck
npm run test
npm run build
```

Expected:

- 0 vulnerabilities at moderate level or higher.
- TypeScript exits cleanly.
- Vitest passes.
- Next production build includes `/api/health`, `/api/markets/[marketId]/settle`, and `/api/markets/[marketId]/verify`.

## Post-Deploy Checks

Replace `<public-url>` with the deployed HTTPS origin:

```bash
npm run verify:submission -- <public-url>
```

Expected:

```text
PASS health
PASS settlement
PASS verification
```

Manual browser checks:

1. Open `<public-url>`.
2. Confirm `Replay mode / no wallet required`.
3. Confirm the dashboard shows `Judge API`.
4. Open `Match Winner`.
5. Confirm `Proof Receipt`, `Receipt hash`, `Verification Checks`, and `Receipt verified`.

## Publish Evidence

Record these values for the Superteam form:

- Public MVP URL.
- Public GitHub repo URL.
- Public demo video URL.
- Public technical docs URL, preferably `docs/architecture.md`.
- Latest passing GitHub Actions run URL.
- `npm run verify:submission -- <public-url>` output.

## Rollback / Stop Conditions

Stop and do not submit if:

- verifier output contains any `FAIL`,
- `/api/health` does not return replay/no-real-money status,
- public page requires login or wallet,
- GitHub Actions is failing,
- public URL exposes any secret,
- terms, region, or participant ownership are unclear.
