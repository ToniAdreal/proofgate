/**
 * ProofGate core types.
 * All types are plain data so a Proof Report can be serialized,
 * hashed, stored in Firestore, and replayed byte-for-byte.
 */

export type Verdict = "PASS" | "NEEDS REVIEW" | "FAIL";

export type CheckStatus = "pass" | "fail" | "warn" | "skip";

export interface Claim {
  /** Stable id within a report, e.g. "c1", "c2". */
  id: string;
  /** 0-based position in the split order. */
  index: number;
  /** The atomic claim text (trimmed, single line). */
  text: string;
  /** Character offsets into the original input: [start, end). */
  span: [number, number];
}

export interface CheckResult {
  /** Validator name, e.g. "arithmetic". */
  validator: string;
  claimId: string;
  status: CheckStatus;
  /** Human-readable explanation of what was checked and found. */
  detail: string;
  /** Machine-readable evidence for the check (operands, expected, actual). */
  evidence: Record<string, unknown>;
}

export type ModelSource = "on-device" | "cloud" | "mock";

export interface ModelOutput {
  claimId: string;
  /** Model's own assessment of the claim. */
  label: "supports" | "contradicts" | "uncertain" | "not-applicable";
  /** 0..1 self-reported confidence. The gate never trusts this alone. */
  confidence: number;
  rationale: string;
  source: ModelSource;
  modelId: string;
  /**
   * Set only when the model pass did not complete (timeout or error):
   * no model judgement was obtained. The label/confidence of such an
   * output are the recorded-as-uncertain convention, never a real
   * model answer, and the rationale says so explicitly.
   */
  failure?: string;
}

export interface ClaimVerdict {
  claim: Claim;
  checks: CheckResult[];
  modelOutput: ModelOutput | null;
  verdict: Verdict;
  /** Gate reasons, in rule order, explaining the verdict. */
  reasons: string[];
}

export interface ReportSummary {
  totalClaims: number;
  pass: number;
  needsReview: number;
  fail: number;
  overallVerdict: Verdict;
}

export interface ProofReport {
  version: "proofgate.report/1";
  /** Report id: "pr_" + first 16 hex chars of the input hash. */
  id: string;
  /** ISO-8601 timestamp supplied by the caller (injectable for tests). */
  createdAt: string;
  /** Original pasted text, stored verbatim for replay. */
  inputText: string;
  /** SHA-256 hex of inputText (UTF-8). */
  inputHash: string;
  claims: ClaimVerdict[];
  summary: ReportSummary;
  /** Engine + validator versions that produced this report. */
  engine: { name: string; version: string };
  /**
   * SHA-256 hex over the canonical JSON of this report with
   * `contentHash` itself excluded. Anyone can recompute it to
   * prove the report was not altered after issuance.
   */
  contentHash: string;
}
