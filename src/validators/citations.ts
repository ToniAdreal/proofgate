import type { CheckResult, Claim } from "../types.js";

/**
 * Citation / URL validator.
 *  - Every URL-like token must parse as a valid http(s) URL; a malformed
 *    URL is a fail (a broken citation is worse than none).
 *  - A claim that leans on an external source ("according to", "study
 *    shows", "reported by", "source:") but carries no URL and no bracketed
 *    citation marker gets a warn: the gate turns that into NEEDS REVIEW.
 *  - DOI strings are validated by shape.
 */
export function checkCitations(claim: Claim): CheckResult[] {
  const results: CheckResult[] = [];
  const text = claim.text;

  const urlRe = /\b(?:https?:\/\/|www\.)[^\s<>"')\]]+/gi;
  const urls = text.match(urlRe) ?? [];
  let urlFailed = false;
  for (const raw of urls) {
    const candidate = raw.startsWith("www.") ? `https://${raw}` : raw;
    try {
      const u = new URL(candidate);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("protocol");
      if (!u.hostname.includes(".")) throw new Error("hostname");
      results.push({
        validator: "citations",
        claimId: claim.id,
        status: "pass",
        detail: `URL ${raw} is well-formed.`,
        evidence: { kind: "url", url: raw, hostname: u.hostname },
      });
    } catch {
      urlFailed = true;
      results.push({
        validator: "citations",
        claimId: claim.id,
        status: "fail",
        detail: `URL "${raw}" is malformed and cannot be resolved as written.`,
        evidence: { kind: "url", url: raw },
      });
    }
  }

  const doiRe = /\b10\.\d{4,9}\/[^\s<>"')\]]+/g;
  for (const doi of text.match(doiRe) ?? []) {
    results.push({
      validator: "citations",
      claimId: claim.id,
      status: "pass",
      detail: `DOI ${doi} has a valid shape.`,
      evidence: { kind: "doi", doi },
    });
  }

  const citesSource =
    /(according to|study (shows|found|reports)|research (shows|suggests)|reported by|source\s*:|data from|statistics show)/i.test(text);
  const hasBracketCitation = /\[[^\]]{1,80}\]/.test(text) || /\([A-Z][a-z]+(?: et al\.)?,? \d{4}\)/.test(text);
  const hasAnyCitation = urls.length > 0 || hasBracketCitation || (text.match(doiRe) ?? []).length > 0;

  if (citesSource && !hasAnyCitation && !urlFailed) {
    results.push({
      validator: "citations",
      claimId: claim.id,
      status: "warn",
      detail: "Claim attributes a fact to an external source but provides no URL, DOI, or bracketed citation.",
      evidence: { kind: "missing-citation" },
    });
  }

  if (results.length === 0) {
    results.push({
      validator: "citations",
      claimId: claim.id,
      status: "skip",
      detail: "No citations or source attributions in this claim.",
      evidence: {},
    });
  }
  return results;
}
