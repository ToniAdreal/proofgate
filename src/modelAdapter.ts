import type { Claim, ModelOutput } from "./types.js";

/**
 * Model adapter interface.
 *
 * The engine depends only on this interface. Production adapters wrap
 * Firebase AI Logic:
 *  - OnDeviceAdapter  -> Gemini Nano, hybrid inference "prefer on-device"
 *  - CloudAdapter     -> Gemini cloud model, hybrid inference "cloud only"
 *    for escalated claims
 * Demo / test adapters implement the same contract with no network.
 */
export interface ModelAdapter {
  readonly name: string;
  analyze(claim: Claim): Promise<ModelOutput>;
}

/**
 * Hybrid routing decision, shared by the engine and the UI layer.
 * Pure and deterministic so routing itself is replayable.
 */
export type RoutingTier = "deterministic-only" | "on-device" | "cloud";

export interface RoutingDecision {
  tier: RoutingTier;
  reason: string;
}

const ESCALATION_MARKERS =
  /(guarantee|guaranteed|always|never fails|100%|risk-free|proven|clinically|legally|contract|liable|certified)/i;

const LONG_CLAIM_CHARS = 280;

/**
 * Routing policy:
 *  - Claims with no numbers, dates, units, URLs, or risk markers are
 *    plain prose: deterministic checks already ran; a model pass adds
 *    little. Tier: on-device first pass still runs for tone/fact shape,
 *    unless the claim is trivially short (< 40 chars) -> deterministic-only.
 *  - Claims containing escalation markers, or longer than 280 chars,
 *    or where deterministic checks warned, escalate to cloud.
 *  - Everything else: on-device suffices.
 * The engine calls decideRoutingTier with the warn flag after validators run.
 */
export function decideRoutingTier(claim: Claim, hasWarn: boolean): RoutingDecision {
  if (claim.text.length < 40 && !ESCALATION_MARKERS.test(claim.text)) {
    return { tier: "deterministic-only", reason: "Short plain claim; deterministic checks are sufficient." };
  }
  if (ESCALATION_MARKERS.test(claim.text)) {
    return { tier: "cloud", reason: "Claim contains high-stakes markers (guarantee / legal / medical / absolute wording); deep cloud pass required." };
  }
  if (claim.text.length > LONG_CLAIM_CHARS) {
    return { tier: "cloud", reason: `Claim length ${claim.text.length} exceeds the on-device comfort threshold ${LONG_CLAIM_CHARS}.` };
  }
  if (hasWarn) {
    return { tier: "cloud", reason: "A deterministic check warned on this claim; cloud pass gathers more context." };
  }
  return { tier: "on-device", reason: "Standard claim; private on-device first pass is sufficient." };
}

/**
 * Deterministic mock adapter. No network, no keys, same input -> same
 * output. Used for demo mode (Firebase not configured), tests, and CI.
 *
 * Heuristics (deliberately simple and documented):
 *  - Absolute / guarantee wording -> "contradicts" is too strong a word
 *    for a mock; it returns "uncertain" with low confidence so the gate
 *    routes the claim to NEEDS REVIEW, which is the honest behaviour
 *    for unverifiable absolutes.
 *  - Claims with no checkable content -> "not-applicable".
 *  - Otherwise -> "supports" with confidence scaled by claim length.
 */
export class MockModelAdapter implements ModelAdapter {
  readonly name = "mock-deterministic";

  async analyze(claim: Claim): Promise<ModelOutput> {
    const text = claim.text;
    if (/^\s*(hello|hi|thanks|thank you)\b/i.test(text)) {
      return {
        claimId: claim.id,
        label: "not-applicable",
        confidence: 1,
        rationale: "Greeting or courtesy text; nothing to verify.",
        source: "mock",
        modelId: "mock-deterministic-v1",
      };
    }
    if (ESCALATION_MARKERS.test(text)) {
      return {
        claimId: claim.id,
        label: "uncertain",
        confidence: 0.35,
        rationale: "Claim uses absolute or high-stakes wording that a mock pass cannot verify.",
        source: "mock",
        modelId: "mock-deterministic-v1",
      };
    }
    const confidence = Math.min(0.95, 0.6 + text.length / 1000);
    return {
      claimId: claim.id,
      label: "supports",
      confidence: Math.round(confidence * 100) / 100,
      rationale: "Mock pass: no contradiction signals detected in claim shape.",
      source: "mock",
      modelId: "mock-deterministic-v1",
    };
  }
}
