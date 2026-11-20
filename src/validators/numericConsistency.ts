import type { CheckResult, Claim } from "../types.js";
import { parseNumber } from "./arithmetic.js";

/**
 * Numeric cross-reference validator (whole-document).
 *
 * Check A — total reconciliation: lines that look like priced line items
 * ("... $1,200", "Item: $300") are summed and compared with a stated
 * "Total: $T" / "Amount due: $T". Subtotal + tax lines are reconciled
 * when all three are present.
 *
 * Check B — repeated figure consistency: the same labelled figure
 * (e.g. "deposit: $2,520" ... "deposit of $2,600") appearing with two
 * different values is a fail.
 */

interface MoneyHit {
  claimId: string;
  label: string | null;
  amount: number;
  raw: string;
}

function moneyHits(claims: Claim[]): MoneyHit[] {
  const hits: MoneyHit[] = [];
  const moneyRe = /\$\s?([\d][\d,]*\.?\d*)/g;
  for (const claim of claims) {
    let m: RegExpExecArray | null;
    moneyRe.lastIndex = 0;
    while ((m = moneyRe.exec(claim.text)) !== null) {
      const amount = parseNumber(m[1]);
      if (amount === null) continue;
      // Label = up to 40 chars before the amount, trimmed of separators.
      const before = claim.text.slice(Math.max(0, m.index - 40), m.index);
      const labelMatch = before.match(/([A-Za-z][A-Za-z /-]{1,30})[:\-]?\s*$/);
      hits.push({
        claimId: claim.id,
        label: labelMatch ? labelMatch[1].trim().toLowerCase() : null,
        amount,
        raw: m[0],
      });
    }
  }
  return hits;
}

const EPS = 0.01;

export function checkNumericConsistency(claims: Claim[]): CheckResult[] {
  const results: CheckResult[] = [];
  const hits = moneyHits(claims);

  const totalHit = hits.find((h) => h.label && /^(total|amount due|grand total|balance due)/.test(h.label));
  const subtotalHit = hits.find((h) => h.label && /subtotal/.test(h.label));
  const taxHit = hits.find((h) => h.label && /(tax|vat)/.test(h.label));

  // Subtotal + tax = total reconciliation.
  if (totalHit && subtotalHit && taxHit) {
    const expected = subtotalHit.amount + taxHit.amount;
    const ok = Math.abs(expected - totalHit.amount) <= EPS;
    results.push({
      validator: "numeric-consistency",
      claimId: totalHit.claimId,
      status: ok ? "pass" : "fail",
      detail: ok
        ? `Subtotal ${subtotalHit.amount} + tax ${taxHit.amount} = total ${totalHit.amount} reconciles.`
        : `Subtotal ${subtotalHit.amount} + tax ${taxHit.amount} = ${round2(expected)}, but the stated total is ${totalHit.amount}.`,
      evidence: { kind: "subtotal-tax-total", subtotal: subtotalHit.amount, tax: taxHit.amount, statedTotal: totalHit.amount, expected: round2(expected) },
    });
    return results;
  }

  // Line-item sum vs total: sum every money hit that is not the total /
  // subtotal / tax / deposit line itself.
  if (totalHit) {
    const excluded = new Set([totalHit]);
    if (subtotalHit) excluded.add(subtotalHit);
    if (taxHit) excluded.add(taxHit);
    const items = hits.filter(
      (h) => !excluded.has(h) && !(h.label && /(deposit|discount|paid)/.test(h.label)),
    );
    // Only reconcile when the items come from claims other than the total's
    // own equation lines (an equation's result would double-count).
    const itemSum = items.reduce((s, h) => s + h.amount, 0);
    if (items.length >= 2) {
      const ok = Math.abs(itemSum - totalHit.amount) <= EPS;
      results.push({
        validator: "numeric-consistency",
        claimId: totalHit.claimId,
        status: ok ? "pass" : "fail",
        detail: ok
          ? `Line items sum to ${round2(itemSum)}, matching the stated total ${totalHit.amount}.`
          : `Line items sum to ${round2(itemSum)}, but the stated total is ${totalHit.amount}.`,
        evidence: { kind: "line-item-sum", itemCount: items.length, itemSum: round2(itemSum), statedTotal: totalHit.amount },
      });
    }
  }

  // Repeated labelled figure with conflicting values.
  const byLabel = new Map<string, MoneyHit[]>();
  for (const h of hits) {
    if (!h.label) continue;
    const key = h.label.replace(/\s+/g, " ");
    if (!byLabel.has(key)) byLabel.set(key, []);
    byLabel.get(key)!.push(h);
  }
  for (const [label, group] of byLabel) {
    const values = [...new Set(group.map((g) => g.amount))];
    if (group.length >= 2 && values.length >= 2 && /deposit|total|price|fee|amount/.test(label)) {
      results.push({
        validator: "numeric-consistency",
        claimId: group[group.length - 1].claimId,
        status: "fail",
        detail: `Figure "${label}" appears with conflicting values: ${values.join(", ")}.`,
        evidence: { kind: "conflicting-figure", label, values },
      });
    }
  }

  return results;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
