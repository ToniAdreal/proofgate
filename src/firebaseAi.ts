/**
 * Firebase AI Logic adapter: the production ModelAdapter.
 *
 * Real code path through the Firebase JS SDK (`firebase/app` +
 * `firebase/ai`), using hybrid inference:
 *  - Standard claims run through a hybrid model configured with
 *    InferenceMode.PREFER_ON_DEVICE: Gemini Nano on-device where Chrome
 *    provides it, with SDK-managed cloud fallback. The SDK response's
 *    `inferenceSource` tells us where inference actually ran, and that
 *    is what gets recorded in the report.
 *  - Escalated claims (the deterministic routing policy in
 *    modelAdapter.ts decides) run through InferenceMode.ONLY_IN_CLOUD.
 *  - If the on-device pass throws (Nano unavailable on this device),
 *    the claim escalates to cloud and the escalation is recorded in the
 *    rationale, per SPEC Section 4, trigger 4.
 *
 * No Firebase project is connected by default (see firebase-config.ts).
 * `createModelAdapter` returns the deterministic MockModelAdapter
 * whenever no complete config is present, and the returned status says
 * so; the UI labels those runs as demo mode. Nothing in this file
 * invents a project, a key, or a connection state.
 */
import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
  type AI,
} from "firebase/ai";
import type { Claim, ModelOutput, ModelSource } from "./types.js";
import { MockModelAdapter, decideRoutingTier, type ModelAdapter } from "./modelAdapter.js";
import { checkArithmetic } from "./validators/arithmetic.js";
import { checkDates } from "./validators/dates.js";
import { checkUnits } from "./validators/units.js";
import { checkCitations } from "./validators/citations.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

/** Cloud model used for escalations and SDK cloud fallback. */
export const CLOUD_MODEL_ID = "gemini-2.5-flash";
/** Model id recorded for on-device passes. */
export const ON_DEVICE_MODEL_ID = "gemini-nano (on-device, via Firebase AI Logic)";

export interface FirebaseRuntimeStatus {
  /** True when a complete Firebase config is present. */
  configured: boolean;
  /** Which adapter family the app will actually run. */
  mode: "firebase" | "mock";
  /** Human-readable, honest description for the Runtime Indicators UI. */
  detail: string;
}

export function getFirebaseRuntimeStatus(
  config: FirebaseOptions | null = firebaseConfig,
): FirebaseRuntimeStatus {
  if (isFirebaseConfigured(config)) {
    return {
      configured: true,
      mode: "firebase",
      detail:
        "Firebase configured. Model pass runs through Firebase AI Logic hybrid inference (on-device Gemini Nano preferred, cloud escalation when needed).",
    };
  }
  return {
    configured: false,
    mode: "mock",
    detail:
      "Demo mode (mock): Firebase is not configured, so the model pass is the local deterministic mock. Deterministic checks are fully real.",
  };
}

/** The prompt sent to the model. Pure and testable. */
export function buildClaimPrompt(claimText: string): string {
  return [
    "You are the model pass inside ProofGate, a claim-verification tool.",
    "Deterministic code has already checked this claim's numbers, dates, units and citations.",
    "Your job is only to judge whether the claim's wording is supported, contradicted, or uncertain on its face.",
    "Respond with a single JSON object and nothing else:",
    '{"label": "supports" | "contradicts" | "uncertain" | "not-applicable", "confidence": <number 0..1>, "rationale": "<one short sentence>"}',
    "",
    `Claim: ${claimText}`,
  ].join("\n");
}

const VALID_LABELS: ReadonlySet<string> = new Set([
  "supports",
  "contradicts",
  "uncertain",
  "not-applicable",
]);

/**
 * Parse and validate a model's raw text into a ModelOutput.
 * The gate only ever sees validated shapes: malformed output becomes
 * `uncertain` with the parse failure recorded, never silently trusted.
 */
export function parseModelResponse(
  raw: string,
  claimId: string,
  source: ModelSource,
  modelId: string,
): ModelOutput {
  const fallback = (why: string): ModelOutput => ({
    claimId,
    label: "uncertain",
    confidence: 0,
    rationale: `Model response could not be used (${why}); recorded as uncertain.`,
    source,
    modelId,
  });

  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return fallback("no JSON object found");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return fallback("invalid JSON");
  }
  if (typeof parsed !== "object" || parsed === null) return fallback("JSON was not an object");
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.label !== "string" || !VALID_LABELS.has(obj.label)) {
    return fallback("missing or invalid label");
  }
  if (typeof obj.confidence !== "number" || !Number.isFinite(obj.confidence)) {
    return fallback("missing or invalid confidence");
  }
  return {
    claimId,
    label: obj.label as ModelOutput["label"],
    confidence: Math.min(1, Math.max(0, obj.confidence)),
    rationale: typeof obj.rationale === "string" ? obj.rationale : "",
    source,
    modelId,
  };
}

/** Per-claim deterministic warning check, mirroring the engine's routing input. */
export function claimHasDeterministicWarning(claim: Claim): boolean {
  const results = [
    ...checkArithmetic(claim),
    ...checkDates(claim),
    ...checkUnits(claim),
    ...checkCitations(claim),
  ];
  return results.some((r) => r.status === "warn");
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/**
 * Production adapter backed by Firebase AI Logic hybrid inference.
 * Construct only with a complete config (see createModelAdapter).
 */
export class FirebaseAiAdapter implements ModelAdapter {
  readonly name = "firebase-ai-logic";
  private readonly app: FirebaseApp;
  private readonly ai: AI;

  constructor(config: FirebaseOptions) {
    this.app = getApps().length > 0 ? getApps()[0]! : initializeApp(config);
    this.ai = getAI(this.app, { backend: new GoogleAIBackend() });
  }

  async analyze(claim: Claim): Promise<ModelOutput> {
    const routing = decideRoutingTier(claim, claimHasDeterministicWarning(claim));
    if (routing.tier === "cloud") {
      return this.callCloud(claim);
    }
    // On-device tier: hybrid model, on-device preferred, SDK cloud fallback.
    try {
      const model = getGenerativeModel(this.ai, {
        mode: InferenceMode.PREFER_ON_DEVICE,
        inCloudParams: { model: CLOUD_MODEL_ID },
      });
      const result = await model.generateContent(buildClaimPrompt(claim.text));
      const ranInCloud = result.response.inferenceSource === "in_cloud";
      const source: ModelSource = ranInCloud ? "cloud" : "on-device";
      return parseModelResponse(
        result.response.text(),
        claim.id,
        source,
        ranInCloud ? CLOUD_MODEL_ID : ON_DEVICE_MODEL_ID,
      );
    } catch (err) {
      // On-device unavailable or failed: escalate to cloud and record it.
      const out = await this.callCloud(claim);
      return {
        ...out,
        rationale: `On-device pass unavailable (${errorMessage(err)}); escalated to cloud. ${out.rationale}`,
      };
    }
  }

  private async callCloud(claim: Claim): Promise<ModelOutput> {
    const model = getGenerativeModel(this.ai, {
      mode: InferenceMode.ONLY_IN_CLOUD,
      inCloudParams: { model: CLOUD_MODEL_ID },
    });
    const result = await model.generateContent(buildClaimPrompt(claim.text));
    return parseModelResponse(result.response.text(), claim.id, "cloud", CLOUD_MODEL_ID);
  }
}

/**
 * The adapter factory the UI uses. Firebase when a complete config is
 * present and initialises cleanly; the deterministic mock otherwise.
 * The returned status always describes what will actually run.
 */
export function createModelAdapter(
  config: FirebaseOptions | null = firebaseConfig,
): { adapter: ModelAdapter; status: FirebaseRuntimeStatus } {
  const status = getFirebaseRuntimeStatus(config);
  if (status.mode === "firebase" && config) {
    try {
      return { adapter: new FirebaseAiAdapter(config), status };
    } catch (err) {
      return {
        adapter: new MockModelAdapter(),
        status: {
          configured: true,
          mode: "mock",
          detail: `Demo mode (mock): Firebase is configured but failed to initialise (${errorMessage(err)}), so the local deterministic mock is running instead.`,
        },
      };
    }
  }
  return { adapter: new MockModelAdapter(), status };
}
