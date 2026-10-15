/**
 * Day 06 — Task 16: Failure Lab — Every Way It Breaks
 * failures-lab.ts
 *
 * =========================================================================================
 * FAILURE CLASSIFICATION AUDIT TABLE:
 * =========================================================================================
 * Failure Type   | Layer   | fetch() Promise | Status Code | Safe to Retry? | Notes
 * -----------------------------------------------------------------------------------------
 * Wrong Port     | Network | REJECTS         | None        | YES (if transient) | Connection refused (ECONNREFUSED)
 * Bad Host       | Network | REJECTS         | None        | NO (config error)  | DNS lookup failure (ENOTFOUND)
 * HTTP 400       | HTTP    | RESOLVES        | 400         | NO             | Client bug (invalid body/schema)
 * HTTP 404       | HTTP    | RESOLVES        | 404         | NO             | Resource does not exist
 * HTTP 500       | HTTP    | RESOLVES        | 500         | YES (idempotent)| Server crash/intermittent fault
 * Parse Error    | Data    | RESOLVES (fetch)| 200         | NO             | res.json() throws SyntaxError
 * Shape Mismatch | Data    | RESOLVES (fetch)| 200         | NO             | Schema guard returns false
 * Timeout        | Network | REJECTS         | None        | YES (with backoff)| AbortSignal.timeout tripped
 * Client Abort   | Client  | REJECTS         | None        | NO             | Explicitly cancelled by user/client
 * =========================================================================================
 *
 * Why does res.ok need checking even inside try/catch?
 * Because fetch() only rejects for network-level failures. For HTTP 4xx and 5xx errors,
 * the fetch() Promise resolves normally without throwing; therefore, checking `if (!res.ok)`
 * is mandatory to detect and handle HTTP failure status codes.
 */

import { isTask } from "./task-manager/src/shared/validate.ts";

console.log("=== Task 16: Failure Lab Execution ===");

async function attempt(label: string, fn: () => Promise<void>): Promise<void> {
  console.log(`\n--- [Attempt]: ${label} ---`);
  try {
    await fn();
  } catch (err: unknown) {
    const errorName = err instanceof Error ? err.name : "UnknownError";
    const errorMessage = err instanceof Error ? err.message : String(err);
    const causeCode =
      err instanceof Error && "cause" in err && typeof (err as any).cause === "object"
        ? (err as any).cause?.code
        : "N/A";
    console.log(`Caught Failure -> Name: ${errorName} | Cause Code: ${causeCode} | Message: ${errorMessage}`);
  }
}

// 1. Network: Wrong port (Refused connection):
await attempt("Network - Wrong Port (ECONNREFUSED)", async () => {
  await fetch("http://localhost:3999/api/tasks");
});

// 2. Network: Host does not exist (DNS failure):
await attempt("Network - Non-existent Host (ENOTFOUND)", async () => {
  await fetch("http://this-domain-does-not-exist-12345.org/api/tasks");
});

// 3. HTTP 404: Missing task:
await attempt("HTTP 404 - Not Found", async () => {
  const res = await fetch("http://localhost:3000/api/tasks/99999");
  if (!res.ok) {
    const body = (await res.json()) as { error: string };
    console.log(`Server reported HTTP ${res.status}: "${body.error}"`);
  }
});

// 4. HTTP 400: Validation error:
await attempt("HTTP 400 - Bad Request", async () => {
  const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "" }),
  });
  if (!res.ok) {
    const body = (await res.json()) as { error: string };
    console.log(`Server reported HTTP ${res.status}: "${body.error}"`);
  }
});

// 5. Parse Error: Calling res.json() on HTML static page:
await attempt("Data Parse - Invalid JSON", async () => {
  const res = await fetch("http://localhost:3000/");
  console.log("Static page Content-Type:", res.headers.get("content-type"));
  await res.json(); // Throws SyntaxError!
});

// 6. Shape Mismatch: JSON is valid, but fails isTask guard:
await attempt("Data Shape Mismatch", async () => {
  const res = await fetch("http://localhost:3000/api/tasks");
  const data: unknown = await res.json();
  // We expect a single Task object, but received an Array:
  if (!isTask(data)) {
    throw new Error("Data Shape Error: Expected a single Task, but received Task[] array.");
  }
});

// 7. Timeout: Request takes longer than AbortSignal.timeout:
await attempt("Network Timeout (AbortSignal.timeout)", async () => {
  // Using an immediate 1ms timeout to trip before network responds:
  const signal = AbortSignal.timeout(1);
  await fetch("http://localhost:3000/api/tasks", { signal });
});

// 8. Abort: Request cancelled by AbortController:
await attempt("Client Abort (AbortController.abort())", async () => {
  const controller = new AbortController();
  controller.abort();
  await fetch("http://localhost:3000/api/tasks", { signal: controller.signal });
});

// 9. Stale Request Prevention:
console.log("\n--- [Attempt]: Stale Request Prevention ---");
let activeController: AbortController | null = null;
let latestResolvedData: string = "";

async function loadData(requestId: string): Promise<void> {
  // Cancel previous stale in-flight request:
  if (activeController) {
    activeController.abort();
    console.log(`Aborted stale request prior to starting ${requestId}`);
  }

  const controller = new AbortController();
  activeController = controller;

  try {
    const res = await fetch("http://localhost:3000/api/tasks", { signal: controller.signal });
    if (!res.ok) return;
    const tasks = (await res.json()) as Array<{ id: number }>;
    latestResolvedData = `${requestId} resolved with ${tasks.length} tasks`;
    console.log(`Success: ${latestResolvedData}`);
  } catch (err: unknown) {
    if (controller.signal.aborted) {
      console.log(`Ignored aborted stale request: ${requestId}`);
    } else {
      console.error(`Request error:`, err);
    }
  }
}

// Start Request A and immediately fire Request B:
const pA = loadData("Request A");
const pB = loadData("Request B");
await Promise.allSettled([pA, pB]);
console.log(`Final state preserved only from: "${latestResolvedData}"`);
