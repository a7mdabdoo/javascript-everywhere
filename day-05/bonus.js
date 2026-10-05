// Day 05 bonus tasks
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. custom Promise.all without using built-in Promise.all
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return resolve([]);
    }

    const results = new Array(promises.length);
    let done = 0;

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          results[i] = val;
          done++;
          if (done === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// 2. mapLimit: run async tasks with max concurrency
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = [];
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

// 3. retry with exponential backoff and jitter
async function retryWithBackoff(fn, retries = 3, baseDelay = 50, useJitter = true) {
  let attempt = 1;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) throw err;
      const sleep = baseDelay * Math.pow(2, attempt - 1) + (useJitter ? Math.random() * baseDelay : 0);
      console.log(`[retry] attempt ${attempt} failed (${err.message}), retrying in ${sleep.toFixed(0)}ms`);
      await delay(sleep);
      attempt++;
    }
  }
}

// 4. cancelable delay with AbortController
function cancelableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new Error("Aborted before start"));
    }

    const timer = setTimeout(() => {
      resolve(`Done after ${ms}ms`);
    }, ms);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("Canceled by AbortSignal"));
    });
  });
}

// tests
async function runTests() {
  console.log("=== Bonus 1: myPromiseAll ===");
  const p1 = delay(60).then(() => "Ahmed");
  const p2 = delay(20).then(() => "Mohamed");
  const p3 = delay(40).then(() => "Abdo");

  const out = await myPromiseAll([p1, p2, p3]);
  console.log("myPromiseAll:", out);

  try {
    await myPromiseAll([delay(10).then(() => "ok"), Promise.reject(new Error("failed fast"))]);
  } catch (err) {
    console.log("caught rejection:", err.message);
  }

  console.log("\n=== Bonus 2: mapLimit ===");
  const list = [1, 2, 3, 4];
  const mapped = await mapLimit(list, 2, async (num) => {
    await delay(30);
    return num * 10;
  });
  console.log("mapLimit:", mapped);

  console.log("\n=== Bonus 3: retryWithBackoff ===");
  let tries = 0;
  const val = await retryWithBackoff(async () => {
    tries++;
    if (tries < 2) throw new Error("connection reset");
    return "ok after retry";
  }, 3, 20);
  console.log("retry result:", val);

  console.log("\n=== Bonus 4: AbortController ===");
  const ac = new AbortController();
  setTimeout(() => ac.abort(), 30);
  try {
    await cancelableDelay(100, ac.signal);
  } catch (e) {
    console.log("delay canceled:", e.message);
  }
}

runTests();
