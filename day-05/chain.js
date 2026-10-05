// Day 05 — Task 3.3: chain.js (The Pyramid of Doom, Flattened!)
// Pasting promise-db.js implementation directly as instructed.

const STUDENTS = {
  101: { id: 101, name: "Ahmed", city: "Qena", courseId: "CS-201" },
  102: { id: 102, name: "Mohamed", city: "Cairo", courseId: "AI-305" },
  103: { id: 103, name: "Abdo", city: "Alexandria", courseId: "BROKEN-COURSE" }, // fails at Level 3
  104: { id: 104, name: "Saeed", city: "Giza", courseId: "WEB-999" },             // fails at Level 4 (instructor missing)
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

// ============================================================================
// buildReport(studentId): Flattened 4-level Promise chain with 1 .catch & 1 .finally
// ============================================================================
function buildReport(studentId) {
  const startTime = Date.now();
  let studentData, scoresData, courseData;

  return getStudent(studentId)
    .then((student) => {
      studentData = student;
      return getScores(student.id); // Level 2
    })
    .then((scores) => {
      scoresData = scores;
      return getCourse(studentData.courseId); // Level 3
    })
    .then((course) => {
      courseData = course;
      return getInstructor(course.instructorId); // Level 4
    })
    .then((instructor) => {
      const avg = (scoresData.reduce((a, b) => a + b, 0) / scoresData.length).toFixed(1);
      const summaryLine = `SUCCESS: ${studentData.name} (${studentData.city}) | Avg: ${avg} | Course: ${courseData.title} | Instructor: ${instructor.name} (${instructor.office})`;
      return summaryLine;
    })
    .catch((err) => {
      // Exactly ONE .catch handles a failure at ANY level
      return `FAILED: ${err.message}`;
    })
    .finally(() => {
      console.log(`[Timer] buildReport(${studentId}) chain completed in ${Date.now() - startTime}ms`);
    });
}

/*
 * Line-count and Error-handling Comparison:
 * - Day 04 hell.js had FOUR `if (err) return ...` checks (one at every single nested callback).
 * - Day 05 chain.js has ZERO `if (err)` checks and exactly ONE `.catch()` at the end of the chain.
 * - Indentation dropped from 10 spaces (5 levels deep) to 2 spaces flat!
 */

async function runDemo() {
  console.log("=== Task 3.3: Flattened Promise Chain Tests ===");

  // 1. Good Chain (Student 101)
  console.log("\n1. Testing Good Chain (101):");
  const res1 = await buildReport(101);
  console.log("Result:", res1);

  // 2. Break #1: Bad Student ID (999) - fails at Level 1
  console.log("\n2. Testing Break #1 - Bad Student (999):");
  const res2 = await buildReport(999);
  console.log("Result:", res2);

  // 3. Break #2: Bad Course ID (Student 103) - fails at Level 3
  console.log("\n3. Testing Break #2 - Bad Course (103):");
  const res3 = await buildReport(103);
  console.log("Result:", res3);

  // 4. Break #3: Bad Instructor ID (Student 104) - fails at Level 4
  console.log("\n4. Testing Break #3 - Bad Instructor (104):");
  const res4 = await buildReport(104);
  console.log("Result:", res4);
}

runDemo();
