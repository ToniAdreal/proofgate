# ProofGate Brand Notes (ChatGPT brand stage, 2026-11-20)

Source: ChatGPT session (Plus, Jere Ma; highest reasoning model, Thinking High) https://chatgpt.com/c/6b0071e3-9a0c-83ea-916f-d0062c50d048
Figma: https://www.figma.com/design/hdJMt2V1h2mT9V6IOYuV7i (ProofGate — UI Design System & Three Desktop Screens; frames 01 New Verification / 02 Proof Report / 03 History & Replay, 1440px)
Assets in brand/: logo-icon.png, logo-lockup.png, screen-1-new-verification.png, screen-2-proof-report.png, screen-3-history-replay.png. Both logos visually verified by main agent 2026-11-20 (icon: blue shield/gate with white check, no text; lockup spells "ProofGate" correctly).

## Brand definition
- What: claim-verification workspace for AI output. Paste an AI answer, quote, invoice or announcement; ProofGate splits it into atomic claims, runs deterministic checks first (numbers, dates, units, citations, arithmetic), uses on-device Gemini Nano for a private first pass, escalates only unresolved claims to cloud Gemini. Every claim gets PASS / NEEDS REVIEW / FAIL with evidence, saved as a replayable Proof Report. A verification layer, not a content generator or fact-checking search engine.
- Industry: AI trust and verification (applied AI / developer tools / productivity).
- Target users: professionals and teams who must check AI output before acting on it (analysts, operations and finance, legal and compliance, product and engineering, communications).
- Positioning: trust through evidence, not authority. Deterministic, inspectable, repeatable; privacy by default (on-device first, cloud only when needed); clear audit trail.
- Mission: "To make every AI-generated claim checkable before it is trusted, by giving professionals a fast, private and replayable way to verify evidence."
- Tagline: "Verify before you trust." Voice: precise, calm, engineering-grade.

## Theme color (exactly one)
- #2457A6 Verification Blue. Primary actions, active navigation, key indicators, links only. Never for verdicts, never as a large background. Hover #1C4A8C.

## Palette (derived from #2457A6)
- Canvas #F8FAFC; Surface #FFFFFF; Muted surface #F2F5F9; Neutral subtle #E5EBF3; Neutral strong #CBD5E1; Theme tint #EAF1FB (active states, selected rows only)
- Borders: subtle #E2E8F0; default #D8E1EC; strong #B8C6D8
- Text: primary #142033; secondary #475569; tertiary #64748B; inverse #FFFFFF
- Verdicts (never mixed with brand blue): PASS fg #166A48 / bg #EAF7F0; NEEDS REVIEW fg #9A6500 / bg #FFF6DB; FAIL fg #B42338 / bg #FDECEE

## Fonts (free for commercial use, SIL OFL 1.1)
- Latin/UI: Inter (400/500/600/700). Chinese: Noto Sans SC (400/500/700).
- Stack: "Inter", "Noto Sans SC", system-ui, -apple-system, "Segoe UI", sans-serif.

## Design spec (summary; full spec in the ChatGPT session and Figma)
- Desktop-first 1440x900; fixed left sidebar 240px; content max 1152px; 12-col grid, 24px gutters and page padding; spacing 4pt scale 8/12/16/24/32/48; card radius 12px, buttons/inputs 8px, verdict chips pill 999px; card padding 24px, gap 16px.
- Primary button: #2457A6 bg, white text, 48px high, radius 8px. Secondary: white bg, #D8E1EC border, #142033 text. Inputs: white, #D8E1EC border, focus ring 2px #2457A6 offset 2px. Nav item: 14/20 weight 500 #475569; active #EAF1FB bg, #2457A6 text, 4px left indicator. Verdict chips: 12/16 weight 600 uppercase pill.
- Type: H1 32/40 700; H2 24/32 700; H3 20/28 700; Body 16/24 400; Small 14/20; Caption 12/16; Button 16/24 600; Mono 14/20. Noto Sans SC body 16/24, headings 20/28 700. No gradients, no decorative color.
- Screen 1 New Verification: input card (source-type segmented control AI Answer / Quote / Invoice / Announcement, paste area min 240px, Clear / Load sample, Verify) + right column Verification Pipeline (5 steps), Runtime Indicators (Nano Ready, Cloud On demand), Expected Output; claim-splitting progress above.
- Screen 2 Proof Report: header (title, source type, date, processing mode, Export / Replay), Report complete chip, three verdict summary cards, per-claim cards with verdict badge, Evidence box, Deterministic checks list (Numbers, Dates, Citations, Arithmetic).
- Screen 3 History & Replay: search/filter (title/claim/source, verdict, source type, date), stats (reports last 30 days, replays run, reports passed), table (title, source type, date, verdicts, status, Replay).

## Known mock flaw (do not replicate in the real UI)
Screen 1 mockup's Expected Output preview says the facility will create 500 jobs while the pasted input says 120 jobs. Illustration inconsistency only; the real UI renders actual engine output.
