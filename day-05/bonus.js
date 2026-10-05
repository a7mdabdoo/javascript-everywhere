// Day 05 — Bonus Lab (bonus.js)
// Implementing advanced asynchronous patterns and bonus challenges from Day 05 Assignment.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// 1. myPromiseAll(promises): Custom Promise.all implementation without Promise.all
// Guarantees input order and fast rejection.
// ============================================================================
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return resolve([]);
    }

    const results = new Array(promises.length);
    let completedCount = 0;

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((val) => {
          results[index] = val; // Preserves exact INPUT order
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch((err) => {
          // Fail-fast on first rejection
          reject(err);
        });
    });
  });
}

// ============================================================================
// 2. mapLimit(items, limit, fn): Concurrency limiter
// Runs at most `limit` async operations at the same time.
// ============================================================================
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  // Spawn `limit` workers in parallel
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ============================================================================
// 3. retryWithBackoff(fn, retries, baseDelay, jitter)
// Exponential backoff with random jitter.
// ============================================================================
async function retryWithBackoff(fn, retries = 3, baseDelay = 50, useJitter = true) {
  let attempt = 1;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) throw err;
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = useJitter ? Math.random() * baseDelay : 0;
      const sleepTime = exponentialDelay + jitter;
      console.log(`[retryWithBackoff] Attempt ${attempt} failed (${err.message}). Retrying in ${sleepTime.toFixed(0)}ms...`);
      await delay(sleepTime);
      attempt++;
    }
  }
}

// ============================================================================
// 4. withAbortTimeout: Using AbortController to actually cancel a pending delay
// ============================================================================
function cancelableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new Error("Operation aborted before start"));
    }

    const timer = setTimeout(() => {
      resolve(`Completed after ${ms}ms`);
    }, ms);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("Operation canceled via AbortSignal"));
    });
  });
}

// ============================================================================
// Tests & Verification
// ============================================================================
async function runBonusTests() {
  console.log("=== Bonus 1: myPromiseAll ===");
  const p1 = delay(80).then(() => "Item A (80ms)");
  const p2 = delay(30).then(() => "Item B (30ms)");
  const p3 = delay(50).then(() => "Item C (50ms)");

  const out = await myPromiseAll([p1, p2, p3]);
  console.log("myPromiseAll Output (Preserves input order):", out);

  try {
    await myPromiseAll([delay(20).then(() => "OK"), Promise.reject(new Error("Fast fail in myPromiseAll"))]);
  } catch (err) {
    console.log("myPromiseAll fast-fail caught:", err.message);
  }

  console.log("\n=== Bonus 2: mapLimit (Concurrency = 2) ===");
  const tasks = [1, 2, 3, 4, 5, 6];
  let active = 0;
  const mapResults = await mapLimit(tasks, 2, async (item) => {
    active++;
    console.log(`[Start Task ${item}] Currently active: ${active}`);
    await delay(40);
    active--;
    return item * 10;
  });
  console.log("mapLimit results:", mapResults);

  console.log("\n=== Bonus 3: retryWithBackoff ===");
  let flakyTries = 0;
  const result = await retryWithBackoff(async () => {
    flakyTries++;
    if (flakyTries < 3) throw new Error(`Simulated error on try ${flakyTries}`);
    return "Success after exponential backoff!";
  }, 4, 30, true);
  console.log("retryWithBackoff result:", result);

  console.log("\n=== Bonus 4: AbortController with Cancelable Delay ===");
  const controller = new AbortController();
  setTimeout(() => {
    console.log("Triggering controller.abort()...");
    controller.abort();
  }, 50);

  try {
    await cancelableDelay(200, controller.signal);
  } catch (err) {
    console.log("Successfully canceled delay early:", err.message);
  }
}

runBonusTests();
