// Day 05 — Task 2: Promise Basics Lab (promises.js)

console.log("=== Task 2.1: Creating Promises ===");

// 1. delay(ms)
const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// 2. delayValue(ms, value)
const delayValue = (ms, value) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });

// 3. failAfter(ms, message) - rejects with a real Error
const failAfter = (ms, message) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });

// 4. Log a Promise before it settles and after:
const pendingP = delayValue(100, "Settled Value: Ahmed");
console.log("Before settling (synchronous inspection):", pendingP);

pendingP.then((val) => {
  console.log("After settling:", pendingP, "Resolved with:", val);
  runPart2_2();
});

// === Task 2.2: Settles Once ===
function runPart2_2() {
  console.log("\n=== Task 2.2: Settles Once ===");

  // Resolve called twice:
  const doubleResolve = new Promise((resolve) => {
    resolve("First Value (Wins)");
    resolve("Second Value (Ignored)");
  });
  doubleResolve.then((val) => console.log("doubleResolve settled with:", val));

  // Resolve then reject:
  const resolveThenReject = new Promise((resolve, reject) => {
    resolve("Resolved Successfully");
    reject(new Error("Late failure"));
  });
  resolveThenReject
    .then((val) => console.log("resolveThenReject settled with:", val))
    .catch((err) => console.log("Caught unexpected error:", err.message));

  // Comment on Day 04 callback bug:
  // In Day 04, a poorly written asynchronous library or bug in if/else could call `callback(null, data)`
  // and then inadvertently execute another branch calling `callback(err)` or another `callback(...)`.
  // With Promises, the engine guarantees state transition occurs exactly ONCE (state transitions from
  // pending to fulfilled or rejected are permanent). Any subsequent resolve or reject calls are no-ops.

  setTimeout(runPart2_3, 50);
}

// === Task 2.3: Chaining ===
function runPart2_3() {
  console.log("\n=== Task 2.3: Chaining ===");

  // 1. Four .thens transforming a number:
  Promise.resolve(10)
    .then((n) => n + 5)     // 15
    .then((n) => n * 2)     // 30
    .then((n) => n - 4)     // 26
    .then((n) => n / 2)     // 13
    .then((finalResult) => console.log("Four transformations final result (10 -> 15 -> 30 -> 26 -> 13):", finalResult));

  // 2. Chain three steps returning delayValue, proving chain waits sequentially:
  const startTime = Date.now();
  delayValue(50, "Step 1: Student fetched")
    .then((step1) => {
      console.log(`[+${Date.now() - startTime}ms] ${step1}`);
      return delayValue(50, "Step 2: Scores fetched");
    })
    .then((step2) => {
      console.log(`[+${Date.now() - startTime}ms] ${step2}`);
      return delayValue(50, "Step 3: Course fetched");
    })
    .then((step3) => {
      console.log(`[+${Date.now() - startTime}ms] ${step3}`);
      console.log(`Total time for 3 chained delays of 50ms: ~${Date.now() - startTime}ms (Proves sequential waiting)`);
    });

  // 3. What happens if return is missing vs present:
  // With missing return:
  Promise.resolve("Initial Data")
    .then((data) => {
      // Intentionally omitting return:
      delayValue(50, "New Delayed Data");
    })
    .then((received) => {
      console.log("Missing return demonstration -> Next step received:", received); // undefined!
    });

  // 4. Destructuring an object value directly in .then parameter:
  Promise.resolve({ name: "Ahmed", score: 95, city: "Qena" })
    .then(({ name, score }) => {
      console.log(`Destructured in .then parameter: Student ${name} scored ${score}`);
    });

  setTimeout(runPart2_4, 250);
}

// === Task 2.4: Errors & Error Handling ===
function runPart2_4() {
  console.log("\n=== Task 2.4: Errors & Error Handling ===");

  // 1. Throw inside .then, caught 3 steps later, skipping steps in between:
  Promise.resolve("Start")
    .then((v) => {
      console.log("Step 1: throwing error...");
      throw new Error("Deliberate failure in Step 1");
    })
    .then(() => console.log("Step 2: (THIS SHOULD BE SKIPPED)"))
    .then(() => console.log("Step 3: (THIS SHOULD BE SKIPPED)"))
    .catch((err) => {
      console.log("Caught after skipped steps:", err.message);
    });

  // 2. A .catch that returns a fallback value, continuing the chain:
  Promise.reject(new Error("Primary server unreachable"))
    .catch((err) => {
      console.log(`Handling error (${err.message}) -> returning fallback cached profile`);
      return { id: 101, name: "Ahmed (Offline Cache)", status: "offline" };
    })
    .then((profile) => {
      console.log("Chain continues after catch recovery:", profile);
    });

  // 3. .finally logs "cleanup" on both fulfilled and rejected chains:
  Promise.resolve("Success data")
    .finally(() => console.log("[Finally 1]: cleanup on fulfilled chain"))
    .then((val) => console.log("Consumed after finally:", val));

  Promise.reject(new Error("Broken DB connection"))
    .finally(() => console.log("[Finally 2]: cleanup on rejected chain"))
    .catch((err) => console.log("Caught rejected chain with finally:", err.message));

  // 4. reject("a string") vs reject(new Error("...")):
  Promise.reject("Just a raw string error")
    .catch((err) => {
      console.log("Rejected with string -> err.message is:", err.message, "| raw err is:", err);
      // Explanation: String primitives have no `.message` property (returns undefined)
      // and do not capture a V8 stack trace.
    });

  Promise.reject(new Error("Real Error Instance"))
    .catch((err) => {
      console.log("Rejected with Error instance -> err.message is:", err.message, "| stack exists:", typeof err.stack === "string");
    });

  // 5. Handled rejection demonstration:
  failAfter(30, "Testing simulated network failure")
    .catch((err) => {
      console.log("Properly caught failure:", err.message);
    });
}
