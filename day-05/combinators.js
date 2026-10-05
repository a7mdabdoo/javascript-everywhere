// Task 4: combinators lab
const delayValue = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const failAfter = (ms, message) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

// 4.1: Promise.all
async function testPromiseAll() {
  console.log("=== Task 4.1: Promise.all ===");

  const start = Date.now();
  const pSlow = delayValue(150, "Item 1 (Slow - 150ms)");
  const pFast = delayValue(50, "Item 2 (Fast - 50ms)");
  const pMid = delayValue(100, "Item 3 (Mid - 100ms)");

  const results = await Promise.all([pSlow, pFast, pMid]);
  const duration = Date.now() - start;

  console.log("Promise.all resolved array (preserves input order):");
  console.log(results);
  console.log(`Total time: ${duration}ms (matches slowest ~150ms)`);

  try {
    await Promise.all([
      delayValue(50, "Student 101"),
      failAfter(40, "Network timeout on Student 102"),
      delayValue(100, "Student 103")
    ]);
  } catch (err) {
    console.log("Promise.all fail-fast caught:", err.message);
  }

  // rebuild loadAll
  const ids = [101, 102, 105];
  const loadAll = (studentIds) => Promise.all(studentIds.map((id) => delayValue(30, `Student #${id}`)));

  const loaded = await loadAll(ids);
  console.log("loadAll with Promise.all + map:", loaded);
}

// 4.2: Promise.allSettled
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
      console.log(`[Task ${idx + 1}] Fulfilled: ${outcome.value.name} (Attendance: ${outcome.value.attendance}%)`);
    } else {
      console.log(`[Task ${idx + 1}] Rejected: ${outcome.reason.message}`);
    }
  });

  const failureCount = outcomes.filter((o) => o.status === "rejected").length;
  console.log(`Total failures: ${failureCount} of ${outcomes.length}`);
}

// 4.3: race and any
async function testRaceAndAny() {
  console.log("\n=== Task 4.3: Promise.race and Promise.any ===");

  try {
    await Promise.race([
      delayValue(120, "Slow Success (120ms)"),
      failAfter(40, "Fast Error (40ms)")
    ]);
  } catch (err) {
    console.log("Promise.race rejected with first settler:", err.message);
  }

  try {
    const winner = await Promise.any([
      delayValue(120, "Slow Success (120ms)"),
      failAfter(40, "Fast Error (40ms)")
    ]);
    console.log("Promise.any fulfilled with first SUCCESS:", winner);
  } catch (err) {
    console.log("Promise.any error:", err.message);
  }

  try {
    await Promise.any([
      failAfter(20, "Server 1 down"),
      failAfter(30, "Server 2 down"),
      failAfter(25, "Server 3 down")
    ]);
  } catch (err) {
    console.log("All rejected -> Error Name:", err.name);
    console.log("All rejected -> Total Errors:", err.errors.length);
  }
}

async function main() {
  await testPromiseAll();
  await testPromiseAllSettled();
  await testRaceAndAny();
}

main();
