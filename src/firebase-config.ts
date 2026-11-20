/**
 * Firebase project configuration for the ProofGate web app.
 *
 * EMPTY BY DEFAULT: no real project is connected, and no keys live in
 * this repo. To run against a live Firebase project, replace the null
 * below with that project's web config object (Firebase console ->
 * Project settings -> Your apps -> Web app). The web config is a public
 * identifier for the project, not a private secret, but it is still kept
 * out of version control here because no project has been provisioned
 * for ProofGate yet.
 *
 * While this is null (or incomplete), the app runs in demo mode with the
 * deterministic MockModelAdapter and labels every run as such.
 */
import type { FirebaseOptions } from "firebase/app";

export const firebaseConfig: FirebaseOptions | null = null;

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
