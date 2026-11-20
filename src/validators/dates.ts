import type { CheckResult, Claim } from "../types.js";

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export interface FoundDate {
  raw: string;
  date: Date | null;
  valid: boolean;
  reason?: string;
}

/** Extract and validate dates in ISO, US numeric, and long English forms. */
export function extractDates(text: string): FoundDate[] {
  const found: FoundDate[] = [];

  const isoRe = /\b(\d{4})-(\d{2})-(\d{2})\b/g;
  let m: RegExpExecArray | null;
  while ((m = isoRe.exec(text)) !== null) {
    found.push(makeDate(m[0], Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  }

  const usRe = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g;
  while ((m = usRe.exec(text)) !== null) {
    found.push(makeDate(m[0], Number(m[3]), Number(m[1]) - 1, Number(m[2])));
  }

  const longRe = /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/gi;
  while ((m = longRe.exec(text)) !== null) {
    const month = MONTHS[m[1].toLowerCase()];
    if (month === undefined) continue;
    found.push(makeDate(m[0], Number(m[3]), month, Number(m[2])));
  }

  return found;
}

function makeDate(raw: string, year: number, monthIdx: number, day: number): FoundDate {
  if (year < 1900 || year > 2100) {
    return { raw, date: null, valid: false, reason: `Year ${year} is outside the sane range 1900-2100.` };
  }
  if (monthIdx < 0 || monthIdx > 11) {
    return { raw, date: null, valid: false, reason: `Month index ${monthIdx + 1} is invalid.` };
  }
  const d = new Date(Date.UTC(year, monthIdx, day));
  // JS Date silently rolls overflow (e.g. Feb 30 -> Mar 2); detect it.
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== monthIdx || d.getUTCDate() !== day) {
    return { raw, date: null, valid: false, reason: `${raw} is not a real calendar date.` };
  }
  return { raw, date: d, valid: true };
}

/**
 * Date validator (per claim):
 *  - Any impossible calendar date -> fail.
 *  - A named weekday that does not match the date -> fail.
 *  - A valid date far in the past for a future-tense claim ("will ship on ... 2019-01-01")
 *    is not judged here; cross-date ordering is checked in checkDateConsistency.
 */
export function checkDates(claim: Claim): CheckResult[] {
  const dates = extractDates(claim.text);
  if (dates.length === 0) {
    return [{
      validator: "dates",
      claimId: claim.id,
      status: "skip",
      detail: "No dates found in this claim.",
      evidence: {},
    }];
  }
  const results: CheckResult[] = [];
  for (const fd of dates) {
    if (!fd.valid) {
      results.push({
        validator: "dates",
        claimId: claim.id,
        status: "fail",
        detail: fd.reason ?? `Date "${fd.raw}" is invalid.`,
        evidence: { raw: fd.raw },
      });
      continue;
    }
    // Weekday cross-check: "Monday, March 3, 2026" — March 3 2026 is a Tuesday.
    const lower = claim.text.toLowerCase();
    const wd = WEEKDAYS.find((w) => lower.includes(w));
    if (wd && fd.date) {
      const actual = WEEKDAYS[fd.date.getUTCDay()];
      if (actual !== wd) {
        results.push({
          validator: "dates",
          claimId: claim.id,
          status: "fail",
          detail: `Claim says ${wd} but ${fd.raw} falls on a ${actual}.`,
          evidence: { raw: fd.raw, claimedWeekday: wd, actualWeekday: actual },
        });
        continue;
      }
    }
    results.push({
      validator: "dates",
      claimId: claim.id,
      status: "pass",
      detail: `Date "${fd.raw}" is a real calendar date.`,
      evidence: { raw: fd.raw, iso: fd.date!.toISOString().slice(0, 10) },
    });
  }
  return results;
}

/**
 * Cross-claim date consistency: when the whole text labels an invoice /
 * issue date and a due date, the due date must not precede the issue date.
 * Runs over the full input; findings are attached to the claim that
 * contains the due date.
 */
export function checkDateConsistency(claims: Claim[]): CheckResult[] {
  const results: CheckResult[] = [];
  let issue: { claim: Claim; fd: FoundDate } | null = null;
  let due: { claim: Claim; fd: FoundDate } | null = null;

  for (const claim of claims) {
    const lower = claim.text.toLowerCase();
    const dates = extractDates(claim.text).filter((d) => d.valid && d.date);
    if (dates.length === 0) continue;
    if (/(invoice date|issued|issue date|date issued)/.test(lower) && !issue) {
      issue = { claim, fd: dates[0] };
    }
    if (/(due date|due on|payment due|payable by)/.test(lower) && !due) {
      due = { claim, fd: dates[0] };
    }
  }

  if (issue && due && issue.fd.date && due.fd.date) {
    if (due.fd.date.getTime() < issue.fd.date.getTime()) {
      results.push({
        validator: "dates",
        claimId: due.claim.id,
        status: "fail",
        detail: `Due date ${due.fd.raw} is before the invoice/issue date ${issue.fd.raw}.`,
        evidence: {
          kind: "ordering",
          issueDate: issue.fd.date.toISOString().slice(0, 10),
          dueDate: due.fd.date.toISOString().slice(0, 10),
        },
      });
    } else {
      results.push({
        validator: "dates",
        claimId: due.claim.id,
        status: "pass",
        detail: `Due date ${due.fd.raw} is on or after the issue date ${issue.fd.raw}.`,
        evidence: {
          kind: "ordering",
          issueDate: issue.fd.date.toISOString().slice(0, 10),
          dueDate: due.fd.date.toISOString().slice(0, 10),
        },
      });
    }
  }
  return results;
}
