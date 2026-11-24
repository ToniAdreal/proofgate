# ProofGate

**Verify before you trust.**

ProofGate is a verification workspace for AI-generated text: invoices, quotes, announcements, and reports. Paste the text and ProofGate splits it into atomic claims and checks each one. Whatever can be checked deterministically is checked deterministically, in code, with the recomputed values shown next to the stated ones. Models are used only for what code cannot judge. A deterministic gate, never a model, issues the final verdict for every claim: PASS, NEEDS REVIEW, or FAIL, each with the evidence and the rule that produced it.

Live demo: https://toniadreal.github.io/proofgate/

Built for #BuildHybridAI 2026 (Google Firebase × Devpost).

## How it works

- **Claim pipeline.** Input is split into atomic claims with character spans preserved. Five deterministic validators run per claim and across the document: arithmetic (equations, priced line totals, percent-of statements, all recomputed), dates (real-calendar validation, weekday cross-checks, issue-date vs due-date ordering), units (stated conversions recomputed against a fixed table), citations (URL and DOI form, plus a warning when a source is invoked but never cited), and numeric consistency (subtotal + tax = total, line-item sums, the same labelled figure stated with two different values).
- **Hybrid routing.** Each claim is routed by a pure, replayable policy function. Short, plain claims stay deterministic-only and never leave the device. Standard claims go to on-device Gemini Nano through Firebase AI Logic hybrid inference (`PREFER_ON_DEVICE`). Claims escalate to the cloud model (Gemini 3.8 Flash, `ONLY_IN_CLOUD`) when a trigger fires: high-stakes wording such as guarantees and absolutes, a deterministic warning, excessive length, or an on-device pass that is unavailable or uncertain. Every escalation is recorded in the report with its reason.
- **Deterministic gate.** Verdicts come from four rules in `src/gate.ts`, evaluated in order. R1: any hard validator failure is a FAIL, and no model output can override it. R2: a model contradiction at confidence 0.7 or above is a FAIL. R3: warnings, weak contradictions, uncertain model output, or low-confidence support go to NEEDS REVIEW. R4: everything else passes. The report-level verdict is worst-claim-wins.
- **Sealed Proof Reports.** Every run produces a Proof Report (`proofgate.report/1`) containing the original input, every check, every model output, and every verdict, sealed with a SHA-256 content hash. Anyone can recompute the hash to confirm the report was not altered, and the deterministic checks can be replayed against the stored input from the History screen. If a model call fails or times out, the report says so and the claim is routed to review; a failed model pass is never presented as a completed one.

## Example

In the live demo, the sample invoice line "Design services: 3 units at $2,800 = $9,400" fails: the arithmetic validator recomputes $8,400, and the cloud model pass independently records "contradicts" at confidence 1.00. An absolute "zero downtime" guarantee in the same text is judged uncertain by the model (confidence 0.90) and lands in NEEDS REVIEW for a human to decide.

## Tech

Vite + TypeScript web app with a framework-free core engine, so the same code runs in the test suite and in the browser. Firebase AI Logic (Firebase JS SDK) only for Gemini access; no Gemini API keys in the client code. Firebase App Check is enforced on the project, with a registered debug token for the public demo. When no Firebase configuration is present, the app runs in a labelled demo mode with a deterministic mock model adapter; the deterministic checks are identical in both modes.

## Tests

84 automated tests (Vitest) cover every validator, the gate rules including "a model can never override a hard failure", routing tiers, report sealing and tamper detection, App Check initialization guarding, model-call timeout behaviour, and the end-to-end invoice case.

```bash
npm install
npm test
npm run dev
```

## License

Apache License 2.0. See `LICENSE`.
