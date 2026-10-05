// Day 05 — Task 4: Combinators Lab (combinators.js)

const delayValue = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const failAfter = (ms, message) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

// ============================================================================
// 4.1 — Promise.all
// ============================================================================
async function testPromiseAll() {
  console.log("=== Task 4.1: Promise.all ===");

  // 1. Three promises with different delays (300ms, 100ms, 200ms)
  // Finish order will be: Fast (100ms) -> Mid (200ms) -> Slow (300ms)
  const start = Date.now();
  const pSlow = delayValue(150, "Item 1 (Slow - 150ms)");
  const pFast = delayValue(50, "Item 2 (Fast - 50ms)");
  const pMid = delayValue(100, "Item 3 (Mid - 100ms)");

  const results = await Promise.all([pSlow, pFast, pMid]);
  const duration = Date.now() - start;

  console.log("Promise.all resolved array (guarantees INPUT order):");
  console.log(results);
  console.log(`Total time: ${duration}ms (matches slowest ~150ms, NOT the sum 300ms!)`);

  // 2. One rejection causes immediate fail-fast:
  try {
    await Promise.all([
      delayValue(50, "Student 101"),
      failAfter(40, "Network timeout on Student 102"),
      delayValue(100, "Student 103")
    ]);
  } catch (err) {
    console.log("Promise.all fail-fast caught:", err.message);
    console.log("Notice: The fulfilled values from other promises are completely lost!");
  }

  // 3. Rebuild Day 04's parallel loader (loadAll) with Promise.all + map:
  // Day 04 took 25+ lines with remaining counter, results array, and multiple callbacks.
  // Day 05 version:
  const ids = [101, 102, 105];
  const loadAll = (studentIds) => Promise.all(studentIds.map((id) => delayValue(30, `Student #${id}`)));

  const loaded = await loadAll(ids);
  console.log("loadAll with Promise.all + map:", loaded);
  /*
   * Line Count Comparison:
   * - Day 04 loadAll: ~25 lines (maintaining `completed` counter, array index tracking, checking if completed === total, if (err) handling).
   * - Day 05 Promise.all + map: 1 single clean line of logic!
   */
}

// ============================================================================
// 4.2 — Promise.allSettled
// ============================================================================
async function testPromiseAllSettled() {
  console.log("\n=== Task 4.2: Promise.allSettled ===");

  const tasks = [
    delayValue(40, { id: 101, name: "Ahmed", attendance: 95 }),
    failAfter(30, "Database connection dropped for Student 102"),
    delayValue(50, { id: 105, name: "Ayman", attendance: 88 })
  ];

  const outcomes = await Promise.allSettled(tasks);

  outcomes.forEach((outcome, idx) => {
    if (outcome.status === "fulfilled") {
      console.log(`✓ [Task ${idx + 1}] Fulfilled: ${outcome.value.name} (Attendance: ${outcome.value.attendance}%)`);
    } else {
      console.log(`✗ [Task ${idx + 1}] Rejected: ${outcome.reason.message}`);
    }
  });

  const failureCount = outcomes.filter((o) => o.status === "rejected").length;
  console.log(`Total failures: ${failureCount} of ${outcomes.length}`);
}

// ============================================================================
// 4.3 — Promise.race and Promise.any
// ============================================================================
async function testRaceAndAny() {
  console.log("\n=== Task 4.3: Promise.race and Promise.any ===");

  // Race a slow success against a fast failure:
  try {
    await Promise.race([
      delayValue(120, "Slow Success (120ms)"),
      failAfter(40, "Fast Error (40ms)")
    ]);
  } catch (err) {
    console.log("Promise.race rejected with first settler:", err.message);
  }

  // Run the EXACT same pair through Promise.any:
  try {
    const winner = await Promise.any([
      delayValue(120, "Slow Success (120ms)"),
      failAfter(40, "Fast Error (40ms)")
    ]);
    console.log("Promise.any fulfilled with first SUCCESS:", winner);
  } catch (err) {
    console.log("Promise.any unexpected error:", err.message);
  }

  // Make EVERY promise passed to Promise.any reject:
  try {
    await Promise.any([
      failAfter(20, "Server 1 down"),
      failAfter(30, "Server 2 down"),
      failAfter(25, "Server 3 down")
    ]);
  } catch (err) {
    console.log("All rejected -> Error Name:", err.name); // AggregateError
    console.log("All rejected -> Total Errors Count (err.errors.length):", err.errors.length);
    console.log("Underlying error messages:", err.errors.map((e) => e.message));
  }

  /*
   * Real-World Use Cases per Combinator:
   * 1. Promise.all: When a screen needs ALL critical parts to render (e.g. User Profile + Account Balance + Permissions). If any fails, the page cannot function.
   * 2. Promise.allSettled: For bulk independent operations where partial success is acceptable (e.g. batch sending 100 notification emails or fetching attendance reports).
   * 3. Promise.race: Implementing request timeouts (racing a network fetch against a 3000ms delay that rejects).
   * 4. Promise.any: Fetching the same static asset from multiple redundant mirror CDNs or DNS providers (you only care about the fastest healthy response).
   */
}

async function main() {
  await testPromiseAll();
  await testPromiseAllSettled();
  await testRaceAndAny();
}

main();
