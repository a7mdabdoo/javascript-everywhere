// Day 05 — Task 5: async / await Lab (await.js)

// Pasting promise-db.js implementation directly as instructed:
const STUDENTS = {
  101: { id: 101, name: "Ahmed", city: "Qena", courseId: "CS-201" },
  102: { id: 102, name: "Mohamed", city: "Cairo", courseId: "AI-305" },
  103: { id: 103, name: "Abdo", city: "Alexandria", courseId: "BROKEN-COURSE" },
  104: { id: 104, name: "Saeed", city: "Giza", courseId: "WEB-999" },
  105: { id: 105, name: "Ayman", city: "Mansoura", courseId: "CS-201" },
  106: { id: 106, name: "Abdelkarim", city: "Aswan", courseId: "AI-305" }
};

const SCORES = {
  101: [94, 88, 96],
  102: [85, 91, 89],
  103: [72, 68, 75],
  104: [90, 92, 87],
  105: [82, 79, 85],
  106: [91, 87, 93]
};

const COURSES = {
  "CS-201": { id: "CS-201", title: "Modern JavaScript & Node.js", credits: 4, instructorId: "INST-1" },
  "AI-305": { id: "AI-305", title: "Machine Learning Foundations", credits: 3, instructorId: "INST-2" },
  "WEB-999": { id: "WEB-999", title: "Full-Stack Architecture", credits: 4, instructorId: "MISSING-INST" }
};

const INSTRUCTORS = {
  "INST-1": { id: "INST-1", name: "Eng. Mostafa Saqly", department: "Software Engineering", office: "Hall B-12" },
  "INST-2": { id: "INST-2", name: "Dr. Abdelkarim", department: "Artificial Intelligence", office: "Lab A-04" }
};

const STUDENT_DELAYS = { 101: 50, 102: 30, 103: 40, 104: 35, 105: 45, 106: 30 };

function lookup(table, id, tableName, delay = 40) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const record = table[id];
      if (!record) return reject(new Error(`[${tableName} DB] No record found with id="${id}"`));
      resolve(Array.isArray(record) ? [...record] : { ...record });
    }, delay);
  });
}

const getStudent = (id) => lookup(STUDENTS, id, "STUDENTS", STUDENT_DELAYS[id] ?? 30);
const getScores = (id) => lookup(SCORES, id, "SCORES", 30);
const getCourse = (id) => lookup(COURSES, id, "COURSES", 30);
const getInstructor = (id) => lookup(INSTRUCTORS, id, "INSTRUCTORS", 30);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// 5.1 — Rewrite buildReport with async / await (No .then anywhere!)
// Every intermediate value is a plain `const` - no shared `let`s.
// ============================================================================
async function buildReport(studentId) {
  const student = await getStudent(studentId);
  const scores = await getScores(student.id);
  const course = await getCourse(student.courseId);
  const instructor = await getInstructor(course.instructorId);

  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  return `SUCCESS: ${student.name} (${student.city}) | Avg: ${avg} | Course: ${course.title} | Instructor: ${instructor.name} (${instructor.office})`;
}

// ============================================================================
// 5.2 — Sequential vs Parallel
// ============================================================================
async function compareSequentialVsParallel() {
  console.log("\n=== Task 5.2: Sequential vs Parallel ===");
  const testIds = [101, 102, 105];

  // 1. Sequential with for...of + await
  const startSeq = Date.now();
  const seqResults = [];
  for (const id of testIds) {
    const s = await getStudent(id);
    seqResults.push(s.name);
  }
  const seqDuration = Date.now() - startSeq;
  console.log(`Sequential loading took: ${seqDuration}ms -> Names:`, seqResults);

  // 2. Parallel with Promise.all + map
  const startPar = Date.now();
  const parResults = (await Promise.all(testIds.map((id) => getStudent(id)))).map((s) => s.name);
  const parDuration = Date.now() - startPar;
  console.log(`Parallel loading took:   ${parDuration}ms -> Names:`, parResults);

  console.log(
    `Timing explanation: Sequential adds every delay one after another (sum: 50+30+45 = ~125ms),\nwhile Parallel fires all three immediately, finishing in the time of the single slowest one (~50ms)!`
  );

  // 3. Example where sequential is genuinely correct:
  // Step 2 depends directly on the result of Step 1:
  console.log("\nGenuinely dependent flow (Sequential is mandatory):");
  const student = await getStudent(101); // We don't have courseId until student is fetched
  const course = await getCourse(student.courseId); // Must wait for student.courseId!
  console.log(`Enrolled Course for ${student.name}: ${course.title}`);
}

// ============================================================================
// 5.3 — The forEach Trap
// ============================================================================
async function demonstrateForEachTrap() {
  console.log("\n=== Task 5.3: The forEach Trap ===");
  const testIds = [101, 102, 105];

  console.log("--- 1. Broken forEach (done prints first!) ---");
  testIds.forEach(async (id) => {
    const s = await getStudent(id);
    console.log(`[forEach callback] Loaded: ${s.name}`);
  });
  console.log("[forEach] -> done (printed BEFORE student callbacks finished!)");

  await delay(150); // wait for background promises to finish

  console.log("\n--- 2. Fixed with for...of loop ---");
  for (const id of testIds) {
    const s = await getStudent(id);
    console.log(`[for...of] Loaded: ${s.name}`);
  }
  console.log("[for...of] -> done (guaranteed to print AFTER all items finish)");

  console.log("\n--- 3. Fixed with Promise.all + map ---");
  await Promise.all(
    testIds.map(async (id) => {
      const s = await getStudent(id);
      console.log(`[Promise.all map] Loaded: ${s.name}`);
    })
  );
  console.log("[Promise.all map] -> done (guaranteed to wait for all in parallel)");
}

// ============================================================================
// 5.4 — return await
// ============================================================================
async function risky() {
  await delay(20);
  throw new Error("Critical database failure inside risky()");
}

async function returnWithoutAwait() {
  try {
    return risky(); // Unawaited! Returns pending promise before rejection occurs.
  } catch (err) {
    console.log("[returnWithoutAwait] Caught locally:", err.message);
  }
}

async function returnWithAwait() {
  try {
    return await risky(); // Awaited! Suspends function; rejection throws inside try block.
  } catch (err) {
    console.log("[returnWithAwait] Successfully caught inside try/catch:", err.message);
  }
}

async function demonstrateReturnAwait() {
  console.log("\n=== Task 5.4: return await ===");

  try {
    await returnWithoutAwait();
  } catch (err) {
    console.log("[Caller of returnWithoutAwait] Catch caught escaped error:", err.message);
  }

  await returnWithAwait();

  /*
   * One-sentence explanation:
   * `return await promise` pauses execution inside the `try` block until the promise settles, allowing any rejection to be caught by the local `catch`, whereas `return promise` returns immediately and delegates rejection handling to the caller.
   */
}

// ============================================================================
// 5.1 Main function
// ============================================================================
async function main() {
  console.log("=== Task 5.1: async / await Rewrite ===");

  // 1. Inspecting buildReport without await:
  const pendingPromise = buildReport(101);
  console.log("Calling buildReport(101) without await returns:", pendingPromise);

  // 2. try / catch / finally reporting good id and bad id
  try {
    const goodReport = await pendingPromise;
    console.log("Good Report:", goodReport);

    console.log("\nAttempting bad id (999):");
    const badReport = await buildReport(999);
    console.log("Bad Report:", badReport);
  } catch (err) {
    console.log("main() caught error:", err.message);
  } finally {
    console.log("main() -> done");
  }

  await compareSequentialVsParallel();
  await demonstrateForEachTrap();
  await demonstrateReturnAwait();
}

main().catch((err) => console.error("Unhandled error in main:", err));
