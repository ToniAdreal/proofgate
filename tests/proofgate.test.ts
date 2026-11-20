import { describe, it, expect } from "vitest";
import {
  splitClaims,
  checkArithmetic,
  checkDates,
  checkDateConsistency,
  checkUnits,
  checkCitations,
  checkNumericConsistency,
  gateClaim,
  buildProofReport,
  verifyProofReport,
  sha256Hex,
  decideRoutingTier,
  MockModelAdapter,
  runProofGate,
  type Claim,
  type CheckResult,
} from "../src/index.js";

function claim(text: string, id = "c1"): Claim {
  return { id, index: 0, text, span: [0, text.length] };
}

function statuses(results: CheckResult[]): string[] {
  return results.map((r) => r.status);
}

/* ---------------- claim splitter ---------------- */

describe("splitClaims", () => {
  it("splits lines into separate claims", () => {
    const claims = splitClaims("First line here.\nSecond line here.");
    expect(claims.length).toBe(2);
    expect(claims[0].id).toBe("c1");
    expect(claims[1].id).toBe("c2");
  });

  it("splits sentences on one line but not decimal points", () => {
    const claims = splitClaims("The total is $8,400.50 due today. Payment is due tomorrow.");
    expect(claims.length).toBe(2);
    expect(claims[0].text).toContain("8,400.50");
  });

  it("drops empty lines and keeps spans inside the input", () => {
    const input = "Alpha claim.\n\n\nBeta claim.";
    const claims = splitClaims(input);
    expect(claims.length).toBe(2);
    for (const c of claims) {
      expect(input.slice(c.span[0], c.span[1])).toBe(c.text);
    }
  });
});

/* ---------------- arithmetic ---------------- */

describe("checkArithmetic", () => {
  it("passes a correct equation", () => {
    const r = checkArithmetic(claim("The fee is 1,200 + 300 = 1,500 in total."));
    expect(statuses(r)).toContain("pass");
    expect(statuses(r)).not.toContain("fail");
  });

  it("fails a wrong equation with recomputed evidence", () => {
    const r = checkArithmetic(claim("The fee is 1,200 + 300 = 1,600 in total."));
    const fail = r.find((x) => x.status === "fail");
    expect(fail).toBeDefined();
    expect(fail!.evidence.expected).toBe(1500);
    expect(fail!.evidence.stated).toBe(1600);
  });

  it("passes a correct line total", () => {
    const r = checkArithmetic(claim("Design services: 3 units at $2,800 = $8,400."));
    expect(statuses(r)).toContain("pass");
    expect(statuses(r)).not.toContain("fail");
  });

  it("fails a wrong line total", () => {
    const r = checkArithmetic(claim("Design services: 3 units at $2,800 = $9,400."));
    const fail = r.find((x) => x.status === "fail");
    expect(fail).toBeDefined();
    expect(fail!.evidence.expected).toBe(8400);
  });

  it("checks percent-of statements", () => {
    expect(statuses(checkArithmetic(claim("The deposit is 30% of 8,400 = 2,520.")))).toContain("pass");
    expect(statuses(checkArithmetic(claim("The deposit is 30% of 8,400 = 2,600.")))).toContain("fail");
  });

  it("skips claims with no arithmetic", () => {
    const r = checkArithmetic(claim("The team is happy with the result."));
    expect(statuses(r)).toEqual(["skip"]);
  });
});

/* ---------------- dates ---------------- */

describe("checkDates", () => {
  it("passes a real ISO date", () => {
    const r = checkDates(claim("The invoice date is 2026-11-10."));
    expect(statuses(r)).toContain("pass");
  });

  it("fails an impossible calendar date (Feb 30)", () => {
    const r = checkDates(claim("The event is on 2026-02-30."));
    expect(statuses(r)).toContain("fail");
  });

  it("fails a weekday that does not match the date", () => {
    // 2026-01-01 is a Thursday (verified against the system calendar).
    const r = checkDates(claim("The launch is on Wednesday, January 1, 2026."));
    expect(statuses(r)).toContain("fail");
  });

  it("passes a weekday that matches the date", () => {
    const r = checkDates(claim("The launch is on Thursday, January 1, 2026."));
    expect(statuses(r)).toContain("pass");
    expect(statuses(r)).not.toContain("fail");
  });

  it("skips claims with no dates", () => {
    expect(statuses(checkDates(claim("No dates here.")))).toEqual(["skip"]);
  });
});

describe("checkDateConsistency", () => {
  it("fails when the due date precedes the issue date", () => {
    const claims = splitClaims("Invoice date: 2026-12-10.\nPayment due date: 2026-11-01.");
    const r = checkDateConsistency(claims);
    expect(r.some((x) => x.status === "fail")).toBe(true);
  });

  it("passes when the due date follows the issue date", () => {
    const claims = splitClaims("Invoice date: 2026-11-10.\nPayment due date: 2026-12-10.");
    const r = checkDateConsistency(claims);
    expect(r.some((x) => x.status === "pass")).toBe(true);
  });
});

/* ---------------- units ---------------- */

describe("checkUnits", () => {
  it("passes a correct conversion within tolerance", () => {
    const r = checkUnits(claim("The drive is 10 km = 6.21 miles."));
    expect(statuses(r)).toContain("pass");
    expect(statuses(r)).not.toContain("fail");
  });

  it("fails a wrong conversion", () => {
    const r = checkUnits(claim("The drive is 10 km = 20 miles."));
    expect(statuses(r)).toContain("fail");
  });

  it("passes kg to g and fails a bad one", () => {
    expect(statuses(checkUnits(claim("The weight is 2 kg = 2000 g.")))).toContain("pass");
    expect(statuses(checkUnits(claim("The weight is 2 kg = 500 g.")))).toContain("fail");
  });

  it("skips claims with no conversions", () => {
    expect(statuses(checkUnits(claim("Nothing measurable here.")))).toEqual(["skip"]);
  });
});

/* ---------------- citations ---------------- */

describe("checkCitations", () => {
  it("passes a well-formed URL", () => {
    const r = checkCitations(claim("See https://example.com/report for the full data."));
    expect(statuses(r)).toContain("pass");
    expect(statuses(r)).not.toContain("fail");
  });

  it("fails a malformed URL (hostname without a dot)", () => {
    const r = checkCitations(claim("See https://example for the full data."));
    expect(statuses(r)).toContain("fail");
  });

  it("warns when a source is invoked but no citation is given", () => {
    const r = checkCitations(claim("According to a recent study, sales grew by 40% last year."));
    expect(statuses(r)).toContain("warn");
  });

  it("does not warn when the attributed claim carries a URL", () => {
    const r = checkCitations(claim("According to the report at https://example.com/report, sales grew."));
    expect(statuses(r)).not.toContain("warn");
  });

  it("skips plain claims", () => {
    expect(statuses(checkCitations(claim("The meeting went well.")))).toEqual(["skip"]);
  });
});

/* ---------------- numeric consistency ---------------- */

describe("checkNumericConsistency", () => {
  it("passes subtotal + tax = total", () => {
    const claims = splitClaims("Subtotal: $1,000.\nTax: $100.\nTotal: $1,100.");
    const r = checkNumericConsistency(claims);
    expect(r.some((x) => x.status === "pass" && x.evidence.kind === "subtotal-tax-total")).toBe(true);
  });

  it("fails subtotal + tax != total", () => {
    const claims = splitClaims("Subtotal: $1,000.\nTax: $100.\nTotal: $1,200.");
    const r = checkNumericConsistency(claims);
    expect(r.some((x) => x.status === "fail")).toBe(true);
  });

  it("passes a line-item sum that matches the total", () => {
    const claims = splitClaims("Item A: $300.\nItem B: $200.\nTotal: $500.");
    const r = checkNumericConsistency(claims);
    expect(r.some((x) => x.status === "pass" && x.evidence.kind === "line-item-sum")).toBe(true);
  });

  it("fails a line-item sum that misses the total", () => {
    const claims = splitClaims("Item A: $300.\nItem B: $200.\nTotal: $600.");
    const r = checkNumericConsistency(claims);
    expect(r.some((x) => x.status === "fail")).toBe(true);
  });

  it("fails a labelled figure stated with two different values", () => {
    const claims = splitClaims("Deposit: $2,520.\nDeposit: $2,600.");
    const r = checkNumericConsistency(claims);
    expect(r.some((x) => x.status === "fail" && x.evidence.kind === "conflicting-figure")).toBe(true);
  });
});

/* ---------------- gate ---------------- */

describe("gateClaim", () => {
  const passCheck: CheckResult = { validator: "arithmetic", claimId: "c1", status: "pass", detail: "ok", evidence: {} };
  const failCheck: CheckResult = { validator: "arithmetic", claimId: "c1", status: "fail", detail: "bad math", evidence: {} };
  const warnCheck: CheckResult = { validator: "citations", claimId: "c1", status: "warn", detail: "missing citation", evidence: {} };

  it("PASS when all checks pass and the model supports", async () => {
    const model = await new MockModelAdapter().analyze(claim("A normal length claim about project delivery timelines and scope."));
    const { verdict } = gateClaim("c1", [passCheck], model);
    expect(verdict).toBe("PASS");
  });

  it("FAIL on any hard validator failure, even if the model supports", async () => {
    const model = await new MockModelAdapter().analyze(claim("A normal length claim about project delivery timelines and scope."));
    const { verdict, reasons } = gateClaim("c1", [failCheck], model);
    expect(verdict).toBe("FAIL");
    expect(reasons[0]).toContain("[R1]");
  });

  it("NEEDS REVIEW on a warning", () => {
    const { verdict } = gateClaim("c1", [passCheck, warnCheck], null);
    expect(verdict).toBe("NEEDS REVIEW");
  });

  it("FAIL when the model contradicts with high confidence", () => {
    const { verdict } = gateClaim("c1", [passCheck], {
      claimId: "c1", label: "contradicts", confidence: 0.9,
      rationale: "Source data disagrees.", source: "cloud", modelId: "test-model",
    });
    expect(verdict).toBe("FAIL");
  });

  it("only NEEDS REVIEW when the model contradicts with low confidence", () => {
    const { verdict } = gateClaim("c1", [passCheck], {
      claimId: "c1", label: "contradicts", confidence: 0.4,
      rationale: "Weak disagreement signal.", source: "on-device", modelId: "test-model",
    });
    expect(verdict).toBe("NEEDS REVIEW");
  });
});

/* ---------------- routing ---------------- */

describe("decideRoutingTier", () => {
  it("routes short plain claims to deterministic-only", () => {
    expect(decideRoutingTier(claim("Thanks a lot."), false).tier).toBe("deterministic-only");
  });

  it("escalates guarantee wording to cloud", () => {
    expect(decideRoutingTier(claim("This product is guaranteed to always work in every situation."), false).tier).toBe("cloud");
  });

  it("escalates warned claims to cloud", () => {
    expect(decideRoutingTier(claim("A standard length claim about the quarterly delivery plan."), true).tier).toBe("cloud");
  });

  it("keeps standard claims on-device", () => {
    expect(decideRoutingTier(claim("A standard length claim about the quarterly delivery plan."), false).tier).toBe("on-device");
  });
});

/* ---------------- proof report ---------------- */

describe("Proof Report", () => {
  it("seals and verifies; tampering breaks verification", async () => {
    const report = await runProofGate("The fee is 100 + 50 = 150.", { now: "2026-11-20T00:00:00.000Z" });
    expect(verifyProofReport(report)).toBe(true);
    const tampered = { ...report, inputText: report.inputText + " " };
    expect(verifyProofReport(tampered)).toBe(false);
  });

  it("is deterministic for the same input and timestamp", async () => {
    const a = await runProofGate("The fee is 100 + 50 = 150.", { now: "2026-11-20T00:00:00.000Z" });
    const b = await runProofGate("The fee is 100 + 50 = 150.", { now: "2026-11-20T00:00:00.000Z" });
    expect(a.contentHash).toBe(b.contentHash);
    expect(a.contentHash).toMatch(/^[0-9a-f]{64}$/);
    expect(a.inputHash).toBe(sha256Hex(a.inputText));
  });

  it("buildProofReport produces a complete summary", () => {
    const report = buildProofReport("x", [], "2026-11-20T00:00:00.000Z");
    expect(report.summary.totalClaims).toBe(0);
    expect(report.version).toBe("proofgate.report/1");
    expect(verifyProofReport(report)).toBe(true);
  });
});

/* ---------------- end to end ---------------- */

describe("end-to-end: invoice with one arithmetic error", () => {
  const invoice = [
    "Invoice Q-1042 from Acme Studio.",
    "Invoice date: 2026-11-10.",
    "Payment due date: 2026-12-10.",
    "Design services: 3 units at $2,800 = $9,400.",
    "The project lead is Maya Chen.",
  ].join("\n");

  it("FAILs the claim with the arithmetic error", async () => {
    const report = await runProofGate(invoice, { now: "2026-11-20T00:00:00.000Z" });
    const bad = report.claims.find((c) => c.claim.text.includes("Design services"));
    expect(bad).toBeDefined();
    expect(bad!.verdict).toBe("FAIL");
    const arithFail = bad!.checks.find((c) => c.validator === "arithmetic" && c.status === "fail");
    expect(arithFail).toBeDefined();
    expect(arithFail!.evidence.expected).toBe(8400);
    expect(arithFail!.evidence.stated).toBe(9400);
  });

  it("produces a complete, verifiable Proof Report with overall FAIL", async () => {
    const report = await runProofGate(invoice, { now: "2026-11-20T00:00:00.000Z" });
    expect(report.summary.overallVerdict).toBe("FAIL");
    expect(report.summary.fail).toBeGreaterThanOrEqual(1);
    expect(report.summary.totalClaims).toBe(report.claims.length);
    expect(report.inputText).toBe(invoice);
    expect(report.inputHash).toBe(sha256Hex(invoice));
    expect(verifyProofReport(report)).toBe(true);
    // Every claim carries checks, a verdict, and gate reasons.
    for (const cv of report.claims) {
      expect(cv.checks.length).toBeGreaterThan(0);
      expect(cv.reasons.length).toBeGreaterThan(0);
      expect(["PASS", "NEEDS REVIEW", "FAIL"]).toContain(cv.verdict);
    }
    // The clean date claims pass their date checks.
    const due = report.claims.find((c) => c.claim.text.includes("due date"));
    expect(due!.checks.some((c) => c.validator === "dates" && c.status === "pass")).toBe(true);
  });

  it("passes a clean invoice end to end", async () => {
    const clean = [
      "Invoice Q-1043 from Acme Studio.",
      "Invoice date: 2026-11-10.",
      "Payment due date: 2026-12-10.",
      "Design services: 3 units at $2,800 = $8,400.",
    ].join("\n");
    const report = await runProofGate(clean, { now: "2026-11-20T00:00:00.000Z" });
    const design = report.claims.find((c) => c.claim.text.includes("Design services"));
    expect(design!.verdict).toBe("PASS");
    expect(report.summary.overallVerdict).toBe("PASS");
  });
});
