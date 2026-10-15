/**
 * Task Manager — Typed HTTP Client
 * client/http.ts
 */

export type ApiError =
  | { kind: "network"; message: string }              // no response at all
  | { kind: "timeout"; message: string }              // took too long — timed out
  | { kind: "aborted"; message: string }              // explicitly cancelled
  | { kind: "http"; status: number; message: string } // 4xx / 5xx HTTP response
  | { kind: "parse"; message: string }                // response was not valid JSON
  | { kind: "shape"; message: string };               // valid JSON, unexpected shape

export type Result<T> = { ok: true; value: T } | { ok: false; error: ApiError };

export interface RequestOptions<T> {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  check: (value: unknown) => value is T;
  timeoutMs?: number;
  signal?: AbortSignal;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function errorMessage(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (typeof body === "object" && body !== null && "error" in body && typeof (body as { error: unknown }).error === "string") {
      return (body as { error: string }).error;
    }
  } catch {
    // not JSON — fall through
  }
  return res.statusText || `HTTP ${res.status}`;
}

export async function request<T>(url: string, options: RequestOptions<T>): Promise<Result<T>> {
  const { method = "GET", body, check, timeoutMs = 5000, signal } = options;
  const timeout = AbortSignal.timeout(timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers:
        body === undefined
          ? { Accept: "application/json" }
          : { Accept: "application/json", "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (err: unknown) {
    if (timeout.aborted) {
      return { ok: false, error: { kind: "timeout", message: `No response after ${timeoutMs}ms` } };
    }
    if (signal?.aborted) {
      return { ok: false, error: { kind: "aborted", message: "Request cancelled" } };
    }
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: { kind: "network", message: msg } };
  }

  if (!res.ok) {
    return {
      ok: false,
      error: { kind: "http", status: res.status, message: await errorMessage(res) },
    };
  }

  if (res.status === 204) {
    return check(undefined)
      ? { ok: true, value: undefined as T }
      : { ok: false, error: { kind: "shape", message: "Expected a body, got 204 No Content" } };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: { kind: "parse", message: "The response was not valid JSON" } };
  }

  if (!check(data)) {
    return { ok: false, error: { kind: "shape", message: "The response had an unexpected shape" } };
  }

  return { ok: true, value: data };
}

/**
 * Task 17.3: Safe retry for idempotent requests (network, timeout, 5xx)
 */
export async function requestWithRetry<T>(
  url: string,
  options: RequestOptions<T>,
  maxRetries: number = 2
): Promise<Result<T>> {
  let result = await request<T>(url, options);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    if (result.ok) return result;

    const err = result.error;
    const isRetryable =
      err.kind === "network" ||
      err.kind === "timeout" ||
      (err.kind === "http" && err.status >= 500);

    if (!isRetryable) {
      // 4xx, parse, shape, aborted are NEVER retried
      return result;
    }

    await delay(150 * attempt); // Growing backoff delay
    result = await request<T>(url, options);
  }

  return result;
}

export function describeError(error: ApiError): string {
  switch (error.kind) {
    case "network":
      return `Can't reach the server (${error.message}). Is it running?`;
    case "timeout":
      return `The server is too slow — ${error.message}.`;
    case "aborted":
      return "Cancelled.";
    case "http":
      return `${error.status}: ${error.message}`;
    case "parse":
      return "The server sent something that isn't JSON.";
    case "shape":
      return "The server sent data in an unexpected shape.";
  }
}
