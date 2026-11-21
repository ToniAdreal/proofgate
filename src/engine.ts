import { splitClaims } from "./claimSplitter.js";
import { checkArithmetic } from "./validators/arithmetic.js";
import { checkDates, checkDateConsistency } from "./validators/dates.js";
import { checkUnits } from "./validators/units.js";
import { checkCitations } from "./validators/citations.js";
import { checkNumericConsistency } from "./validators/numericConsistency.js";
import { gateClaim } from "./gate.js";
import { buildProofReport } from "./report.js";
import {
  MockModelAdapter,
  decideRoutingTier,
  modelUnavailableOutput,
  type ModelAdapter,
  type RoutingTier,
} from "./modelAdapter.js";
import { isTimeoutError, withTimeout } from "./timeout.js";
import type {
  CheckResult,
  Claim,
  ClaimVerdict,
  ModelOutput,
  ModelSource,
  ProofReport,
} from "./types.js";

/**
 * Default per-claim bound on one adapter.analyze call. The production
 * Firebase adapter bounds each generateContent call itself (30 s, at
 * most two calls per claim: on-device attempt + cloud escalation), so
 * this engine-level backstop sits above that (~60 s) and only fires
 * for adapters that fail to bound themselves.
 */
export const DEFAULT_MODEL_TIMEOUT_MS = 90_000;

/**
 * Real progress notifications emitted as the pipeline actually
 * advances. The web UI drives its pipeline indicators from these
 * events (previously the indicators were advanced by a fixed timer,
 * which showed model steps as "Done" while a model call was still
 * pending — and pending forever when the call never settled).
 */
export type EngineProgressEvent =
  | { type: "split"; totalClaims: number }
  | {
      type: "checks-complete";
      totalClaims: number;
      /** Claims routed to the on-device model tier. */
      onDeviceClaims: number;
      /** Claims routed to the cloud model tier. */
      cloudClaims: number;
    }
  | { type: "model-claim-complete"; claimId: string; tier: RoutingTier }
  | { type: "model-complete"; totalClaims: number }
  | { type: "report-built" };

export interface EngineOptions {
  /** Model adapter. Defaults to the deterministic mock (demo mode). */
  adapter?: ModelAdapter;
  /** ISO timestamp for the report. Defaults to now; inject for replay/tests. */
  now?: string;
  /** When false, skip the model pass entirely (deterministic-only mode). */
  useModel?: boolean;
  /**
   * Per-claim bound (ms) on the model pass. A claim whose model pass
   * exceeds it (or whose adapter throws) is recorded with an explicit
   * "model unavailable" output and decided by the deterministic gate;
   * the run always completes. Defaults to DEFAULT_MODEL_TIMEOUT_MS.
   */
  modelTimeoutMs?: number;
  /** Progress notifications as the pipeline advances. */
  onProgress?: (event: EngineProgressEvent) => void;
}

/**
 * Run one claim's model pass with a hard bound. Any failure — timeout,
 * adapter throw — becomes a recorded model-unavailable output instead
 * of a rejected or never-settling promise, so the deterministic
 * verdict path always completes end to end.
 */
async function runModelPass(
  adapter: ModelAdapter,
  claim: Claim,
  tier: RoutingTier,
  timeoutMs: number,
): Promise<ModelOutput> {
  const source: ModelSource = tier === "cloud" ? "cloud" : "on-device";
  try {
    return await withTimeout(
      adapter.analyze(claim),
      timeoutMs,
      `Model pass for claim ${claim.id}`,
    );
  } catch (err) {
    const failure = isTimeoutError(err)
      ? `timed out after ${timeoutMs} ms`
      : `failed: ${err instanceof Error ? err.message : String(err)}`;
    return modelUnavailableOutput(claim.id, source, adapter.name, failure);
  }
}

/**
 * ProofGate engine: text in, sealed Proof Report out.
 *
 * Pipeline:
 *  1. Split input into atomic claims (deterministic).
 *  2. Run per-claim validators (arithmetic, dates, units, citations)
 *     plus whole-document validators (date ordering, numeric
 *     consistency), and decide each claim's routing tier.
 *  3. Run the model adapter for routed claims. Every call is bounded
 *     by `modelTimeoutMs`; a timed-out or failed pass is recorded as
 *     an explicit model-unavailable output, never waited on forever.
 *     In demo mode the mock adapter stands in for both tiers and says
 *     so in its output (`source: "mock"`).
 *  4. The deterministic gate issues the final per-claim verdict.
 *  5. Build and hash-seal the Proof Report.
 */
export async function runProofGate(input: string, options: EngineOptions = {}): Promise<ProofReport> {
  const adapter = options.adapter ?? new MockModelAdapter();
  const useModel = options.useModel ?? true;
  const now = options.now ?? new Date().toISOString();
  const modelTimeoutMs = options.modelTimeoutMs ?? DEFAULT_MODEL_TIMEOUT_MS;
  const onProgress = options.onProgress;

  const claims = splitClaims(input);
  onProgress?.({ type: "split", totalClaims: claims.length });

  // Whole-document checks, grouped by claim id.
  const docChecks = new Map<string, CheckResult[]>();
  for (const r of [...checkDateConsistency(claims), ...checkNumericConsistency(claims)]) {
    if (!docChecks.has(r.claimId)) docChecks.set(r.claimId, []);
    docChecks.get(r.claimId)!.push(r);
  }

  // Phase 1: deterministic checks + routing for every claim (pure, sync).
  interface Prepared {
    claim: Claim;
    checks: CheckResult[];
    tier: RoutingTier;
  }
  const prepared: Prepared[] = claims.map((claim) => {
    const checks: CheckResult[] = [
      ...checkArithmetic(claim),
      ...checkDates(claim),
      ...checkUnits(claim),
      ...checkCitations(claim),
      ...(docChecks.get(claim.id) ?? []),
    ];
    const hasWarn = checks.some((c) => c.status === "warn");
    return { claim, checks, tier: decideRoutingTier(claim, hasWarn).tier };
  });
  onProgress?.({
    type: "checks-complete",
    totalClaims: claims.length,
    onDeviceClaims: prepared.filter((p) => useModel && p.tier === "on-device").length,
    cloudClaims: prepared.filter((p) => useModel && p.tier === "cloud").length,
  });

  // Phase 2: model pass per routed claim, every call bounded.
  const verdicts: ClaimVerdict[] = [];
  for (const p of prepared) {
    const modelOutput =
      useModel && p.tier !== "deterministic-only"
        ? await runModelPass(adapter, p.claim, p.tier, modelTimeoutMs)
        : null;
    if (modelOutput) {
      onProgress?.({ type: "model-claim-complete", claimId: p.claim.id, tier: p.tier });
    }
    const { verdict, reasons } = gateClaim(p.claim.id, p.checks, modelOutput);
    verdicts.push({ claim: p.claim, checks: p.checks, modelOutput, verdict, reasons });
  }
  onProgress?.({ type: "model-complete", totalClaims: claims.length });

  const report = buildProofReport(input, verdicts, now);
  onProgress?.({ type: "report-built" });
  return report;
}
