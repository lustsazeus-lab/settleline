import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProofReceipt } from "../src/components/ProofReceipt";
import type { ProofReceipt as ProofReceiptType } from "../src/domain/types";

describe("ProofReceipt", () => {
  it("renders the receipt hash", () => {
    const receipt: ProofReceiptType = {
      receiptId: "receipt-market-1-event-1-392100001",
      receiptHash: "sha256:dd0f9eb1a194abbbc7a6d54b985125031168ea7ae50d78a90f1f7a58ae87da59",
      marketId: "market-1",
      fixtureId: "fixture-1",
      outcome: {
        marketId: "market-1",
        winningSelection: "ARG",
        reason: "Argentina defeated France 2-1.",
        settledAt: "2026-07-12T19:00:00.000Z",
      },
      eventId: "event-1",
      proof: {
        merkleRoot: "0xabc",
        signature: "0xsig",
        slot: 392100001,
        programId: "6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J",
      },
    };

    const html = renderToStaticMarkup(<ProofReceipt receipt={receipt} />);

    expect(html).toContain("Receipt hash");
    expect(html).toContain("sha256:dd0f9eb1a194abbbc7a6d54b985125031168ea7ae50d78a90f1f7a58ae87da59");
  });
});
