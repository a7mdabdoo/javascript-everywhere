// Task 7: async helper functions
export const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
