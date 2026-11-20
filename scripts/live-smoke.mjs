/**
 * Live smoke test against the real Firebase project (proofgate-f1e4d).
 *
 * NOT part of the shipped bundle and NOT run by `npm test`. Run manually:
 *
 *   npm run build && node scripts/live-smoke.mjs
 *
 * It exercises the repo's own FirebaseAiAdapter (dist build) on two
 * claims — one standard claim routed to the hybrid PREFER_ON_DEVICE
 * path, one escalated claim routed to ONLY_IN_CLOUD — plus one direct
 * SDK call per path to capture the model's raw response text, and
 * finally one end-to-end runProofGate over the invoice sample with the
 * live adapter. Every failure is printed verbatim (name / code /
 * message); each path is attempted at most twice.
 */
import { getApps } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { firebaseConfig, isFirebaseConfigured } from "../dist/src/firebase-config.js";
import {
  createModelAdapter,
  getFirebaseRuntimeStatus,
  buildClaimPrompt,
  claimHasDeterministicWarning,
  CLOUD_MODEL_ID,
} from "../dist/src/firebaseAi.js";
import {
  runProofGate,
  verifyProofReport,
  splitClaims,
  decideRoutingTier,
  processingModeLabel,
  INVOICE_SAMPLE,
} from "../dist/src/index.js";

function describeError(err) {
  if (err instanceof Error) {
    const parts = [`name: ${err.name}`, `message: ${err.message}`];
    if ("code" in err) parts.push(`code: ${String(err.code)}`);
    if ("customData" in err && err.customData !== undefined) {
      try {
        parts.push(`customData: ${JSON.stringify(err.customData)}`);
      } catch {
        /* ignore */
      }
    }
    return parts.join(" | ");
  }
  return String(err);
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

async function attempt(label, fn) {
  let lastErr;
  for (let i = 1; i <= 2; i++) {
    try {
      const value = await fn();
      console.log(`  [${label}] attempt ${i}: OK`);
      return { ok: true, value };
    } catch (err) {
      lastErr = err;
      console.log(`  [${label}] attempt ${i}: FAILED — ${describeError(err)}`);
    }
  }
  return { ok: false, error: lastErr };
}

console.log("== ProofGate live smoke ==");
console.log("config present:", isFirebaseConfigured(firebaseConfig), "| projectId:", firebaseConfig?.projectId);
const status = getFirebaseRuntimeStatus();
console.log("runtime status:", JSON.stringify(status));

const { adapter } = createModelAdapter();
console.log("adapter:", adapter.name);

// Claims: the invoice line-total claim routes to the on-device tier;
// the guarantee claim from the Announcement sample escalates to cloud.
const standardClaim = splitClaims(INVOICE_SAMPLE).find((c) => c.text.includes("Design services"));
const escalatedClaim = splitClaims(
  "The company guarantees the service will always be available, with zero downtime.",
)[0];

const app = getApps()[0];
const ai = getAI(app, { backend: new GoogleAIBackend() });

async function rawSdkCall(claim, mode) {
  const model = getGenerativeModel(ai, { mode, inCloudParams: { model: CLOUD_MODEL_ID } });
  const result = await withTimeout(
    model.generateContent(buildClaimPrompt(claim.text)),
    60_000,
    "generateContent",
  );
  return {
    inferenceSource: result.response.inferenceSource ?? "(absent)",
    text: result.response.text(),
  };
}

for (const [label, claim, mode] of [
  ["PREFER_ON_DEVICE path", standardClaim, InferenceMode.PREFER_ON_DEVICE],
  ["ONLY_IN_CLOUD path", escalatedClaim, InferenceMode.ONLY_IN_CLOUD],
]) {
  const routing = decideRoutingTier(claim, claimHasDeterministicWarning(claim));
  console.log(`\n-- ${label} --`);
  console.log("claim:", JSON.stringify(claim.text));
  console.log("routing tier:", routing.tier, "|", routing.reason);

  const viaAdapter = await attempt(`${label} adapter.analyze`, () => adapter.analyze(claim));
  if (viaAdapter.ok) {
    console.log("  parsed ModelOutput:", JSON.stringify(viaAdapter.value, null, 2));
  } else {
    console.log("  adapter.analyze FAILED (verbatim):", describeError(viaAdapter.error));
  }

  const raw = await attempt(`${label} raw SDK call`, () => rawSdkCall(claim, mode));
  if (raw.ok) {
    console.log("  raw inferenceSource:", raw.value.inferenceSource);
    console.log("  raw response text:", JSON.stringify(raw.value.text));
  } else {
    console.log("  raw SDK call FAILED (verbatim):", describeError(raw.error));
  }
}

console.log("\n-- End-to-end: runProofGate(INVOICE_SAMPLE, live adapter) --");
try {
  const report = await runProofGate(INVOICE_SAMPLE, {
    adapter,
    now: new Date().toISOString(),
  });
  console.log("processing mode label:", processingModeLabel(report));
  console.log("overall verdict:", report.summary.overallVerdict, "| summary:", JSON.stringify(report.summary));
  for (const c of report.claims) {
    console.log(
      `  ${c.claim.id}: verdict=${c.verdict}` +
        (c.modelOutput
          ? ` | model: label=${c.modelOutput.label} confidence=${c.modelOutput.confidence} source=${c.modelOutput.source} modelId=${c.modelOutput.modelId}`
          : " | model: (none)"),
    );
  }
  console.log("verifyProofReport:", verifyProofReport(report));
} catch (err) {
  console.log("end-to-end FAILED (verbatim):", describeError(err));
}
