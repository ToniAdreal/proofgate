import type { ClaimVerdict, ProofReport, ReportSummary } from "./types.js";
import { overallVerdict } from "./gate.js";
import { sha256Hex } from "./sha256.js";

export const ENGINE_VERSION = "0.1.0";

// SHA-256 comes from the pure TypeScript implementation in sha256.ts
// (byte-identical to node:crypto) so reports seal identically in the
// browser, where node:crypto does not exist.
export { sha256Hex };

/**
 * Canonical JSON: object keys sorted recursively, arrays kept in order,
 * no whitespace. Two runs over the same logical report always produce
 * the same string, so the content hash is stable and replayable.
 */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`);
  return `{${entries.join(",")}}`;
}

export function summarize(claims: ClaimVerdict[]): ReportSummary {
  return {
    totalClaims: claims.length,
    pass: claims.filter((c) => c.verdict === "PASS").length,
    needsReview: claims.filter((c) => c.verdict === "NEEDS REVIEW").length,
    fail: claims.filter((c) => c.verdict === "FAIL").length,
    overallVerdict: overallVerdict(claims.map((c) => c.verdict)),
  };
}

/**
 * Build a Proof Report and seal it with a content hash.
 * `createdAt` is injected so tests (and replays) are deterministic.
 */
export function buildProofReport(
  inputText: string,
  claims: ClaimVerdict[],
  createdAt: string,
): ProofReport {
  const inputHash = sha256Hex(inputText);
  const unsealed: Omit<ProofReport, "contentHash"> = {
    version: "proofgate.report/1",
    id: `pr_${inputHash.slice(0, 16)}`,
    createdAt,
    inputText,
    inputHash,
    claims,
    summary: summarize(claims),
    engine: { name: "proofgate-core", version: ENGINE_VERSION },
  };
  const contentHash = sha256Hex(canonicalJson(unsealed));
  return { ...unsealed, contentHash };
}

/** Recompute the content hash of a report and compare. */
export function verifyProofReport(report: ProofReport): boolean {
  const { contentHash, ...rest } = report;
  return sha256Hex(canonicalJson(rest)) === contentHash;
}
