// Day 05 — Task 7.2: project/lib/async-utils.js
// Asynchronous helper utilities: delay, withTimeout, retry

export const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * withTimeout: Races a promise against a timeout timer
 * @template T
 * @param {Promise<T>} promise
 * @param {number} ms
 * @returns {Promise<T>}
 */
export function withTimeout(promise, ms) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timeoutId);
      return res;
    }),
    timeoutPromise
  ]);
}

/**
 * retry: Retries an async operation up to `retries` times
 * @template T
 * @param {() => Promise<T>} fn
 * @param {number} retries
 * @param {number} delayMs
 * @returns {Promise<T>}
 */
export async function retry(fn, retries = 3, delayMs = 50) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.log(`[retry] Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        await delay(delayMs);
      }
    }
  }
  throw lastError;
}
