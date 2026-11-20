export * from "./types.js";
export { splitClaims } from "./claimSplitter.js";
export { checkArithmetic, parseNumber } from "./validators/arithmetic.js";
export { checkDates, checkDateConsistency, extractDates } from "./validators/dates.js";
export { checkUnits } from "./validators/units.js";
export { checkCitations } from "./validators/citations.js";
export { checkNumericConsistency } from "./validators/numericConsistency.js";
export { gateClaim, overallVerdict } from "./gate.js";
export {
  buildProofReport,
  verifyProofReport,
  sha256Hex,
  canonicalJson,
  summarize,
  ENGINE_VERSION,
} from "./report.js";
export {
  MockModelAdapter,
  decideRoutingTier,
  type ModelAdapter,
  type RoutingDecision,
  type RoutingTier,
} from "./modelAdapter.js";
export { runProofGate, type EngineOptions } from "./engine.js";
