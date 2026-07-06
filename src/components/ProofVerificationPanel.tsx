import type { ProofVerification } from "@/domain/proofs";

export function ProofVerificationPanel({ verification }: { verification: ProofVerification }) {
  return (
    <section className="verification">
      <div className="verification-header">
        <h2>Verification Checks</h2>
        <span className={verification.valid ? "verification-badge valid" : "verification-badge invalid"}>
          {verification.valid ? "Receipt verified" : "Receipt failed"}
        </span>
      </div>
      <ul>
        {verification.checks.map((check) => (
          <li key={check.label}>
            <span>{check.label}</span>
            <strong>{check.passed ? "Pass" : "Fail"}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
