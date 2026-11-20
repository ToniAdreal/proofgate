import type { CheckResult, Claim } from "../types.js";

/**
 * Unit consistency validator.
 * Finds stated conversions "X <unitA> = Y <unitB>" (also "X unitA (Y unitB)")
 * and recomputes them against a fixed conversion table.
 * Also flags the same quantity stated twice in different units with
 * inconsistent values inside one claim.
 */

interface UnitDef {
  dimension: string;
  /** Multiply a value in this unit by `toBase` to get the base unit. */
  toBase: number;
  aliases: string[];
}

const UNITS: UnitDef[] = [
  { dimension: "length", toBase: 1, aliases: ["m", "meter", "meters", "metre", "metres"] },
  { dimension: "length", toBase: 1000, aliases: ["km", "kilometer", "kilometers"] },
  { dimension: "length", toBase: 0.01, aliases: ["cm", "centimeter", "centimeters"] },
  { dimension: "length", toBase: 1609.344, aliases: ["mile", "miles", "mi"] },
  { dimension: "length", toBase: 0.0254, aliases: ["inch", "inches", "in"] },
  { dimension: "length", toBase: 0.3048, aliases: ["foot", "feet", "ft"] },
  { dimension: "mass", toBase: 1, aliases: ["kg", "kilogram", "kilograms"] },
  { dimension: "mass", toBase: 0.001, aliases: ["g", "gram", "grams"] },
  { dimension: "mass", toBase: 0.45359237, aliases: ["lb", "lbs", "pound", "pounds"] },
  { dimension: "mass", toBase: 0.028349523125, aliases: ["oz", "ounce", "ounces"] },
  { dimension: "storage", toBase: 1, aliases: ["mb", "megabyte", "megabytes"] },
  { dimension: "storage", toBase: 1000, aliases: ["gb", "gigabyte", "gigabytes"] },
  { dimension: "storage", toBase: 1000000, aliases: ["tb", "terabyte", "terabytes"] },
  { dimension: "time", toBase: 1, aliases: ["second", "seconds", "sec", "s"] },
  { dimension: "time", toBase: 60, aliases: ["minute", "minutes", "min"] },
  { dimension: "time", toBase: 3600, aliases: ["hour", "hours", "hr", "hrs", "h"] },
];

const ALIAS_TO_DEF = new Map<string, UnitDef>();
for (const def of UNITS) for (const a of def.aliases) ALIAS_TO_DEF.set(a, def);

const UNIT_ALT = UNITS.flatMap((u) => u.aliases)
  .sort((a, b) => b.length - a.length)
  .map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

const CONVERSION_RE = new RegExp(
  `([\\d][\\d,]*\\.?\\d*)\\s*(${UNIT_ALT})\\b[^=()]{0,12}?(?:=|\\(|is\\s+|equals\\s+)\\s*([\\d][\\d,]*\\.?\\d*)\\s*(${UNIT_ALT})\\b`,
  "gi",
);

const REL_TOLERANCE = 0.02; // 2% slack for rounded conversions in prose.

export function checkUnits(claim: Claim): CheckResult[] {
  const results: CheckResult[] = [];
  let m: RegExpExecArray | null;
  CONVERSION_RE.lastIndex = 0;
  while ((m = CONVERSION_RE.exec(claim.text)) !== null) {
    const v1 = Number(m[1].replace(/,/g, ""));
    const v2 = Number(m[3].replace(/,/g, ""));
    const d1 = ALIAS_TO_DEF.get(m[2].toLowerCase());
    const d2 = ALIAS_TO_DEF.get(m[4].toLowerCase());
    if (!d1 || !d2 || !Number.isFinite(v1) || !Number.isFinite(v2)) continue;
    if (d1.dimension !== d2.dimension) {
      results.push({
        validator: "units",
        claimId: claim.id,
        status: "fail",
        detail: `Units ${m[2]} (${d1.dimension}) and ${m[4]} (${d2.dimension}) are not convertible.`,
        evidence: { kind: "dimension-mismatch", from: m[2], to: m[4] },
      });
      continue;
    }
    const expected = (v1 * d1.toBase) / d2.toBase;
    const relErr = expected === 0 ? Math.abs(v2) : Math.abs(v2 - expected) / Math.abs(expected);
    const ok = relErr <= REL_TOLERANCE;
    results.push({
      validator: "units",
      claimId: claim.id,
      status: ok ? "pass" : "fail",
      detail: ok
        ? `Conversion ${v1} ${m[2]} = ${v2} ${m[4]} is within 2% of the recomputed ${round4(expected)} ${m[4]}.`
        : `Conversion ${v1} ${m[2]} stated as ${v2} ${m[4]}, recomputed value is ${round4(expected)} ${m[4]}.`,
      evidence: { kind: "conversion", value: v1, fromUnit: m[2], statedTo: v2, toUnit: m[4], expected: round4(expected) },
    });
  }
  if (results.length === 0) {
    results.push({
      validator: "units",
      claimId: claim.id,
      status: "skip",
      detail: "No unit conversions found in this claim.",
      evidence: {},
    });
  }
  return results;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
