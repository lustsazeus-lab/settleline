import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProofVerificationPanel } from "../src/components/ProofVerificationPanel";

describe("ProofVerificationPanel", () => {
  it("renders verification status and check labels", () => {
    const html = renderToStaticMarkup(
      <ProofVerificationPanel
        verification={{
          valid: true,
          checks: [
            { label: "Receipt id", passed: true },
            { label: "Market binding", passed: true },
          ],
        }}
      />,
    );

    expect(html).toContain("Verification Checks");
    expect(html).toContain("Receipt verified");
    expect(html).toContain("Receipt id");
    expect(html).toContain("Market binding");
  });
});
