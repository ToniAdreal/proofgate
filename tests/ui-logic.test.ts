import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  runProofGate,
  verifyProofReport,
  SAMPLES,
  INVOICE_SAMPLE,
  HISTORY_KEY,
  deriveReportTitle,
  makeHistoryEntry,
  loadHistory,
  addToHistory,
  updateHistoryEntry,
  removeFromHistory,
  filterHistory,
  historyStats,
  compareReplay,
  processingModeLabel,
  type StorageLike,
} from "../src/index.js";
import { sha256Hex } from "../src/sha256.js";
import { isFirebaseConfigured } from "../src/firebase-config.js";
import {
  getFirebaseRuntimeStatus,
  buildClaimPrompt,
  parseModelResponse,
  claimHasDeterministicWarning,
} from "../src/firebaseAi.js";
import { splitClaims } from "../src/claimSplitter.js";

/* ------------------------------ helpers ------------------------------ */

class MemoryStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

const NOW = "2026-11-20T12:00:00.000Z";

async function invoiceReport() {
  return runProofGate(INVOICE_SAMPLE, { now: NOW });
}

/* ------------------------------ sha256 ------------------------------- */

describe("sha256Hex (pure TS)", () => {
  it("matches the FIPS known-answer vectors", () => {
    expect(sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
    expect(sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("matches node:crypto on long and unicode input", () => {
    const samples = [
      "x".repeat(10_000),
      "ProofGate 核验报告 — ünïcode ✓ 2026",
      JSON.stringify({ b: [1, 2, { a: "z" }], a: null }),
    ];
    for (const s of samples) {
      expect(sha256Hex(s)).toBe(createHash("sha256").update(s, "utf8").digest("hex"));
    }
  });
});

/* ------------------------- firebase config --------------------------- */

describe("firebase config + runtime status", () => {
  it("treats null and incomplete configs as unconfigured", () => {
    expect(isFirebaseConfigured(null)).toBe(false);
    expect(isFirebaseConfigured(undefined)).toBe(false);
    expect(isFirebaseConfigured({})).toBe(false);
    expect(isFirebaseConfigured({ apiKey: "k", projectId: "p" })).toBe(false);
    expect(isFirebaseConfigured({ apiKey: "k", projectId: "p", appId: "a" })).toBe(true);
  });

  it("reports demo (mock) mode honestly when unconfigured", () => {
    const status = getFirebaseRuntimeStatus(null);
    expect(status.configured).toBe(false);
    expect(status.mode).toBe("mock");
    expect(status.detail).toContain("Demo mode");
  });

  it("reports firebase mode when a complete config is present", () => {
    const status = getFirebaseRuntimeStatus({ apiKey: "k", projectId: "p", appId: "a" });
    expect(status.configured).toBe(true);
    expect(status.mode).toBe("firebase");
  });
});

/* ----------------------- model response parsing ---------------------- */

describe("parseModelResponse", () => {
  it("parses a clean JSON response", () => {
    const out = parseModelResponse(
      '{"label":"supports","confidence":0.82,"rationale":"Reads consistently."}',
      "c1",
      "on-device",
      "nano",
    );
    expect(out.label).toBe("supports");
    expect(out.confidence).toBeCloseTo(0.82);
    expect(out.source).toBe("on-device");
  });

  it("parses fenced JSON surrounded by prose", () => {
    const out = parseModelResponse(
      'Here is my assessment:\n```json\n{"label":"contradicts","confidence":0.9,"rationale":"No."}\n```',
      "c2",
      "cloud",
      "gemini",
    );
    expect(out.label).toBe("contradicts");
    expect(out.confidence).toBeCloseTo(0.9);
  });

  it("clamps out-of-range confidence into 0..1", () => {
    const out = parseModelResponse('{"label":"supports","confidence":1.7}', "c1", "cloud", "m");
    expect(out.confidence).toBe(1);
  });

  it("records malformed output as uncertain, never as a verdict input", () => {
    for (const raw of ["", "not json at all", '{"label":"maybe","confidence":0.5}', '{"label":"supports"}']) {
      const out = parseModelResponse(raw, "c1", "cloud", "m");
      expect(out.label).toBe("uncertain");
      expect(out.confidence).toBe(0);
      expect(out.rationale).toContain("could not be used");
    }
  });
});

describe("buildClaimPrompt + warning detection", () => {
  it("embeds the claim and asks for JSON only", () => {
    const prompt = buildClaimPrompt("Revenue grew 18%.");
    expect(prompt).toContain("Revenue grew 18%.");
    expect(prompt).toContain("JSON");
  });

  it("flags the uncited-study claim as warned and a plain claim as not", () => {
    const warned = splitClaims("According to a recent study, churn fell by half this year.")[0];
    const plain = splitClaims("The project lead is Maya Chen from the design team.")[0];
    expect(claimHasDeterministicWarning(warned)).toBe(true);
    expect(claimHasDeterministicWarning(plain)).toBe(false);
  });
});

/* ------------------------------ history ------------------------------ */

describe("history storage", () => {
  it("round-trips entries through storage, newest first", async () => {
    const storage = new MemoryStorage();
    const r1 = await invoiceReport();
    const r2 = await runProofGate("The fee is 1,200 + 300 = 1,500 in total.", { now: NOW });
    addToHistory(storage, r1, "Invoice", "2026-11-18T09:00:00.000Z");
    const entries = addToHistory(storage, r2, "AI Answer", "2026-11-20T09:00:00.000Z");
    expect(entries).toHaveLength(2);
    expect(entries[0].report.id).toBe(r2.id);
    const loaded = loadHistory(storage);
    expect(loaded.map((e) => e.key)).toEqual(entries.map((e) => e.key));
    expect(loaded[1].sourceType).toBe("Invoice");
    expect(storage.getItem(HISTORY_KEY)).toContain(r1.contentHash);
  });

  it("deduplicates the same sealed report instead of storing it twice", async () => {
    const storage = new MemoryStorage();
    const report = await invoiceReport();
    addToHistory(storage, report, "Invoice", NOW);
    const entries = addToHistory(storage, report, "Invoice", NOW);
    expect(entries).toHaveLength(1);
  });

  it("survives corrupt storage contents", () => {
    const storage = new MemoryStorage();
    storage.setItem(HISTORY_KEY, "{not json");
    expect(loadHistory(storage)).toEqual([]);
    storage.setItem(HISTORY_KEY, JSON.stringify([{ nope: true }, 42, null]));
    expect(loadHistory(storage)).toEqual([]);
  });

  it("updates and removes entries by key", async () => {
    const storage = new MemoryStorage();
    const report = await invoiceReport();
    const [entry] = addToHistory(storage, report, "Invoice", NOW);
    const updated = updateHistoryEntry(storage, entry.key, {
      replayCount: 2,
      lastReplayAt: NOW,
      lastReplayMatches: true,
    });
    expect(updated[0].replayCount).toBe(2);
    expect(updated[0].lastReplayMatches).toBe(true);
    expect(removeFromHistory(storage, entry.key)).toEqual([]);
    expect(loadHistory(storage)).toEqual([]);
  });

  it("derives titles from the first input line and truncates long ones", async () => {
    const report = await invoiceReport();
    expect(deriveReportTitle(report)).toBe("Invoice Q-1042 from Acme Studio.");
    const long = await runProofGate(`${"A".repeat(200)} is the headline figure here.`, { now: NOW });
    expect(deriveReportTitle(long).length).toBe(64);
    const entry = makeHistoryEntry(report, "Invoice", NOW);
    expect(entry.key).toBe(report.contentHash);
    expect(entry.replayCount).toBe(0);
    expect(entry.lastReplayAt).toBeNull();
  });
});

describe("filterHistory + historyStats", () => {
  async function seeded() {
    const storage = new MemoryStorage();
    const fail = await invoiceReport();
    const pass = await runProofGate("The fee is 1,200 + 300 = 1,500 in total.", { now: NOW });
    addToHistory(storage, fail, "Invoice", "2026-11-19T09:00:00.000Z");
    addToHistory(storage, pass, "Quote", "2026-11-20T09:00:00.000Z");
    return loadHistory(storage);
  }

  it("filters by verdict, source type, query and recency", async () => {
    const entries = await seeded();
    expect(filterHistory(entries, { verdict: "FAIL" })).toHaveLength(1);
    expect(filterHistory(entries, { verdict: "PASS" })[0].sourceType).toBe("Quote");
    expect(filterHistory(entries, { sourceType: "Invoice" })).toHaveLength(1);
    expect(filterHistory(entries, { query: "acme" })).toHaveLength(1);
    expect(filterHistory(entries, { query: "no-such-text" })).toHaveLength(0);
    expect(filterHistory(entries, { withinDays: 1, now: NOW })).toHaveLength(1);
    expect(filterHistory(entries, {})).toHaveLength(2);
  });

  it("computes stats from real entries", async () => {
    const entries = await seeded();
    const stats = historyStats(entries, NOW);
    expect(stats.reportsLast30Days).toBe(2);
    expect(stats.reportsPassed).toBe(1);
    expect(stats.replaysRun).toBe(0);
    const withReplay = entries.map((e, i) => (i === 0 ? { ...e, replayCount: 3 } : e));
    expect(historyStats(withReplay, NOW).replaysRun).toBe(3);
  });
});

/* -------------------------- replay comparison ------------------------ */

describe("compareReplay", () => {
  it("reports a perfect match when the replay reproduces every verdict", async () => {
    const original = await invoiceReport();
    const replayed = await invoiceReport();
    const cmp = compareReplay(original, replayed);
    expect(cmp.matches).toBe(true);
    expect(cmp.changedCount).toBe(0);
    expect(cmp.originalOverall).toBe("FAIL");
    expect(cmp.replayOverall).toBe("FAIL");
    expect(verifyProofReport(replayed)).toBe(true);
  });

  it("detects a changed verdict and a missing claim", async () => {
    const original = await invoiceReport();
    const replayed = structuredClone(original);
    replayed.claims[0].verdict = "FAIL"; // was PASS
    replayed.claims = replayed.claims.slice(0, -1); // drop one claim
    replayed.summary.overallVerdict = "FAIL";
    const cmp = compareReplay(original, replayed);
    expect(cmp.matches).toBe(false);
    expect(cmp.claims[0].changed).toBe(true);
    expect(cmp.claims[cmp.claims.length - 1].replayVerdict).toBeNull();
    expect(cmp.changedCount).toBe(2);
  });
});

/* ------------------------- processing mode --------------------------- */

describe("processingModeLabel", () => {
  it("labels mock reports as demo mode", async () => {
    const report = await invoiceReport();
    expect(processingModeLabel(report)).toBe("Demo mode (mock model)");
  });

  it("labels model-free reports as deterministic only", async () => {
    const report = await runProofGate(INVOICE_SAMPLE, { now: NOW, useModel: false });
    expect(processingModeLabel(report)).toBe("Deterministic checks only");
  });
});

/* ------------------------------ samples ------------------------------ */

describe("built-in samples", () => {
  it("the invoice sample is the canonical case: one arithmetic FAIL, overall FAIL", async () => {
    const report = await runProofGate(SAMPLES.Invoice, { now: NOW });
    expect(report.summary.overallVerdict).toBe("FAIL");
    const failed = report.claims.filter((c) => c.verdict === "FAIL");
    expect(failed).toHaveLength(1);
    expect(failed[0].claim.text).toContain("3 units at $2,800 = $9,400");
    expect(failed[0].checks.some((c) => c.validator === "arithmetic" && c.status === "fail")).toBe(true);
  });

  it("every source type has a non-empty sample that the splitter can read", () => {
    for (const text of Object.values(SAMPLES)) {
      expect(text.trim().length).toBeGreaterThan(0);
      expect(splitClaims(text).length).toBeGreaterThan(0);
    }
  });
});
