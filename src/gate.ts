import type { CheckResult, ClaimVerdict, ModelOutput, Verdict } from "./types.js";

/**
 * Deterministic verdict gate.
 *
 * The gate is the only component allowed to issue a verdict, and it is
 * pure code: same inputs, same verdict, every time. Model output can
 * raise a claim to NEEDS REVIEW but can never override a hard
 * validator failure, and can never turn a failure into a pass.
 *
 * Rules, evaluated in order:
 *  R1. Any check with status "fail"            -> FAIL
 *  R2. Model label "contradicts" with
 *      confidence >= 0.7                        -> FAIL
 *      (a confident model contradiction is treated as a hard signal;
 *       below 0.7 it only forces review, see R3)
 *  R3. Any check with status "warn", OR model
 *      label "contradicts" (< 0.7), OR model
 *      label "uncertain", OR model confidence
 *      < 0.5 on a "supports" label              -> NEEDS REVIEW
 *  R4. Otherwise                                -> PASS
 */
export function gateClaim(
  claimId: string,
  checks: CheckResult[],
  modelOutput: ModelOutput | null,
): Pick<ClaimVerdict, "verdict" | "reasons"> {
  const reasons: string[] = [];

  const fails = checks.filter((c) => c.status === "fail");
  if (fails.length > 0) {
    for (const f of fails) reasons.push(`[R1] ${f.validator}: ${f.detail}`);
    return { verdict: "FAIL", reasons };
  }

  if (modelOutput && modelOutput.label === "contradicts" && modelOutput.confidence >= 0.7) {
    reasons.push(
      `[R2] Model (${modelOutput.source}, ${modelOutput.modelId}) contradicts this claim with confidence ${modelOutput.confidence}: ${modelOutput.rationale}`,
    );
    return { verdict: "FAIL", reasons };
  }

  const warns = checks.filter((c) => c.status === "warn");
  for (const w of warns) reasons.push(`[R3] ${w.validator}: ${w.detail}`);
  if (modelOutput) {
    if (modelOutput.label === "contradicts") {
      reasons.push(`[R3] Model contradicts with low confidence ${modelOutput.confidence}: ${modelOutput.rationale}`);
    } else if (modelOutput.label === "uncertain") {
      reasons.push(`[R3] Model is uncertain: ${modelOutput.rationale}`);
    } else if (modelOutput.label === "supports" && modelOutput.confidence < 0.5) {
      reasons.push(`[R3] Model supports but with low confidence ${modelOutput.confidence}.`);
    }
  }
  if (reasons.length > 0) return { verdict: "NEEDS REVIEW", reasons };

  reasons.push("[R4] All deterministic checks passed and no model objection.");
  return { verdict: "PASS", reasons };
}

/** Worst-verdict-wins rollup for a whole report. */
export function overallVerdict(verdicts: Verdict[]): Verdict {
  if (verdicts.includes("FAIL")) return "FAIL";
  if (verdicts.includes("NEEDS REVIEW")) return "NEEDS REVIEW";
  return "PASS";
}
