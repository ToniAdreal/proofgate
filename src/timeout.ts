/**
 * Bounded awaits for the verification pipeline.
 *
 * Every external call in the pipeline (today: Firebase AI Logic
 * generateContent, reached through a ModelAdapter) is wrapped with
 * `withTimeout`, because none of the layers below us impose a deadline:
 * the Firebase AI SDK's generateContent has no overall timeout, and its
 * on-device path can pend indefinitely on a Chrome-managed Gemini Nano
 * download. A promise that never settles must never be able to hang a
 * verification run: after `timeoutMs` the await rejects with a
 * TimeoutError and the caller records an honest "model unavailable"
 * outcome instead of spinning forever.
 */

export class TimeoutError extends Error {
  readonly label: string;
  readonly timeoutMs: number;

  constructor(label: string, timeoutMs: number) {
    super(`${label} timed out after ${timeoutMs} ms`);
    this.name = "TimeoutError";
    this.label = label;
    this.timeoutMs = timeoutMs;
  }
}

export function isTimeoutError(err: unknown): err is TimeoutError {
  return (
    err instanceof TimeoutError ||
    (err instanceof Error && err.name === "TimeoutError")
  );
}

/**
 * Race `promise` against a deadline. The underlying promise is not
 * cancelled (promises cannot be), but the caller stops waiting for it;
 * Promise.race keeps a handler attached, so a late rejection of the
 * underlying promise never surfaces as an unhandled rejection.
 * A non-positive or non-finite `timeoutMs` disables the deadline.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return promise;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(label, timeoutMs)), timeoutMs);
  });
  return Promise.race([promise, deadline]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
  });
}
