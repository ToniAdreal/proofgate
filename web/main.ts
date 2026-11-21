/**
 * ProofGate web UI (plain DOM + Vite). Three screens per BRAND_NOTES.md:
 * New Verification, Proof Report, History & Replay.
 *
 * Every verdict rendered here comes from the real core engine
 * (runProofGate in src/). The model adapter is created once from the
 * Firebase config: a live Firebase AI Logic adapter when a complete
 * config exists, otherwise the deterministic mock, and the UI labels
 * demo mode honestly in the Runtime Indicators and in each report's
 * processing mode (derived from the model outputs actually recorded).
 */
import "./styles.css";
import {
  runProofGate,
  verifyProofReport,
  splitClaims,
  SAMPLES,
  SOURCE_TYPES,
  addToHistory,
  loadHistory,
  updateHistoryEntry,
  removeFromHistory,
  filterHistory,
  historyStats,
  compareReplay,
  processingModeLabel,
  deriveReportTitle,
  type EngineProgressEvent,
  type HistoryEntry,
  type ProofReport,
  type ReplayComparison,
  type SourceType,
  type Verdict,
} from "../src/index.js";
import { createModelAdapter } from "../src/firebaseAi.js";

/* ------------------------------ setup -------------------------------- */

const { adapter, status } = createModelAdapter();

type Screen = "new" | "report" | "history";

interface AppState {
  screen: Screen;
  sourceType: SourceType;
  inputText: string;
  running: boolean;
  /** Visible run failure (engine-level), shown as a banner; null when none. */
  error: string | null;
  pipeline: Array<"pending" | "in-progress" | "done">;
  currentReport: ProofReport | null;
  currentSourceType: SourceType;
  reportReplay: ReplayComparison | null;
  history: HistoryEntry[];
  historyQuery: string;
  historyVerdict: Verdict | "ALL";
  historySource: SourceType | "ALL";
  historyDays: number | undefined;
  historyReplay: { key: string; title: string; comparison: ReplayComparison } | null;
}

const state: AppState = {
  screen: "new",
  sourceType: "Invoice",
  inputText: "",
  running: false,
  error: null,
  pipeline: ["pending", "pending", "pending", "pending", "pending"],
  currentReport: null,
  currentSourceType: "Invoice",
  reportReplay: null,
  history: loadHistory(window.localStorage),
  historyQuery: "",
  historyVerdict: "ALL",
  historySource: "ALL",
  historyDays: undefined,
  historyReplay: null,
};

const PIPELINE_STEPS = [
  "Split into atomic claims",
  "Deterministic checks",
  "On-device Gemini Nano first pass",
  "Escalate to cloud Gemini only when needed",
  "Generate Proof Report",
];

const CHECK_LABELS: Record<string, string> = {
  arithmetic: "Arithmetic",
  dates: "Dates",
  units: "Units",
  citations: "Citations",
  "numeric-consistency": "Numbers",
};

/* ----------------------------- helpers ------------------------------- */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : `${fmtDate(iso)}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

function verdictChip(verdict: Verdict): string {
  const cls =
    verdict === "PASS" ? "chip-pass" : verdict === "FAIL" ? "chip-fail" : "chip-review";
  const symbol = verdict === "PASS" ? "✓" : verdict === "FAIL" ? "✕" : "⚠";
  return `<span class="chip ${cls}">${symbol} ${esc(verdict)}</span>`;
}

function checkStatusChip(status: string): string {
  switch (status) {
    case "pass":
      return `<span class="chip chip-pass">Pass</span>`;
    case "fail":
      return `<span class="chip chip-fail">Fail</span>`;
    case "warn":
      return `<span class="chip chip-review">Needs review</span>`;
    default:
      return `<span class="chip chip-neutral">N/A</span>`;
  }
}

function claimLabel(id: string): string {
  const n = Number.parseInt(id.replace(/\D/g, ""), 10);
  return `Claim C-${Number.isNaN(n) ? id : String(n).padStart(2, "0")}`;
}

function el<T extends HTMLElement>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`Missing element: ${selector}`);
  return node;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function errorBannerHtml(): string {
  return state.error
    ? `<div class="error-banner" role="alert"><strong>Something went wrong.</strong> ${esc(state.error)}</div>`
    : "";
}

/* ------------------------------ actions ------------------------------ */

async function onVerify(): Promise<void> {
  const text = state.inputText;
  if (!text.trim() || state.running) return;
  state.running = true;
  state.error = null;
  state.pipeline = ["in-progress", "pending", "pending", "pending", "pending"];
  renderScreen();

  // Drive the visible pipeline from the engine's real progress events.
  // (Steps used to advance on a fixed timer, which marked the model
  // passes "Done" while a model call was still pending — forever, when
  // the call never settled. Every engine await is bounded now, and the
  // indicators only move when the work actually completes.)
  let onDeviceLeft = 0;
  let cloudLeft = 0;
  const onProgress = (event: EngineProgressEvent): void => {
    if (event.type === "split") {
      state.pipeline[0] = "done";
      state.pipeline[1] = "in-progress";
    } else if (event.type === "checks-complete") {
      onDeviceLeft = event.onDeviceClaims;
      cloudLeft = event.cloudClaims;
      state.pipeline[1] = "done";
      state.pipeline[2] = onDeviceLeft > 0 ? "in-progress" : "done";
      state.pipeline[3] =
        cloudLeft > 0 ? (onDeviceLeft > 0 ? "pending" : "in-progress") : "done";
      if (onDeviceLeft === 0 && cloudLeft === 0) state.pipeline[4] = "in-progress";
    } else if (event.type === "model-claim-complete") {
      if (event.tier === "on-device") {
        onDeviceLeft = Math.max(0, onDeviceLeft - 1);
        if (onDeviceLeft === 0) {
          state.pipeline[2] = "done";
          if (cloudLeft > 0) state.pipeline[3] = "in-progress";
        }
      } else if (event.tier === "cloud") {
        cloudLeft = Math.max(0, cloudLeft - 1);
        if (cloudLeft === 0) state.pipeline[3] = "done";
      }
    } else if (event.type === "model-complete") {
      state.pipeline[2] = "done";
      state.pipeline[3] = "done";
      state.pipeline[4] = "in-progress";
    }
    renderSidePanel();
  };

  try {
    const report = await runProofGate(text, { adapter, onProgress });
    state.pipeline = PIPELINE_STEPS.map(() => "done");
    state.currentReport = report;
    state.currentSourceType = state.sourceType;
    state.reportReplay = null;
    try {
      state.history = addToHistory(
        window.localStorage,
        report,
        state.sourceType,
        new Date().toISOString(),
      );
    } catch {
      // Persistence is best-effort: localStorage can be full or blocked,
      // and history saving must never strand a completed report.
    }
    state.screen = "report";
  } catch (err) {
    // The engine records model failures per claim and resolves, so this
    // only fires on a genuinely unexpected error — surface it visibly
    // instead of leaving the pipeline spinning.
    state.error = `Verification failed: ${errorMessage(err)}`;
    state.pipeline = ["pending", "pending", "pending", "pending", "pending"];
  } finally {
    state.running = false;
  }
  renderApp();
}

async function replayAndCompare(report: ProofReport): Promise<ReplayComparison> {
  const replayed = await runProofGate(report.inputText, { adapter });
  return compareReplay(report, replayed);
}

function recordReplay(report: ProofReport, comparison: ReplayComparison): void {
  try {
    const entry = state.history.find((e) => e.key === report.contentHash);
    if (!entry) return;
    state.history = updateHistoryEntry(window.localStorage, entry.key, {
      replayCount: entry.replayCount + 1,
      lastReplayAt: new Date().toISOString(),
      lastReplayMatches: comparison.matches,
    });
  } catch {
    // Best-effort bookkeeping only; a storage failure must not break replay.
  }
}

async function onReplayCurrent(): Promise<void> {
  if (!state.currentReport || state.running) return;
  state.running = true;
  state.error = null;
  renderScreen();
  try {
    const comparison = await replayAndCompare(state.currentReport);
    state.reportReplay = comparison;
    recordReplay(state.currentReport, comparison);
  } catch (err) {
    state.error = `Replay failed: ${errorMessage(err)}`;
  } finally {
    state.running = false;
  }
  renderApp();
}

async function onReplayHistory(entry: HistoryEntry): Promise<void> {
  if (state.running) return;
  state.running = true;
  state.error = null;
  renderScreen();
  try {
    const comparison = await replayAndCompare(entry.report);
    state.historyReplay = { key: entry.key, title: entry.title, comparison };
    recordReplay(entry.report, comparison);
  } catch (err) {
    state.error = `Replay failed: ${errorMessage(err)}`;
  } finally {
    state.running = false;
  }
  renderApp();
}

function onExport(report: ProofReport): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `proofgate-report-${report.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------ chrome ------------------------------- */

function renderApp(): void {
  const app = el<HTMLDivElement>("#app");
  app.innerHTML = `
    <header class="topbar">
      <img class="lockup" src="/logo-lockup.png" alt="ProofGate" />
      <div class="spacer"></div>
      ${
        status.mode === "mock"
          ? `<span class="chip chip-review">Demo mode (mock model)</span>`
          : `<span class="chip chip-pass">Firebase AI Logic configured</span>`
      }
    </header>
    <nav class="sidebar">
      <button class="nav-item ${state.screen === "new" ? "active" : ""}" data-nav="new">▣&nbsp; New Verification</button>
      <button class="nav-item ${state.screen === "report" ? "active" : ""}" data-nav="report">▥&nbsp; Reports</button>
      <button class="nav-item ${state.screen === "history" ? "active" : ""}" data-nav="history">◷&nbsp; History &amp; Replay</button>
      <div class="side-note">Verify before you trust.<br />Deterministic checks first, models second, a deterministic gate decides.</div>
    </nav>
    <main class="content"><div class="content-inner" id="screen"></div></main>
  `;
  app.querySelectorAll<HTMLElement>("[data-nav]").forEach((node) => {
    node.addEventListener("click", () => {
      state.screen = node.dataset.nav as Screen;
      renderApp();
    });
  });
  renderScreen();
}

function renderScreen(): void {
  const screen = document.querySelector<HTMLElement>("#screen");
  if (!screen) return;
  if (state.screen === "new") renderNewVerification(screen);
  else if (state.screen === "report") renderReport(screen);
  else renderHistory(screen);
}

/* ------------------------- screen 1: new ----------------------------- */

function pipelineHtml(): string {
  const tagFor = (s: string) =>
    s === "done"
      ? `<span class="status-tag green">Done</span>`
      : s === "in-progress"
        ? `<span class="status-tag blue">In progress</span>`
        : `<span class="status-tag">Pending</span>`;
  return PIPELINE_STEPS.map((name, i) => {
    const s = state.pipeline[i];
    return `<li class="${s === "done" ? "done" : s === "in-progress" ? "in-progress" : ""}">
      <span class="dot">${s === "done" ? "✓" : ""}</span>
      <span class="step-name">${i + 1}. ${esc(name)}</span>${tagFor(s)}
    </li>`;
  }).join("");
}

function runtimeHtml(): string {
  const mock = status.mode === "mock";
  return `
    <div class="runtime-row">
      <div class="grow">
        <div class="rt-title">On-device Gemini Nano</div>
        <div class="rt-sub">Private first pass via Firebase AI Logic hybrid inference</div>
      </div>
      ${mock ? `<span class="status-tag amber">Demo mode (mock)</span>` : `<span class="status-tag blue">Configured</span>`}
    </div>
    <div class="runtime-row">
      <div class="grow">
        <div class="rt-title">Cloud escalation</div>
        <div class="rt-sub">Triggered only for unresolved or high-stakes claims</div>
      </div>
      <span class="status-tag">On demand</span>
    </div>
    <p class="small muted" style="margin:12px 0 0">${esc(status.detail)}</p>
  `;
}

function sidePanelHtml(): string {
  const last = state.currentReport;
  return `
    <div class="card">
      <h3 style="margin-bottom:12px">Verification Pipeline</h3>
      <ol class="pipeline">${pipelineHtml()}</ol>
    </div>
    <div class="card">
      <h3 style="margin-bottom:12px">Runtime Indicators</h3>
      ${runtimeHtml()}
    </div>
    <div class="card">
      <h3 style="margin-bottom:12px">Expected Output</h3>
      ${
        last
          ? `<div class="verdict-counts" style="margin-bottom:8px">
               ${verdictChip(last.summary.overallVerdict)}
               <span class="chip chip-pass">Pass ${last.summary.pass}</span>
               <span class="chip chip-review">Review ${last.summary.needsReview}</span>
               <span class="chip chip-fail">Fail ${last.summary.fail}</span>
             </div>
             <p class="small muted" style="margin:0">Latest run: ${esc(deriveReportTitle(last))}. Open the Reports tab for the full Proof Report.</p>`
          : `<p class="small muted" style="margin:0">A Proof Report with a verdict and evidence for every claim: PASS, NEEDS REVIEW, or FAIL, sealed with a SHA-256 content hash so it can be replayed and re-verified.</p>`
      }
    </div>
  `;
}

function renderSidePanel(): void {
  const aside = document.querySelector<HTMLElement>("#side-panel");
  if (aside) aside.innerHTML = sidePanelHtml();
}

function renderNewVerification(screen: HTMLElement): void {
  const claimCount = splitClaims(state.inputText).length;
  screen.innerHTML = `
    <div class="page-head">
      <h1>New Verification</h1>
      <p>Paste content to extract claims and verify before you trust.</p>
    </div>
    ${errorBannerHtml()}
    ${
      status.mode === "mock"
        ? `<div class="demo-banner"><strong>Demo mode (mock model).</strong> ${esc(status.detail)}</div>`
        : `<div class="firebase-banner">${esc(status.detail)}</div>`
    }
    <div class="card" style="margin-bottom:16px">
      <div class="progress-row">
        <strong class="small">Claim splitting progress</strong>
        <div class="progress-track"><div class="progress-fill" id="claim-progress" style="width:${claimCount > 0 ? 100 : 0}%"></div></div>
        <span class="small muted" id="claim-count">${claimCount} claims extracted</span>
      </div>
    </div>
    <div class="grid-main">
      <div class="card">
        <h3 style="margin-bottom:16px">Input Content</h3>
        <div class="segmented" role="tablist" aria-label="Source type">
          ${SOURCE_TYPES.map(
            (t) =>
              `<button class="seg-btn ${t === state.sourceType ? "active" : ""}" data-source="${esc(t)}">${esc(t)}</button>`,
          ).join("")}
        </div>
        <textarea class="input-area" id="input-area" placeholder="Paste an AI answer, quote, invoice, or announcement to verify its claims…">${esc(state.inputText)}</textarea>
        <p class="small faint" style="margin:8px 0 0">ProofGate will split this into atomic claims and run deterministic checks first.</p>
        <div class="input-actions">
          <button class="btn" id="btn-clear">Clear</button>
          <button class="btn" id="btn-sample">Load sample</button>
          <div class="spacer"></div>
          <button class="btn btn-primary" id="btn-verify" ${state.running ? "disabled" : ""}>${state.running ? "Verifying…" : "Verify"}</button>
        </div>
      </div>
      <aside id="side-panel">${sidePanelHtml()}</aside>
    </div>
  `;

  screen.querySelectorAll<HTMLElement>("[data-source]").forEach((node) => {
    node.addEventListener("click", () => {
      state.sourceType = node.dataset.source as SourceType;
      renderScreen();
    });
  });
  const area = el<HTMLTextAreaElement>("#input-area");
  area.addEventListener("input", () => {
    state.inputText = area.value;
    const n = splitClaims(area.value).length;
    const count = document.querySelector<HTMLElement>("#claim-count");
    if (count) count.textContent = `${n} claims extracted`;
    const fill = document.querySelector<HTMLElement>("#claim-progress");
    if (fill) fill.style.width = n > 0 ? "100%" : "0%";
  });
  el<HTMLButtonElement>("#btn-clear").addEventListener("click", () => {
    state.inputText = "";
    renderScreen();
  });
  el<HTMLButtonElement>("#btn-sample").addEventListener("click", () => {
    state.inputText = SAMPLES[state.sourceType];
    renderScreen();
  });
  el<HTMLButtonElement>("#btn-verify").addEventListener("click", () => {
    void onVerify();
  });
}

/* ------------------------- screen 2: report -------------------------- */

function evidenceKv(evidence: Record<string, unknown>): string {
  const entries = Object.entries(evidence);
  if (entries.length === 0) return "";
  const text = entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" · ");
  return `<div class="kv">${esc(text)}</div>`;
}

function claimCard(cv: ProofReport["claims"][number]): string {
  const model = cv.modelOutput;
  const checkRows = cv.checks
    .map(
      (c) => `<div class="check-row">
        <div class="check-main">
          <span class="check-label">${esc(CHECK_LABELS[c.validator] ?? c.validator)}:</span>
          ${esc(c.detail)}
          ${c.status === "fail" || c.status === "warn" ? evidenceKv(c.evidence) : ""}
        </div>
        ${checkStatusChip(c.status)}
      </div>`,
    )
    .join("");
  return `
    <div class="card claim-card">
      <div class="claim-head">
        <span class="chip chip-tint">${esc(claimLabel(cv.claim.id))}</span>
        <span class="claim-text">${esc(cv.claim.text)}</span>
        ${verdictChip(cv.verdict)}
      </div>
      <div class="claim-body">
        <div class="evidence-box">
          <h4>Evidence</h4>
          <ul>${cv.reasons.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
          ${
            model
              ? `<p style="margin:12px 0 0"><strong>Model pass</strong> (${esc(model.source)} · ${esc(model.modelId)})${model.failure ? ` <span class="chip chip-fail">Unavailable</span>` : ""}: ${esc(model.label)}, confidence ${model.confidence.toFixed(2)}.<br />${esc(model.rationale)}</p>`
              : `<p style="margin:12px 0 0"><strong>Model pass:</strong> not run for this claim (deterministic-only routing).</p>`
          }
        </div>
        <div class="checks-box">
          <h4>Deterministic checks</h4>
          ${checkRows}
        </div>
      </div>
    </div>
  `;
}

function replayResultHtml(comparison: ReplayComparison): string {
  if (comparison.matches) {
    return `<div class="replay-result ok"><strong>Replay matched.</strong> Re-running the pipeline reproduced every verdict (overall ${esc(comparison.replayOverall)}).</div>`;
  }
  const changed = comparison.claims.filter((c) => c.changed);
  return `<div class="replay-result diff"><strong>Replay differs on ${comparison.changedCount} claim(s).</strong>
    <ul>${changed
      .map(
        (c) =>
          `<li>${esc(claimLabel(c.claimId))}: ${esc(c.originalVerdict)} → ${esc(c.replayVerdict ?? "missing")} — ${esc(c.claimText)}</li>`,
      )
      .join("")}</ul></div>`;
}

function renderReport(screen: HTMLElement): void {
  const report = state.currentReport;
  if (!report) {
    screen.innerHTML = `
      <div class="page-head"><h1>Proof Report</h1><p>Replayable verification results for the submitted content.</p></div>
      <div class="card empty-state">
        <h3>No report yet</h3>
        <p>Run a verification first, and its Proof Report will appear here.</p>
        <button class="btn btn-primary" id="go-new">Start a verification</button>
      </div>`;
    el<HTMLButtonElement>("#go-new").addEventListener("click", () => {
      state.screen = "new";
      renderApp();
    });
    return;
  }

  const sealOk = verifyProofReport(report);
  screen.innerHTML = `
    <div class="page-head">
      <h1>Proof Report</h1>
      <p>Replayable verification results for the submitted content.</p>
    </div>
    ${errorBannerHtml()}
    <div class="card">
      <div class="report-meta">
        <div><h3>${esc(deriveReportTitle(report))}</h3></div>
        <div class="meta-block"><div class="caption">Source</div><span class="chip chip-outline">${esc(state.currentSourceType)}</span></div>
        <div class="meta-block"><div class="caption">Created</div><span class="small">${esc(fmtDateTime(report.createdAt))}</span></div>
        <div class="meta-block"><div class="caption">Processing mode</div><span class="small">${esc(processingModeLabel(report))}</span></div>
        <div class="spacer"></div>
        <button class="btn btn-small" id="btn-export">Export JSON</button>
        <button class="btn btn-primary btn-small" id="btn-replay" ${state.running ? "disabled" : ""}>${state.running ? "Replaying…" : "Replay report"}</button>
      </div>
      <div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap">
        <span class="chip chip-pass">✓ Report complete</span>
        ${verdictChip(report.summary.overallVerdict)}
        <span class="chip ${sealOk ? "chip-tint" : "chip-fail"}">${sealOk ? "Seal verified (SHA-256)" : "Seal broken"}</span>
        <span class="chip chip-outline mono">${esc(report.id)}</span>
      </div>
      <div class="small muted mono" style="margin-top:10px; word-break:break-all">Content hash (SHA-256): ${esc(report.contentHash)}</div>
      <div class="summary-grid">
        <div class="summary-card pass"><span class="chip chip-pass">✓ Pass</span><div class="count">${report.summary.pass} claims</div></div>
        <div class="summary-card review"><span class="chip chip-review">⚠ Needs review</span><div class="count">${report.summary.needsReview} claims</div></div>
        <div class="summary-card fail"><span class="chip chip-fail">✕ Fail</span><div class="count">${report.summary.fail} claims</div></div>
      </div>
      ${state.reportReplay ? replayResultHtml(state.reportReplay) : ""}
    </div>
    ${report.claims.map(claimCard).join("")}
  `;
  el<HTMLButtonElement>("#btn-export").addEventListener("click", () => onExport(report));
  el<HTMLButtonElement>("#btn-replay").addEventListener("click", () => {
    void onReplayCurrent();
  });
}

/* ------------------------- screen 3: history ------------------------- */

function statusChipFor(overall: Verdict): string {
  if (overall === "PASS") return `<span class="chip chip-pass">Complete</span>`;
  if (overall === "FAIL") return `<span class="chip chip-fail">Failed</span>`;
  return `<span class="chip chip-review">Needs Review</span>`;
}

function renderHistory(screen: HTMLElement): void {
  const stats = historyStats(state.history, new Date().toISOString());
  const filtered = filterHistory(state.history, {
    query: state.historyQuery,
    verdict: state.historyVerdict,
    sourceType: state.historySource,
    withinDays: state.historyDays,
    now: new Date().toISOString(),
  });

  const rows = filtered
    .map((entry) => {
      const s = entry.report.summary;
      return `<tr>
        <td>
          <div class="row-title">${esc(entry.title)}</div>
          <div class="row-sub">${esc(entry.report.claims[0]?.claim.text ?? "")}</div>
          ${entry.replayCount > 0 ? `<div class="row-sub">Replayed ${entry.replayCount}× · last replay ${entry.lastReplayMatches ? "matched" : "differed"}</div>` : ""}
        </td>
        <td><span class="chip chip-outline">${esc(entry.sourceType)}</span></td>
        <td>${esc(fmtDate(entry.savedAt))}</td>
        <td><div class="verdict-counts">
          <span class="chip chip-pass">Pass ${s.pass}</span>
          <span class="chip chip-review">Review ${s.needsReview}</span>
          <span class="chip chip-fail">Fail ${s.fail}</span>
        </div></td>
        <td>${statusChipFor(s.overallVerdict)}</td>
        <td><div class="row-actions">
          <button class="btn btn-small" data-view="${esc(entry.key)}">View</button>
          <button class="btn btn-small" data-replay="${esc(entry.key)}" ${state.running ? "disabled" : ""}>▶ Replay</button>
          <button class="btn btn-small" data-delete="${esc(entry.key)}">Delete</button>
        </div></td>
      </tr>`;
    })
    .join("");

  screen.innerHTML = `
    <div class="page-head">
      <h1>History &amp; Replay</h1>
      <p>Search, filter, and rerun previous Proof Reports.</p>
    </div>
    <div class="card">
      <h3 style="margin-bottom:16px">Recent activity</h3>
      <div class="stats-row">
        <div class="stat-cell"><div class="stat-icon">▥</div><div><div class="stat-num">${stats.reportsLast30Days}</div><div class="stat-label">Reports (last 30 days)</div></div></div>
        <div class="stat-cell"><div class="stat-icon">▶</div><div><div class="stat-num">${stats.replaysRun}</div><div class="stat-label">Replays run</div></div></div>
        <div class="stat-cell"><div class="stat-icon">✓</div><div><div class="stat-num">${stats.reportsPassed}</div><div class="stat-label">Reports passed (all claims)</div></div></div>
      </div>
      <div class="filter-row">
        <input type="search" id="history-search" placeholder="Search reports by title, claim, or source" value="${esc(state.historyQuery)}" />
        <select id="history-verdict">
          <option value="ALL" ${state.historyVerdict === "ALL" ? "selected" : ""}>All verdicts</option>
          <option value="PASS" ${state.historyVerdict === "PASS" ? "selected" : ""}>PASS</option>
          <option value="NEEDS REVIEW" ${state.historyVerdict === "NEEDS REVIEW" ? "selected" : ""}>NEEDS REVIEW</option>
          <option value="FAIL" ${state.historyVerdict === "FAIL" ? "selected" : ""}>FAIL</option>
        </select>
        <select id="history-source">
          <option value="ALL" ${state.historySource === "ALL" ? "selected" : ""}>All source types</option>
          ${SOURCE_TYPES.map((t) => `<option value="${esc(t)}" ${state.historySource === t ? "selected" : ""}>${esc(t)}</option>`).join("")}
        </select>
        <select id="history-days">
          <option value="all" ${state.historyDays === undefined ? "selected" : ""}>All time</option>
          <option value="7" ${state.historyDays === 7 ? "selected" : ""}>Last 7 days</option>
          <option value="30" ${state.historyDays === 30 ? "selected" : ""}>Last 30 days</option>
        </select>
        <div class="spacer"></div>
        <span class="chip chip-tint">${filtered.length} reports</span>
      </div>
    </div>
    ${
      state.historyReplay
        ? `<div class="card"><h3 style="margin-bottom:8px">Replay — ${esc(state.historyReplay.title)}</h3>${replayResultHtml(state.historyReplay.comparison)}</div>`
        : ""
    }
    <div class="card">
      ${
        state.history.length === 0
          ? `<div class="empty-state"><h3>No reports in history</h3><p>Reports you generate are stored locally in this browser and listed here.</p></div>`
          : filtered.length === 0
            ? `<div class="empty-state"><h3>No reports match the current filters</h3><p>Try a different search or filter.</p></div>`
            : `<table class="history-table">
                <thead><tr><th>Report title</th><th>Source type</th><th>Date</th><th>Verdict (claims)</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>`
      }
    </div>
  `;

  const search = screen.querySelector<HTMLInputElement>("#history-search");
  search?.addEventListener("input", () => {
    state.historyQuery = search.value;
    // Re-render the table only via a full screen render, keeping focus simple:
    renderScreen();
    const again = document.querySelector<HTMLInputElement>("#history-search");
    again?.focus();
    again?.setSelectionRange(again.value.length, again.value.length);
  });
  screen.querySelector<HTMLSelectElement>("#history-verdict")?.addEventListener("change", (e) => {
    state.historyVerdict = (e.target as HTMLSelectElement).value as Verdict | "ALL";
    renderScreen();
  });
  screen.querySelector<HTMLSelectElement>("#history-source")?.addEventListener("change", (e) => {
    state.historySource = (e.target as HTMLSelectElement).value as SourceType | "ALL";
    renderScreen();
  });
  screen.querySelector<HTMLSelectElement>("#history-days")?.addEventListener("change", (e) => {
    const v = (e.target as HTMLSelectElement).value;
    state.historyDays = v === "all" ? undefined : Number.parseInt(v, 10);
    renderScreen();
  });
  screen.querySelectorAll<HTMLElement>("[data-view]").forEach((node) => {
    node.addEventListener("click", () => {
      const entry = state.history.find((e) => e.key === node.dataset.view);
      if (!entry) return;
      state.currentReport = entry.report;
      state.currentSourceType = entry.sourceType;
      state.reportReplay = null;
      state.screen = "report";
      renderApp();
    });
  });
  screen.querySelectorAll<HTMLElement>("[data-replay]").forEach((node) => {
    node.addEventListener("click", () => {
      const entry = state.history.find((e) => e.key === node.dataset.replay);
      if (entry) void onReplayHistory(entry);
    });
  });
  screen.querySelectorAll<HTMLElement>("[data-delete]").forEach((node) => {
    node.addEventListener("click", () => {
      state.history = removeFromHistory(window.localStorage, node.dataset.delete as string);
      renderScreen();
    });
  });
}

/* ------------------------------- boot -------------------------------- */

renderApp();
