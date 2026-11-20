/**
 * History & Replay logic for the web UI: localStorage persistence,
 * search/filter, stats, and replay comparison.
 *
 * Everything here is pure and storage-agnostic (it depends only on a
 * minimal StorageLike interface) so it is unit-testable in Node and the
 * browser layer can pass window.localStorage directly.
 */
import type { ProofReport, Verdict } from "./types.js";
import type { SourceType } from "./samples.js";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const HISTORY_KEY = "proofgate.history.v1";

export interface HistoryEntry {
  /** Unique storage key: report content hash (stable per sealed report). */
  key: string;
  report: ProofReport;
  sourceType: SourceType;
  /** Human title derived from the input's first line at save time. */
  title: string;
  /** ISO timestamp of when the entry was saved to history. */
  savedAt: string;
  replayCount: number;
  /** ISO timestamp of the most recent replay, if any. */
  lastReplayAt: string | null;
  /** Whether the most recent replay reproduced every verdict. */
  lastReplayMatches: boolean | null;
}

/** Derive a short display title from the report's first input line. */
export function deriveReportTitle(report: ProofReport, maxLen = 64): string {
  const firstLine = report.inputText.split("\n").map((s) => s.trim()).find((s) => s.length > 0);
  const base = firstLine ?? report.id;
  return base.length > maxLen ? `${base.slice(0, maxLen - 1)}…` : base;
}

/** Build a history entry for a freshly produced report. */
export function makeHistoryEntry(
  report: ProofReport,
  sourceType: SourceType,
  savedAt: string,
): HistoryEntry {
  return {
    key: report.contentHash,
    report,
    sourceType,
    title: deriveReportTitle(report),
    savedAt,
    replayCount: 0,
    lastReplayAt: null,
    lastReplayMatches: null,
  };
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.key === "string" &&
    typeof e.title === "string" &&
    typeof e.savedAt === "string" &&
    typeof e.replayCount === "number" &&
    typeof e.sourceType === "string" &&
    typeof e.report === "object" &&
    e.report !== null &&
    typeof (e.report as Record<string, unknown>).contentHash === "string"
  );
}

/** Load all entries, newest first. Corrupt or missing data yields []. */
export function loadHistory(storage: StorageLike): HistoryEntry[] {
  try {
    const raw = storage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

export function persistHistory(storage: StorageLike, entries: HistoryEntry[]): void {
  storage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

/**
 * Insert a report into history (newest first). Saving the same sealed
 * report again replaces its entry in place rather than duplicating it.
 */
export function addToHistory(
  storage: StorageLike,
  report: ProofReport,
  sourceType: SourceType,
  savedAt: string,
): HistoryEntry[] {
  const entries = loadHistory(storage).filter((e) => e.key !== report.contentHash);
  entries.unshift(makeHistoryEntry(report, sourceType, savedAt));
  persistHistory(storage, entries);
  return entries;
}

/** Replace one entry (matched by key) and persist. Returns the new list. */
export function updateHistoryEntry(
  storage: StorageLike,
  key: string,
  patch: Partial<HistoryEntry>,
): HistoryEntry[] {
  const entries = loadHistory(storage).map((e) => (e.key === key ? { ...e, ...patch } : e));
  persistHistory(storage, entries);
  return entries;
}

export function removeFromHistory(storage: StorageLike, key: string): HistoryEntry[] {
  const entries = loadHistory(storage).filter((e) => e.key !== key);
  persistHistory(storage, entries);
  return entries;
}

export interface HistoryFilter {
  query?: string;
  /** Filter on the report's overall verdict. */
  verdict?: Verdict | "ALL";
  sourceType?: SourceType | "ALL";
  /** Only entries saved within this many days of `now`. Undefined = all time. */
  withinDays?: number;
  now?: string;
}

export function filterHistory(entries: HistoryEntry[], filter: HistoryFilter): HistoryEntry[] {
  const query = (filter.query ?? "").trim().toLowerCase();
  const nowMs = filter.now ? Date.parse(filter.now) : Date.now();
  return entries.filter((e) => {
    if (filter.verdict && filter.verdict !== "ALL" && e.report.summary.overallVerdict !== filter.verdict) {
      return false;
    }
    if (filter.sourceType && filter.sourceType !== "ALL" && e.sourceType !== filter.sourceType) {
      return false;
    }
    if (filter.withinDays !== undefined) {
      const savedMs = Date.parse(e.savedAt);
      if (Number.isNaN(savedMs) || nowMs - savedMs > filter.withinDays * 86_400_000) return false;
    }
    if (query) {
      const haystack = [
        e.title,
        e.sourceType,
        e.report.id,
        ...e.report.claims.map((c) => c.claim.text),
      ]
        .join("\n")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export interface HistoryStats {
  /** Entries saved in the last 30 days (relative to `now`). */
  reportsLast30Days: number;
  /** Total replays recorded across all entries. */
  replaysRun: number;
  /** Entries whose overall verdict is PASS (every claim passed). */
  reportsPassed: number;
}

export function historyStats(entries: HistoryEntry[], now: string): HistoryStats {
  const nowMs = Date.parse(now);
  return {
    reportsLast30Days: entries.filter((e) => {
      const savedMs = Date.parse(e.savedAt);
      return !Number.isNaN(savedMs) && nowMs - savedMs <= 30 * 86_400_000 && savedMs <= nowMs;
    }).length,
    replaysRun: entries.reduce((sum, e) => sum + e.replayCount, 0),
    reportsPassed: entries.filter((e) => e.report.summary.overallVerdict === "PASS").length,
  };
}

/* ------------------------- replay comparison ------------------------- */

export interface ClaimComparison {
  claimId: string;
  claimText: string;
  originalVerdict: Verdict;
  replayVerdict: Verdict | null;
  changed: boolean;
}

export interface ReplayComparison {
  /** True when every claim reproduced its verdict and the overall matches. */
  matches: boolean;
  originalOverall: Verdict;
  replayOverall: Verdict;
  claims: ClaimComparison[];
  changedCount: number;
}

/**
 * Compare a replayed report against the original, claim by claim.
 * Claims are matched by id (the splitter is deterministic, so the same
 * input yields the same ids). A claim missing from the replay counts as
 * changed.
 */
export function compareReplay(original: ProofReport, replayed: ProofReport): ReplayComparison {
  const replayById = new Map(replayed.claims.map((c) => [c.claim.id, c]));
  const claims: ClaimComparison[] = original.claims.map((c) => {
    const replay = replayById.get(c.claim.id);
    const replayVerdict = replay ? replay.verdict : null;
    return {
      claimId: c.claim.id,
      claimText: c.claim.text,
      originalVerdict: c.verdict,
      replayVerdict,
      changed: replayVerdict !== c.verdict,
    };
  });
  const changedCount = claims.filter((c) => c.changed).length;
  return {
    matches: changedCount === 0 && replayed.summary.overallVerdict === original.summary.overallVerdict,
    originalOverall: original.summary.overallVerdict,
    replayOverall: replayed.summary.overallVerdict,
    claims,
    changedCount,
  };
}

/**
 * Honest label for how a report was processed, derived from the model
 * outputs actually recorded in the report. A report whose model pass ran
 * on the mock adapter is labelled demo mode; a report with no model pass
 * at all says so.
 */
export function processingModeLabel(report: ProofReport): string {
  const sources = new Set(
    report.claims.map((c) => c.modelOutput?.source).filter((s) => s !== undefined),
  );
  if (sources.has("mock")) return "Demo mode (mock model)";
  if (sources.size === 0) return "Deterministic checks only";
  const parts: string[] = [];
  if (sources.has("on-device")) parts.push("Gemini Nano first pass");
  if (sources.has("cloud")) parts.push("cloud escalation");
  return parts.join(" + ");
}
