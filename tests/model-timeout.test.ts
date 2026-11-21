import { describe, it, expect } from "vitest";
import {
  runProofGate,
  verifyProofReport,
  withTimeout,
  TimeoutError,
  isTimeoutError,
  processingModeLabel,
  INVOICE_SAMPLE,
  type Claim,
  type EngineProgressEvent,
  type ModelAdapter,
  type ModelOutput,
} from "../src/index.js";
import { FirebaseAiAdapter } from "../src/firebaseAi.js";

/**
 * Regression tests for the phase-5 hang: a model adapter whose promise
 * never settles (the live Firebase behaviour: generateContent neither
 * resolved nor rejected) used to block runProofGate forever, which the
 * UI showed as step 5 "Generate Proof Report" spinning indefinitely.
 * Every external await is bounded now, and a model pass that does not
 * complete is recorded as an explicit model-unavailable outcome.
 */

function claim(text: string, id = "c1"): Claim {
  return { id, index: 0, text, span: [0, text.length] };
}

/** Adapter whose analyze promise never settles — the hang itself. */
class NeverResolvingAdapter implements ModelAdapter {
  readonly name = "never-resolving";
  analyze(_claim: Claim): Promise<ModelOutput> {
    return new Promise<ModelOutput>(() => {});
  }
}

/** Adapter that rejects immediately. */
class ThrowingAdapter implements ModelAdapter {
  readonly name = "throwing";
  async analyze(_claim: Claim): Promise<ModelOutput> {
    throw new Error("adapter exploded");
  }
}

/** Adapter that resolves, just slowly. */
class SlowAdapter implements ModelAdapter {
  readonly name = "slow";
  constructor(private readonly ms: number) {}
  async analyze(c: Claim): Promise<ModelOutput> {
    await new Promise((r) => setTimeout(r, this.ms));
    return {
      claimId: c.id,
      label: "supports",
      confidence: 0.9,
      rationale: "Slow but completed.",
      source: "cloud",
      modelId: "slow-model",
    };
  }
}

describe("withTimeout", () => {
  it("resolves when the promise settles within the bound", async () => {
    await expect(withTimeout(Promise.resolve(42), 1_000, "fast op")).resolves.toBe(42);
  });

  it("rejects with a TimeoutError when the promise never settles", async () => {
    const never = new Promise<number>(() => {});
    await expect(withTimeout(never, 30, "stuck op")).rejects.toBeInstanceOf(TimeoutError);
    await expect(withTimeout(never, 30, "stuck op")).rejects.toThrowError(
      "stuck op timed out after 30 ms",
    );
  });

  it("isTimeoutError recognises the error", async () => {
    const err = await withTimeout(new Promise(() => {}), 10, "x").catch((e: unknown) => e);
    expect(isTimeoutError(err)).toBe(true);
    expect(isTimeoutError(new Error("other"))).toBe(false);
  });
});

describe("engine: a model pass that never settles cannot hang the run", () => {
  it("invoice sample still completes: deterministic FAIL surfaces, model recorded unavailable", async () => {
    const started = Date.now();
    const report = await runProofGate(INVOICE_SAMPLE, {
      adapter: new NeverResolvingAdapter(),
      modelTimeoutMs: 50,
      now: "2026-11-20T00:00:00.000Z",
    });
    expect(Date.now() - started).toBeLessThan(5_000);

    expect(verifyProofReport(report)).toBe(true);
    expect(report.summary.overallVerdict).toBe("FAIL");
    expect(report.summary.totalClaims).toBe(5);

    const bad = report.claims.find((c) => c.claim.text.includes("Design services"));
    expect(bad).toBeDefined();
    // The deterministic gate still decided the claim on the arithmetic failure.
    expect(bad!.verdict).toBe("FAIL");
    expect(bad!.checks.some((c) => c.validator === "arithmetic" && c.status === "fail")).toBe(true);
    // And the model pass is honestly recorded as not having completed.
    expect(bad!.modelOutput).not.toBeNull();
    expect(bad!.modelOutput!.failure).toContain("timed out");
    expect(bad!.modelOutput!.label).toBe("uncertain");
    expect(bad!.modelOutput!.confidence).toBe(0);
    expect(bad!.modelOutput!.source).toBe("on-device");
    expect(bad!.modelOutput!.rationale).toContain("no model judgement was obtained");

    expect(processingModeLabel(report)).toBe("Deterministic checks only (model pass unavailable)");
  });

  it("a clean claim with an unavailable model is NEEDS REVIEW, never a silent PASS", async () => {
    const report = await runProofGate("Design services: 3 units at $2,800 = $8,400.", {
      adapter: new NeverResolvingAdapter(),
      modelTimeoutMs: 50,
      now: "2026-11-20T00:00:00.000Z",
    });
    const only = report.claims[0];
    expect(only.checks.every((c) => c.status !== "fail")).toBe(true);
    expect(only.modelOutput!.failure).toContain("timed out");
    expect(only.verdict).toBe("NEEDS REVIEW");
  });

  it("a cloud-routed claim records the failure against the cloud source", async () => {
    const report = await runProofGate(
      "The company guarantees the service will always be available, with zero downtime.",
      {
        adapter: new NeverResolvingAdapter(),
        modelTimeoutMs: 50,
        now: "2026-11-20T00:00:00.000Z",
      },
    );
    const only = report.claims[0];
    expect(only.modelOutput!.source).toBe("cloud");
    expect(only.modelOutput!.failure).toContain("timed out");
    expect(only.verdict).toBe("NEEDS REVIEW");
  });

  it("a throwing adapter also cannot break the run", async () => {
    const report = await runProofGate(INVOICE_SAMPLE, {
      adapter: new ThrowingAdapter(),
      modelTimeoutMs: 5_000,
      now: "2026-11-20T00:00:00.000Z",
    });
    expect(verifyProofReport(report)).toBe(true);
    const bad = report.claims.find((c) => c.claim.text.includes("Design services"));
    expect(bad!.verdict).toBe("FAIL");
    expect(bad!.modelOutput!.failure).toContain("adapter exploded");
  });

  it("a slow adapter inside the bound is used normally, with no failure recorded", async () => {
    const report = await runProofGate("Design services: 3 units at $2,800 = $8,400.", {
      adapter: new SlowAdapter(20),
      modelTimeoutMs: 5_000,
      now: "2026-11-20T00:00:00.000Z",
    });
    const only = report.claims[0];
    expect(only.modelOutput!.failure).toBeUndefined();
    expect(only.modelOutput!.label).toBe("supports");
    expect(only.verdict).toBe("PASS");
  });
});

describe("engine progress events", () => {
  it("fires split -> checks-complete -> model-claim-complete -> model-complete -> report-built", async () => {
    const events: EngineProgressEvent[] = [];
    await runProofGate(INVOICE_SAMPLE, {
      now: "2026-11-20T00:00:00.000Z",
      onProgress: (e) => events.push(e),
    });
    expect(events[0]).toEqual({ type: "split", totalClaims: 5 });
    const checks = events.find((e) => e.type === "checks-complete");
    expect(checks).toEqual({
      type: "checks-complete",
      totalClaims: 5,
      onDeviceClaims: 1,
      cloudClaims: 0,
    });
    const modelClaims = events.filter((e) => e.type === "model-claim-complete");
    expect(modelClaims).toHaveLength(1);
    expect(modelClaims[0]).toMatchObject({ tier: "on-device" });
    expect(events[events.length - 2]).toEqual({ type: "model-complete", totalClaims: 5 });
    expect(events[events.length - 1]).toEqual({ type: "report-built" });
  });
});

describe("FirebaseAiAdapter: bounded even when the backend never answers", () => {
  it(
    "analyze resolves with a recorded failure instead of hanging",
    async () => {
      const adapter = new FirebaseAiAdapter(
        { apiKey: "test-key", projectId: "test-project", appId: "1:0:web:test" },
        { callTimeoutMs: 50 },
      );
      const started = Date.now();
      const out = await adapter.analyze(
        claim("Design services: 3 units at $2,800 = $9,400."),
      );
      expect(Date.now() - started).toBeLessThan(10_000);
      // No real judgement can come back for a fake project/key; whatever
      // the SDK did (threw, stalled, errored), the outcome must be the
      // honest recorded-as-uncertain failure, not a hang or a fake answer.
      expect(out.failure).toBeDefined();
      expect(out.label).toBe("uncertain");
      expect(out.confidence).toBe(0);
    },
    20_000,
  );
});
