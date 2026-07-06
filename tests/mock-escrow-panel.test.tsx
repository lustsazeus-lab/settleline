import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MockEscrowPanel } from "../src/components/MockEscrowPanel";
import type { MockEscrowSettlement } from "../src/domain/types";

describe("MockEscrowPanel", () => {
  it("renders the mock escrow release without implying real-money custody", () => {
    const mockEscrow: MockEscrowSettlement = {
      escrowId: "mock-escrow-market-wc-001-winner-txline-replay-event-001",
      marketId: "market-wc-001-winner",
      receiptHash: "sha256:fefd6fe3b135e57fca6106a779dba7bc69840324e79d9a4226cf22ee286f5072",
      status: "settled",
      network: "solana-devnet-mock",
      asset: "demo-usdt-accounting-units",
      instruction: "release-to-winning-selection",
      winningSelection: "ARG",
      payouts: [{ selection: "ARG", destination: "demo-vault-arg-winners", amount: "100.00" }],
      safeguards: ["replay-only", "no-custody", "no-real-money-wagering"],
    };

    const html = renderToStaticMarkup(<MockEscrowPanel settlement={mockEscrow} />);

    expect(html).toContain("Mock Escrow Settlement");
    expect(html).toContain("release-to-winning-selection");
    expect(html).toContain("demo-vault-arg-winners");
    expect(html).toContain("no-real-money-wagering");
  });
});
