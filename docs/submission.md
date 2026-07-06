# Superteam Submission Notes

## Project Title

SettleLine

## Brief Explanation

SettleLine is a verifiable World Cup prediction settlement dashboard built on top of TxLINE-shaped data. It shows how match updates can drive deterministic market resolution, produce a transparent proof receipt with a deterministic SHA-256 hash, verify that receipt against market/event/proof metadata, and demonstrate devnet/mock escrow settlement without requiring real-money wagering.

## TxLINE API Experience

TxLINE's strongest point is that it treats sports data as more than a JSON feed: the stream model and Solana-anchored validation primitives make it possible to build a visible proof trail from match update to settlement decision.

The main friction is activation complexity. A builder must keep the network, Solana RPC, program ID, guest JWT, subscription transaction, and API host aligned. A small end-to-end sample app or hosted sandbox token would reduce setup mistakes.
