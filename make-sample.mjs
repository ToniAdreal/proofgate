import { writeFileSync } from "node:fs";
import { runProofGate } from "./dist/src/index.js";

const invoice = [
  "Invoice Q-1042 from Acme Studio.",
  "Invoice date: 2026-11-10.",
  "Payment due date: 2026-12-10.",
  "Design services: 3 units at $2,800 = $9,400.",
  "The project lead is Maya Chen.",
].join("\n");

const report = await runProofGate(invoice, { now: "2026-11-20T00:00:00.000Z" });
writeFileSync("sample-proof-report.json", JSON.stringify(report, null, 2) + "\n");
console.log("overall:", report.summary.overallVerdict, "| claims:", report.summary.totalClaims, "| fail:", report.summary.fail);
console.log("contentHash:", report.contentHash);
