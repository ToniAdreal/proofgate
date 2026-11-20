# ProofGate — Product Specification

**Tagline:** Verify before you trust.
**Event:** #BuildHybridAI 2026 (Devpost). Submission deadline 2026-11-30 14:00 PT.
**Platform:** Web / Chrome (responsive web app; Chrome is the primary target because on-device Gemini Nano is available there via Firebase AI Logic hybrid inference).
**Status of this document:** v0.1, 2026-11-20. The deterministic core engine described here is implemented and tested (`src/`, 45 passing tests). The UI layer and the live Firebase adapters are the next phase; no Firebase project is connected yet, and nothing in this spec claims otherwise.

---

## 1. Problem and product idea

People paste AI answers, quotes, invoices, and announcements into their work every day and trust them on sight. The most damaging errors in that text are usually not subtle: a line total that does not multiply out, a due date before the invoice date, a "10 km" that is not "20 miles", a confident claim attributed to a study that is never cited. These errors are mechanically checkable, yet no tool checks them at the moment of pasting, and generic AI fact-checkers answer with another layer of unverifiable prose.

ProofGate is a "verify before you trust" assistant built on one principle: **whatever can be checked deterministically is checked deterministically, in code, with recomputed evidence; models are used only for what code cannot judge, and a deterministic gate, never a model, issues the final verdict.** Every run produces a replayable Proof Report: a sealed evidence record that shows exactly what was checked, what the models said, and why each claim passed, needs review, or failed.

## 2. Users and core flows

- **Freelancers and small teams** checking a quote or invoice before sending or paying it.
- **Operators and assistants** checking an AI-generated answer, summary, or announcement before forwarding it.
- **Anyone pasting third-party text** who needs a fast, private first read on whether the numbers, dates, units, and citations hold together.

Core flow:

1. Paste text (an AI answer, quote, invoice, announcement) into the checker.
2. ProofGate splits it into atomic claims and runs the verification pipeline (Section 3).
3. The user sees per-claim verdicts (PASS / NEEDS REVIEW / FAIL) with the evidence inline: recomputed values next to stated values, the exact rule that fired.
4. The user opens, downloads, or shares the Proof Report (Section 6). Reports can be re-verified by anyone: recompute the content hash and replay the deterministic checks against the stored input.

## 3. Claim pipeline

The pipeline is implemented in `src/engine.ts` (`runProofGate`) and runs in a fixed order. Stages 1, 2, 3, 5, and 6 are deterministic code. Stage 4 is the only model stage.

### Stage 1 — Claim splitting (`src/claimSplitter.ts`)

- Split input into lines; split each line on sentence terminators (. ! ? ;) followed by whitespace and an uppercase letter, digit, or opening quote, so decimal amounts such as `$8,400.50` are not torn apart.
- Trim, drop empty segments, assign stable ids (`c1`, `c2`, ...) and record the character span of each claim in the original input so the UI can highlight claims in place and the report can be replayed against the exact source text.
- Deliberately conservative: a slightly long claim is preferred over a fragment that loses the numbers a validator needs.

### Stage 2 — Per-claim deterministic validators (`src/validators/`)

Each validator returns `CheckResult` records: validator name, claim id, status (`pass` / `fail` / `warn` / `skip`), a human-readable detail, and machine-readable evidence (operands, expected vs stated values).

| Validator | What it recomputes | Hard fail examples |
|---|---|---|
| `arithmetic` | Explicit equations (`A + B = C`, `-`, `*`, `/`, `x`, `×`), line totals (`N units at $P = $T`), percent-of statements (`P% of X = Y`). Tolerance 0.01. | `3 units at $2,800 = $9,400` (recomputed 8,400) |
| `dates` | Dates in ISO (`2026-11-10`), US numeric (`11/10/2026`), and long English (`November 10, 2026`) forms. Real-calendar validation (no silent overflow), sane year range 1900–2100, weekday cross-check when a weekday is named. | `2026-02-30`; "Wednesday, January 1, 2026" (that date is a Thursday) |
| `units` | Stated conversions between units of the same dimension (length, mass, storage, time) against a fixed conversion table, 2% tolerance for rounded prose conversions. | `10 km = 20 miles` (recomputed 6.2137); converting across dimensions |
| `citations` | Every URL-like token must parse as a well-formed http(s) URL with a dotted hostname; DOI shape validation; a claim that invokes an external source ("according to", "study shows", "reported by", "source:") without any URL, DOI, or bracketed citation produces a `warn`, not a fail. | `https://example` (no dotted hostname); uncited "according to a study" claim warns |

### Stage 3 — Whole-document validators

These run over all claims together and attach findings to the claim they belong to:

- `dates` consistency (`checkDateConsistency`): when the text labels an invoice/issue date and a due date, the due date must not precede the issue date.
- `numeric-consistency` (`checkNumericConsistency`): subtotal + tax = total reconciliation when all three figures are present; otherwise line-item sum vs stated total when at least two priced items exist; and a labelled figure (deposit, total, price, fee, amount) stated with two different values anywhere in the text is a fail.

### Stage 4 — Model pass (hybrid, routed; Section 4)

Each claim is routed to one of three tiers by `decideRoutingTier`. The engine calls the configured `ModelAdapter` for claims routed to a model tier and records the raw `ModelOutput` (label, confidence, rationale, source, model id) in the report. Model output is evidence, never a verdict.

### Stage 5 — Deterministic verdict gate (`src/gate.ts`, Section 5)

### Stage 6 — Proof Report build and seal (`src/report.ts`, Section 6)

## 4. Hybrid routing policy

ProofGate is a hybrid-inference product by design: deterministic code first, on-device Gemini Nano for the private instant pass, cloud Gemini only when escalation triggers fire. Routing itself is a pure function (`decideRoutingTier` in `src/modelAdapter.ts`) so routing decisions are replayable and appear in the report's evidence trail.

| Tier | When | What runs |
|---|---|---|
| `deterministic-only` | Claim shorter than 40 characters with no high-stakes markers. Plain prose where deterministic checks already ran and a model pass adds little. | Validators only. No model call, no data leaves the device. |
| `on-device` | Standard claims: everything not in the other two tiers. | Gemini Nano via Firebase AI Logic with hybrid inference set to prefer on-device. Instant, private, works offline where Nano is available. |
| `cloud` | Any escalation trigger fires (below). | Gemini cloud model via Firebase AI Logic (cloud-only for that claim), with the deterministic evidence attached as context. |

**Escalation triggers (any one suffices):**

1. **High-stakes markers** in the claim text: guarantee/absolute wording ("guaranteed", "always", "100%", "risk-free", "proven") or legal/medical/certification wording ("contract", "liable", "clinically", "certified").
2. **A deterministic warning** on the claim (for example a missing citation): the cloud pass gathers more context for the human reviewer.
3. **Length**: claims longer than 280 characters exceed the on-device comfort threshold for a reliable single pass.
4. **On-device unavailability or low confidence** (runtime rule for the UI phase): if the on-device pass reports that Nano is unavailable on this device, or returns `uncertain`, the claim escalates to cloud instead of silently passing. This is an adapter-level rule and is recorded in the report when it fires.

**Privacy posture:** text stays on-device unless a claim escalates. The UI must show, per claim, which tier ran, so the user can see exactly what left the device. Deterministic failures never need a model at all: a wrong line total fails on code evidence alone.

**Demo / mock mode:** when Firebase is not configured (no config object, local development, CI, or a judge opening the demo without a project), the engine runs with `MockModelAdapter`, a deterministic stand-in implementing the same `ModelAdapter` interface with documented heuristics and `source: "mock"` stamped on every output. The UI labels this mode honestly as demo mode. No API keys exist anywhere in the codebase; Firebase AI Logic is called through the Firebase JS SDK, not with raw Gemini API keys.

## 5. Deterministic gate rules

The gate (`gateClaim` in `src/gate.ts`) is the only component allowed to issue a verdict. It is pure code: same checks and model output in, same verdict out. Rules evaluate in order:

- **R1 — Hard failure.** Any check with status `fail` → **FAIL**. A model can never override this.
- **R2 — Confident model contradiction.** Model label `contradicts` with confidence ≥ 0.7 → **FAIL**.
- **R3 — Review signals.** Any check with status `warn`, or model `contradicts` below 0.7, or model `uncertain`, or model `supports` with confidence < 0.5 → **NEEDS REVIEW**.
- **R4 — Pass.** Otherwise → **PASS**, with the reason recorded.

Report-level verdict is worst-claim-wins: FAIL > NEEDS REVIEW > PASS.

Design intent: the gate fails closed on arithmetic, dates, units, and totals because those are recomputed facts, not opinions. It never fails a claim solely on a weak model signal; weak signals route to a human with the evidence attached.

## 6. Proof Report format

A Proof Report is a single JSON document, versioned as `proofgate.report/1` (`ProofReport` in `src/types.ts`):

```jsonc
{
  "version": "proofgate.report/1",
  "id": "pr_<first 16 hex of inputHash>",
  "createdAt": "2026-11-20T00:00:00.000Z",        // ISO-8601, injected clock
  "inputText": "<the pasted text, verbatim>",
  "inputHash": "<SHA-256 hex of inputText>",
  "claims": [
    {
      "claim": { "id": "c4", "index": 3, "text": "Design services: 3 units at $2,800 = $9,400.", "span": [89, 133] },
      "checks": [
        { "validator": "arithmetic", "claimId": "c4", "status": "fail",
          "detail": "Line total 3 × 2800 stated as 9400, recomputed value is 8400.",
          "evidence": { "kind": "line-total", "qty": 3, "price": 2800, "stated": 9400, "expected": 8400 } }
        // ... every other validator's result for this claim, including skips
      ],
      "modelOutput": { "claimId": "c4", "label": "supports", "confidence": 0.64,
                       "rationale": "Mock pass: no contradiction signals detected in claim shape.", "source": "mock", "modelId": "mock-deterministic-v1" },
      "verdict": "FAIL",
      "reasons": ["[R1] arithmetic: Line total 3 × 2800 stated as 9400, recomputed value is 8400."]
    }
  ],
  "summary": { "totalClaims": 5, "pass": 4, "needsReview": 0, "fail": 1, "overallVerdict": "FAIL" },
  "engine": { "name": "proofgate-core", "version": "0.1.0" },
  "contentHash": "<SHA-256 hex>"
}
```

Sealing and replay:

- `inputHash` = SHA-256 (node:crypto) of the verbatim input text.
- `contentHash` = SHA-256 of the canonical JSON of the whole report with `contentHash` itself excluded. Canonical JSON = object keys sorted recursively, arrays in order, no whitespace (`canonicalJson` in `src/report.ts`). Same logical report, same hash, on any machine.
- `verifyProofReport(report)` recomputes the seal; any tampering with inputs, checks, model outputs, or verdicts breaks verification. The test suite covers this.
- Replay = run the deterministic stages again over `inputText` with the recorded engine version and compare checks and verdicts. Model outputs are stored, not re-derived, because model behaviour is not deterministic; the gate verdict is reproducible from the stored outputs.
- A real sealed sample produced by the test invoice is committed at `sample-proof-report.json`.

## 7. Firebase AI Logic integration design (UI phase)

No Firebase project is connected yet. This section is the integration design the UI phase will implement; the core engine is already shaped around it (adapter interface, routing tiers, report schema).

- **SDK:** Firebase JS SDK (`firebase/app`, `firebase/ai`, `firebase/firestore`, `firebase/app-check`) in a Vite + React + TypeScript web app. Gemini access goes through **Firebase AI Logic** only; there are no Gemini API keys in client code or in this repo.
- **Hybrid inference:** `getAI(firebaseApp, { backend: new HybridBackend() })` style configuration per the Firebase AI Logic hybrid mode: on-device Gemini Nano is preferred where Chrome provides it, with cloud fallback managed by the SDK. ProofGate's own routing (Section 4) decides per claim whether a model call is warranted at all and whether it must be cloud; the adapter passes that intent to the SDK configuration for the call (`OnDeviceAdapter` vs `CloudAdapter` in `src/modelAdapter.ts` terms).
- **Adapters:** two production adapters will implement the existing `ModelAdapter` interface next to `MockModelAdapter`. Structured output: the model is asked for a JSON object matching `ModelOutput` (label, confidence, rationale) and the adapter validates the shape before the gate ever sees it; malformed model output is recorded as `uncertain` with the parse failure noted, never silently trusted.
- **App Check:** Firebase App Check (reCAPTCHA Enterprise / Play Integrity equivalent for web) is enabled on the Firebase project before any public demo, so cloud model calls and Firestore writes are restricted to the real app. This is a console step in the UI phase checklist, noted here so it is not forgotten.
- **Firestore persistence:** Proof Reports are stored as documents in a `proofReports` collection, keyed by report id, with the full report JSON as the document body plus denormalized `summary.overallVerdict`, `createdAt`, and `inputHash` fields for listing. Rules posture: reports are created by the app, read by id (share-by-link for the demo), no user content is indexed or used for anything else. Local-only mode (no persistence) remains available and is the default until a user chooses to save.
- **Graceful demo / mock mode:** if `import.meta.env` carries no Firebase config, the app boots in demo mode: `MockModelAdapter` runs, reports are kept in memory / localStorage only, and the UI shows a persistent "Demo mode — deterministic checks are real, model pass is a local mock" badge. This is also how judges can run the full flow with zero setup.
- **Sprint 2 cloud credits:** the hackathon-issued Google Cloud credits account is event-scoped and short-lived; the Firebase project for the demo will be created under it during the UI phase if it is still within its validity window, otherwise under the team's own project. Credentials for that account are not stored in this repo or in any log.

## 8. Devpost judging mapping

| Criterion | How ProofGate answers it |
|---|---|
| **Technological Implementation** | A real hybrid architecture, not a single API call: deterministic validator suite (arithmetic recomputation, calendar validation, unit conversion table, citation parsing, cross-document total reconciliation), per-claim hybrid routing between on-device Gemini Nano and cloud Gemini via Firebase AI Logic, a deterministic verdict gate that models cannot override, and a SHA-256-sealed, replayable Proof Report format. The core is framework-free TypeScript with 45 automated tests, including an end-to-end invoice case. |
| **Design** | (UI phase, brand-first: brand assets are being produced in parallel and the UI will be built to them.) The interaction design centres on evidence, not scores: claims are highlighted in place in the pasted text, each verdict expands to the recomputed numbers beside the stated ones, the routing tier is shown per claim so privacy is visible, and the Proof Report is a clean, shareable record. Verdict language is deliberately plain: PASS, NEEDS REVIEW, FAIL. |
| **Potential Impact** | The check happens at the exact moment errors enter workflows: before an invoice is paid, a quote is sent, or an AI answer is forwarded. The deterministic layer catches the most common and most costly class of errors (money math, dates, units, totals) instantly, privately, and for free on-device; the sealed report gives teams an audit trail for AI-assisted work, which matters more as generated text spreads into finance and operations. |
| **Quality of the Idea** | The idea is the division of labour: code checks what code can prove, models judge only what needs judgement, and a deterministic gate, not a model, has the final word. That inversion of the usual "ask the LLM to fact-check" pattern is what makes the output trustworthy enough to act on, and the Proof Report makes that trust inspectable after the fact. |

## 9. Scope boundaries and known limitations (honest list)

- Validators are pattern-based. Arithmetic is recomputed only when the text states an equation, a priced line total, or a percent-of figure in a recognised shape; prose like "three sessions at eight hundred each, so twenty-five hundred total" (words, no digits or `=`) is not recomputed in v0.1 and falls to the model tier and the gate's review path.
- Unit coverage is length, mass, storage, and time with common aliases; currency conversion is deliberately excluded (rates are not deterministic facts).
- Citation checking validates presence and form, not whether the source actually supports the claim; support is a model-tier and human-review question, and the gate treats it that way.
- The date validator checks calendar truth, weekday truth, and issue/due ordering. It does not judge business plausibility (for example a due date 3 days out) beyond ordering.
- Model adapters for live Firebase AI Logic, the UI, App Check enablement, and Firestore rules are the UI phase. Until then, all runs are demo mode with the mock adapter, and the reports say so via `modelOutput.source: "mock"`.
