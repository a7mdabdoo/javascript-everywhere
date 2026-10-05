// Task 5: async / await lab

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

// 5.1: rewrite buildReport with async / await
async function buildReport(studentId) {
  const student = await getStudent(studentId);
  const scores = await getScores(student.id);
  const course = await getCourse(student.courseId);
  const instructor = await getInstructor(course.instructorId);

  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  return `SUCCESS: ${student.name} (${student.city}) | Avg: ${avg} | Course: ${course.title} | Instructor: ${instructor.name} (${instructor.office})`;
}

// 5.2: sequential vs parallel
async function compareSequentialVsParallel() {
  console.log("\n=== Task 5.2: Sequential vs Parallel ===");
  const testIds = [101, 102, 105];

  // sequential with for..of
  const startSeq = Date.now();
  const seqResults = [];
  for (const id of testIds) {
    const s = await getStudent(id);
    seqResults.push(s.name);
  }
  const seqDuration = Date.now() - startSeq;
  console.log(`Sequential took: ${seqDuration}ms -> Names:`, seqResults);

  // parallel with Promise.all
  const startPar = Date.now();
  const parResults = (await Promise.all(testIds.map((id) => getStudent(id)))).map((s) => s.name);
  const parDuration = Date.now() - startPar;
  console.log(`Parallel took:   ${parDuration}ms -> Names:`, parResults);

  console.log(
    `Sequential takes sum of delays (~125ms), while parallel finishes in slowest time (~50ms).`
  );

  // example where sequential is needed
  console.log("\nSequential needed when step 2 depends on step 1:");
  const student = await getStudent(101);
  const course = await getCourse(student.courseId);
  console.log(`Course for ${student.name}: ${course.title}`);
}

// 5.3: forEach trap
async function demonstrateForEachTrap() {
  console.log("\n=== Task 5.3: The forEach Trap ===");
  const testIds = [101, 102, 105];

  console.log("--- 1. forEach (done prints first!) ---");
  testIds.forEach(async (id) => {
    const s = await getStudent(id);
    console.log(`[forEach] loaded: ${s.name}`);
  });
  console.log("[forEach] -> done");

  await delay(150);

  console.log("\n--- 2. fixed with for...of ---");
  for (const id of testIds) {
    const s = await getStudent(id);
    console.log(`[for...of] loaded: ${s.name}`);
  }
  console.log("[for...of] -> done");

  console.log("\n--- 3. fixed with Promise.all ---");
  await Promise.all(
    testIds.map(async (id) => {
      const s = await getStudent(id);
      console.log(`[Promise.all] loaded: ${s.name}`);
    })
  );
  console.log("[Promise.all] -> done");
}

// 5.4: return await
async function risky() {
  await delay(20);
  throw new Error("Critical database failure inside risky()");
}

async function returnWithoutAwait() {
  try {
    return risky(); // not awaited, catch won't run locally
  } catch (err) {
    console.log("[returnWithoutAwait] caught:", err.message);
  }
}

async function returnWithAwait() {
  try {
    return await risky(); // awaited, caught by try/catch
  } catch (err) {
    console.log("[returnWithAwait] caught inside try/catch:", err.message);
  }
}

async function demonstrateReturnAwait() {
  console.log("\n=== Task 5.4: return await ===");

  try {
    await returnWithoutAwait();
  } catch (err) {
    console.log("[Caller] caught:", err.message);
  }

  await returnWithAwait();
}

async function main() {
  console.log("=== Task 5.1: async / await Rewrite ===");

  const pendingPromise = buildReport(101);
  console.log("Calling buildReport(101) without await returns:", pendingPromise);

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

main().catch((err) => console.error("Unhandled error:", err));
