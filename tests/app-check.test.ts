/**
 * App Check debug-token wiring: config shape and init guarding.
 *
 * The browser behaviour (debug-token exchange against the live
 * project) cannot run under Node; what these tests pin down is that
 * (a) a well-formed debug token is configured for the demo project,
 * and (b) ensureAppCheck is fully guarded outside a browser — it
 * never initialises, never touches the debug-token global, and never
 * throws — so tests, scripts, and the mock path are unaffected.
 */
import { describe, expect, it } from "vitest";
import type { FirebaseApp } from "firebase/app";
import { appCheckDebugToken, firebaseConfig, isFirebaseConfigured } from "../src/firebase-config.js";
import { ensureAppCheck, FirebaseAiAdapter } from "../src/firebaseAi.js";

describe("App Check debug token config", () => {
  it("ships a UUID-shaped debug token for the demo project", () => {
    expect(appCheckDebugToken).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("leaves the Firebase web config complete and unchanged in shape", () => {
    expect(isFirebaseConfigured(firebaseConfig)).toBe(true);
    expect(firebaseConfig?.projectId).toBe("proofgate-f1e4d");
  });
});

describe("ensureAppCheck guarding (Node environment)", () => {
  it("skips initialisation outside a browser and does not set the debug global", () => {
    const status = ensureAppCheck({} as FirebaseApp);
    expect(status.outcome).toBe("skipped-not-browser");
    expect(
      (globalThis as { FIREBASE_APPCHECK_DEBUG_TOKEN?: unknown }).FIREBASE_APPCHECK_DEBUG_TOKEN,
    ).toBeUndefined();
  });

  it("is repeat-safe: further calls still skip without throwing", () => {
    const app = {} as FirebaseApp;
    expect(() => ensureAppCheck(app)).not.toThrow();
    expect(ensureAppCheck(app).outcome).toBe("skipped-not-browser");
  });

  it("the adapter records the skipped outcome instead of throwing", () => {
    const adapter = new FirebaseAiAdapter(
      { apiKey: "test-key", projectId: "test-project", appId: "1:0:web:test" },
      { callTimeoutMs: 50 },
    );
    expect(adapter.appCheckInit.outcome).toBe("skipped-not-browser");
  });
});
