/**
 * Built-in sample inputs, one per source type. These are the samples the
 * web UI loads with its "Load sample" button. Every verdict the UI shows
 * for them is produced live by the engine; nothing here pre-computes or
 * hard-codes a result.
 *
 * The invoice sample is the canonical end-to-end case from the test
 * suite: it contains one planted arithmetic error
 * ("3 units at $2,800 = $9,400", recomputed 8,400) that the arithmetic
 * validator must FAIL.
 */

export type SourceType = "AI Answer" | "Quote" | "Invoice" | "Announcement";

export const SOURCE_TYPES: SourceType[] = ["AI Answer", "Quote", "Invoice", "Announcement"];

export const INVOICE_SAMPLE = [
  "Invoice Q-1042 from Acme Studio.",
  "Invoice date: 2026-11-10.",
  "Payment due date: 2026-12-10.",
  "Design services: 3 units at $2,800 = $9,400.",
  "The project lead is Maya Chen.",
].join("\n");

export const SAMPLES: Record<SourceType, string> = {
  Invoice: INVOICE_SAMPLE,
  "AI Answer": [
    "The migration will finish in 10 days, which is 240 hours of wall-clock time.",
    "According to a recent study, teams that adopt staged rollouts see 30% fewer incidents.",
    "The new plan costs $49 per user per month, so 20 users cost $980 per month.",
    "Storage grows from 500 GB to 1 TB, an increase of exactly 500 GB.",
  ].join("\n"),
  Quote: [
    "Vendor quote QT-2081, issued 2026-11-05.",
    "Implementation: 12 days at $950 = $11,400.",
    "Training: 2 sessions at $1,500 = $3,000.",
    "Subtotal: $14,400.",
    "Tax (10%): $1,440.",
    "Total: $15,840.",
  ].join("\n"),
  Announcement: [
    "Northline Mobility will open its Austin facility on 15 September 2026.",
    "The facility covers 10 km of test track, equal to 6.21 miles.",
    "The company guarantees the service will always be available, with zero downtime.",
    "The launch event is scheduled for Friday, September 18, 2026.",
  ].join("\n"),
};
