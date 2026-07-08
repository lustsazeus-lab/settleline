# Solana Devnet Receipt Attestation

SettleLine now exposes a judge-safe devnet attestation draft for each deterministic proof receipt.

## Purpose

The core settlement flow already creates a deterministic receipt hash:

```text
sha256:<64 hex chars>
```

The attestation layer turns that hash into a bounded Solana memo payload that can be submitted to devnet with a throwaway devnet keypair. This gives judges a concrete bridge from replay settlement evidence to Solana devnet anchoring without using the user's wallet, mainnet funds, custody, or real-money wagering.

## Review Endpoint

```bash
curl -s -X POST http://127.0.0.1:3027/api/markets/market-wc-001-winner/attest
```

Expected shape:

```json
{
  "mode": "replay",
  "attestation": {
    "mode": "dry-run",
    "network": "solana-devnet",
    "cluster": "devnet",
    "instruction": "memo-attest-receipt-hash",
    "memo": "SettleLine|receipt=sha256:...|market=...|event=...|slot=...",
    "transactionSignature": null,
    "transactionExplorerUrl": null,
    "safeguards": ["devnet-only", "no-user-wallet", "no-custody", "no-real-money-wagering"]
  }
}
```

## Safety Boundary

- Devnet only.
- No user wallet.
- No private key in the repository.
- No mainnet transaction.
- No deposit, bridge, gas purchase, or paid RPC.
- No custody or production wagering claim.

If a real devnet memo transaction is produced later, only the public transaction signature and Solana Explorer URL should be committed or submitted. The throwaway devnet keypair must stay local and ignored.

