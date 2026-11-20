import type { CheckResult, Claim } from "../types.js";

/** Parse a human number: strips $, commas, % and spaces. Returns null if not numeric. */
export function parseNumber(raw: string): number | null {
  // Strip currency/percent/commas, and a single trailing sentence period
  // that the capture groups may have absorbed ("8,400." -> "8400").
  const cleaned = raw.replace(/[$,%\s]/g, "").replace(/,/g, "").replace(/\.$/, "");
  if (cleaned === "" || !/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

const EPS = 0.01;

function close(a: number, b: number): boolean {
  return Math.abs(a - b) <= EPS;
}

/**
 * Arithmetic validator.
 * Recomputes every explicit equation it can find in the claim:
 *  - "A + B = C", "A - B = C", "A * B = C", "A / B = C" (also x / ×)
 *  - Line totals: "N units at $P each = $T" / "N x P = T"
 *  - Percentage of: "P% of X = Y"
 * A mismatch beyond 0.01 is a hard fail with full operand evidence.
 */
export function checkArithmetic(claim: Claim): CheckResult[] {
  const results: CheckResult[] = [];
  const text = claim.text;

  const equationRe =
    /(-?[\d][\d,]*\.?\d*)\s*([+\-*/x×])\s*(-?[\d][\d,]*\.?\d*)\s*=\s*\$?(-?[\d][\d,]*\.?\d*)/g;
  let m: RegExpExecArray | null;
  while ((m = equationRe.exec(text)) !== null) {
    const a = parseNumber(m[1]);
    const b = parseNumber(m[3]);
    const stated = parseNumber(m[4]);
    const op = m[2];
    if (a === null || b === null || stated === null) continue;
    let expected: number | null = null;
    if (op === "+") expected = a + b;
    else if (op === "-") expected = a - b;
    else if (op === "*" || op === "x" || op === "×") expected = a * b;
    else if (op === "/") expected = b === 0 ? null : a / b;
    if (expected === null) continue;
    const ok = close(expected, stated);
    results.push({
      validator: "arithmetic",
      claimId: claim.id,
      status: ok ? "pass" : "fail",
      detail: ok
        ? `Equation ${a} ${op} ${b} = ${stated} recomputes correctly.`
        : `Equation ${a} ${op} ${b} stated as ${stated}, recomputed value is ${round2(expected)}.`,
      evidence: { kind: "equation", a, op, b, stated, expected: round2(expected) },
    });
  }

  // Line totals: "3 units at $2,800 = $8,400" / "3 x 2800 = 8400"
  const lineRe =
    /(\d+(?:\.\d+)?)\s*(?:units?|items?|pcs|pieces)?\s*(?:at|x|×|@)\s*\$?([\d][\d,]*\.?\d*)\s*(?:each\s*)?=\s*\$?([\d][\d,]*\.?\d*)/gi;
  while ((m = lineRe.exec(text)) !== null) {
    const qty = parseNumber(m[1]);
    const price = parseNumber(m[2]);
    const stated = parseNumber(m[3]);
    if (qty === null || price === null || stated === null) continue;
    // Avoid double-counting a plain "A x B = C" already handled above.
    if (results.some((r) => r.evidence.kind === "equation" && r.evidence.stated === stated)) continue;
    const expected = qty * price;
    const ok = close(expected, stated);
    results.push({
      validator: "arithmetic",
      claimId: claim.id,
      status: ok ? "pass" : "fail",
      detail: ok
        ? `Line total ${qty} × ${price} = ${stated} recomputes correctly.`
        : `Line total ${qty} × ${price} stated as ${stated}, recomputed value is ${round2(expected)}.`,
      evidence: { kind: "line-total", qty, price, stated, expected: round2(expected) },
    });
  }

  // Percentage of: "30% of 8,400 = 2,520"
  const pctRe = /(\d+(?:\.\d+)?)%\s*of\s*\$?([\d][\d,]*\.?\d*)\s*=\s*\$?([\d][\d,]*\.?\d*)/gi;
  while ((m = pctRe.exec(text)) !== null) {
    const pct = parseNumber(m[1]);
    const base = parseNumber(m[2]);
    const stated = parseNumber(m[3]);
    if (pct === null || base === null || stated === null) continue;
    const expected = (pct / 100) * base;
    const ok = close(expected, stated);
    results.push({
      validator: "arithmetic",
      claimId: claim.id,
      status: ok ? "pass" : "fail",
      detail: ok
        ? `${pct}% of ${base} = ${stated} recomputes correctly.`
        : `${pct}% of ${base} stated as ${stated}, recomputed value is ${round2(expected)}.`,
      evidence: { kind: "percent-of", pct, base, stated, expected: round2(expected) },
    });
  }

  if (results.length === 0) {
    results.push({
      validator: "arithmetic",
      claimId: claim.id,
      status: "skip",
      detail: "No recomputable arithmetic found in this claim.",
      evidence: {},
    });
  }
  return results;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
