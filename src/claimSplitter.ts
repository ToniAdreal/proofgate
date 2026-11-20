import type { Claim } from "./types.js";

/**
 * Deterministic claim splitter.
 *
 * Strategy (no model, fully reproducible):
 *  1. Split the input into lines; each non-empty line is a segment.
 *  2. Split each line further on sentence terminators (. ! ? ;) that are
 *     followed by whitespace + an uppercase letter / digit, so decimal
 *     numbers like 8,400.50 and abbreviations are not torn apart naively.
 *  3. Trim, drop empties, keep original character spans for evidence.
 *
 * The splitter is intentionally conservative: it prefers slightly long
 * claims over fragments that lose the numbers a validator needs.
 */
export function splitClaims(input: string): Claim[] {
  const claims: Claim[] = [];
  let searchFrom = 0;

  const push = (raw: string) => {
    const text = raw.trim();
    if (text.length === 0) return;
    const start = input.indexOf(text, searchFrom);
    const span: [number, number] =
      start >= 0 ? [start, start + text.length] : [searchFrom, searchFrom + text.length];
    if (start >= 0) searchFrom = start + text.length;
    claims.push({
      id: `c${claims.length + 1}`,
      index: claims.length,
      text,
      span,
    });
  };

  for (const line of input.split(/\r?\n/)) {
    if (line.trim().length === 0) continue;
    // Sentence split inside the line.
    const parts = line.split(/(?<=[.!?;])\s+(?=[A-Z0-9"“'(])/);
    for (const part of parts) push(part);
  }

  return claims;
}
