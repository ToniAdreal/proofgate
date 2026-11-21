/**
 * Firebase project configuration for the ProofGate web app.
 *
 * A live project is now provisioned: `proofgate-f1e4d`, the user's own
 * Firebase project on the free Spark plan, with Firebase AI Logic
 * enabled server-side via the Gemini Developer API at no cost (no Blaze
 * upgrade, no payment details). The values below are that project's web
 * config (Firebase console -> Project settings -> Your apps -> Web app).
 *
 * A Firebase web config is a public identifier for the project, not a
 * private secret: it ships in every built web bundle and merely tells
 * the SDK which project to talk to. Access control is enforced by
 * Firebase (API key restrictions, App Check, security rules), not by
 * hiding these values, so the config lives in the repo like any other
 * Firebase web app.
 *
 * The deterministic demo path is preserved: `createModelAdapter` still
 * falls back to the MockModelAdapter (and labels the run as demo mode)
 * whenever a config is absent/incomplete or the Firebase adapter fails
 * to initialise or run, and callers can pass an explicit null config to
 * force demo mode.
 */
import type { FirebaseOptions } from "firebase/app";

export const firebaseConfig: FirebaseOptions | null = {
  apiKey: "AIzaSyDTRSNOTm_Zff4qR9RU9KsWNjUB52ku1kw",
  authDomain: "proofgate-f1e4d.firebaseapp.com",
  projectId: "proofgate-f1e4d",
  storageBucket: "proofgate-f1e4d.firebasestorage.app",
  messagingSenderId: "639820381603",
  appId: "1:639820381603:web:671e5939afbfd3489f2e16",
};

/**
 * Firebase App Check DEBUG token for this web app, registered in the
 * Firebase console for project `proofgate-f1e4d` (App Check -> Apps ->
 * ProofGate Web -> debug tokens).
 *
 * Why it exists: the project's AI Logic backend rejects model calls
 * whose App Check token is missing or invalid (observed live as
 * "[401] Firebase App Check token is invalid"), and no reCAPTCHA
 * attestation provider is registered for this app. A registered debug
 * token is the documented way to run App Check from a demo build, and
 * the #BuildHybridAI event rules accept App Check debug tokens for
 * demos. `ensureAppCheck` in firebaseAi.ts hands this token to the
 * App Check SDK (browser only) before any AI Logic call.
 *
 * A debug token is NOT a credential: like the web config above, it is
 * an identifier that ships in the client bundle by design. It grants
 * no access by itself; it only lets App Check recognise this demo
 * build when the SDK exchanges it for a real App Check token
 * server-side.
 */
export const appCheckDebugToken: string | null = "9e831732-efd4-481c-85b9-9e9be7db5fb9";

/** True only when a config object carries the fields the SDK requires. */
export function isFirebaseConfigured(config: FirebaseOptions | null | undefined): boolean {
  return Boolean(
    config &&
      typeof config.apiKey === "string" &&
      config.apiKey.length > 0 &&
      typeof config.projectId === "string" &&
      config.projectId.length > 0 &&
      typeof config.appId === "string" &&
      config.appId.length > 0,
  );
}
