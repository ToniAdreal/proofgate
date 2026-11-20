import { splitClaims } from "./claimSplitter.js";
import { checkArithmetic } from "./validators/arithmetic.js";
import { checkDates, checkDateConsistency } from "./validators/dates.js";
import { checkUnits } from "./validators/units.js";
import { checkCitations } from "./validators/citations.js";
import { checkNumericConsistency } from "./validators/numericConsistency.js";
import { gateClaim } from "./gate.js";
import { buildProofReport } from "./report.js";
import { MockModelAdapter, decideRoutingTier, type ModelAdapter } from "./modelAdapter.js";
import type { CheckResult, ClaimVerdict, ProofReport } from "./types.js";

export interface EngineOptions {
  /** Model adapter. Defaults to the deterministic mock (demo mode). */
  adapter?: ModelAdapter;
  /** ISO timestamp for the report. Defaults to now; inject for replay/tests. */
  now?: string;
  /** When false, skip the model pass entirely (deterministic-only mode). */
  useModel?: boolean;
}

/**
 * ProofGate engine: text in, sealed Proof Report out.
 *
 * Pipeline:
 *  1. Split input into atomic claims (deterministic).
 *  2. Run per-claim validators (arithmetic, dates, units, citations).
 *  3. Run whole-document validators (date ordering, numeric consistency)
 *     and attach their findings to the relevant claims.
 *  4. Route each claim (deterministic-only / on-device / cloud) and run
 *     the model adapter where routed. In demo mode the mock adapter
 *     stands in for both tiers and says so in its output (`source: "mock"`).
 *  5. The deterministic gate issues the final per-claim verdict.
 *  6. Build and hash-seal the Proof Report.
 */
export async function runProofGate(input: string, options: EngineOptions = {}): Promise<ProofReport> {
  const adapter = options.adapter ?? new MockModelAdapter();
  const useModel = options.useModel ?? true;
  const now = options.now ?? new Date().toISOString();

  const claims = splitClaims(input);

  // Whole-document checks, grouped by claim id.
  const docChecks = new Map<string, CheckResult[]>();
  for (const r of [...checkDateConsistency(claims), ...checkNumericConsistency(claims)]) {
    if (!docChecks.has(r.claimId)) docChecks.set(r.claimId, []);
    docChecks.get(r.claimId)!.push(r);
  }

  const verdicts: ClaimVerdict[] = [];
  for (const claim of claims) {
    const checks: CheckResult[] = [
      ...checkArithmetic(claim),
      ...checkDates(claim),
      ...checkUnits(claim),
      ...checkCitations(claim),
      ...(docChecks.get(claim.id) ?? []),
    ];

    const hasWarn = checks.some((c) => c.status === "warn");
    const routing = decideRoutingTier(claim, hasWarn);
    const modelOutput =
      useModel && routing.tier !== "deterministic-only" ? await adapter.analyze(claim) : null;

    const { verdict, reasons } = gateClaim(claim.id, checks, modelOutput);
    verdicts.push({ claim, checks, modelOutput, verdict, reasons });
  }

  return buildProofReport(input, verdicts, now);
}
