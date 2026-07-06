# SettleLine Demo Video Script

Target length: 3:30-4:15.

Use this script for the Superteam TxODDS submission video. Record the browser at `http://127.0.0.1:3027` after the local dev server is running.

## 0:00-0:25 - Opening

Voiceover:

SettleLine is a proof-first World Cup prediction settlement demo for the TxODDS hackathon. It shows how TxLINE-shaped match data can drive deterministic market resolution and produce an auditable receipt without requiring real-money wagering.

Screen:

- Show the SettleLine dashboard.
- Point to `Replay mode / no wallet required`.
- Point to the compliance notice.

## 0:25-1:00 - Data and Markets

Voiceover:

The demo runs in replay mode so judges can test it without a wallet, token purchase, subscription, or login. The fixture and event payloads are shaped around the TxLINE World Cup flow, including service level, program ID, slot, signature, and Merkle root metadata.

Screen:

- Show the dashboard fact panel.
- Show the two market cards:
  - Match Winner
  - Total Goals Over 2.5

## 1:00-1:45 - Settlement Walkthrough

Voiceover:

Opening a market shows the exact settlement timeline. The fixture is loaded, the market is selected, the TxLINE-shaped event is received, and the final score becomes the deterministic input to the rule engine.

Screen:

- Open `Match Winner`.
- Show `Settlement Timeline`.
- Show final score `2-1`.

## 1:45-2:35 - Proof Receipt

Voiceover:

The result is not just a UI label. SettleLine builds a proof receipt that binds the market, fixture, event ID, winning selection, reason, Solana devnet program ID, slot, and Merkle root. This is the interface a developer would extend into a devnet escrow or on-chain validation path.

Screen:

- Show `Proof Receipt`.
- Highlight:
  - receipt id,
  - winning selection `ARG`,
  - reason `Argentina defeated France 2-1`,
  - program ID,
  - slot,
  - Merkle root.

## 2:35-3:15 - API Check

Voiceover:

The same flow is available through simple API routes. Judges can inspect fixtures and settlement output directly, which makes the demo easy to test even without interacting with the browser UI.

Screen:

- Show terminal commands:

```bash
curl -s http://127.0.0.1:3027/api/fixtures
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/settle
```

- Show receipt JSON.

## 3:15-3:55 - TxLINE Feedback and Extension Path

Voiceover:

TxLINE's strongest idea is treating sports data as verifiable infrastructure rather than only a feed. The main friction is activation complexity: network, RPC, program ID, guest JWT, subscription transaction, and API host all need to stay aligned. A hosted sandbox token or tiny end-to-end sample would help teams reach product work faster.

Next, SettleLine can swap the replay adapter for a live TxLINE SSE adapter, then connect the receipt to devnet escrow resolution.

Screen:

- Show README TxLINE references.
- Show adapter files:
  - `src/integrations/txline/replay-adapter.ts`
  - `src/integrations/txline/http-adapter.ts`

## 3:55-4:10 - Close

Voiceover:

SettleLine is intentionally compliance-safe: no real deposits, no custody, no promised payout, and no wallet requirement for judges. It focuses on the verifiable settlement layer that production prediction markets need.

Screen:

- Return to dashboard.
- Show compliance notice again.
