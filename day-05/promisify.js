// Day 05 — Task 3.1: promisify.js
// Wrapping Day 04 callback-style database functions with manual Promise wrappers and generic promisify helper.

const util = require("util");

// --- Day 04 fake-db.js pasted directly (callback-style) ---
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

function getStudentCb(id, callback) {
  const delay = STUDENT_DELAYS[id] ?? 30;
  setTimeout(() => {
    const student = STUDENTS[id];
    if (!student) return callback(new Error(`[STUDENTS DB] No student found with id=${id}`));
    callback(null, { ...student });
  }, delay);
}

function getScoresCb(studentId, callback) {
  setTimeout(() => {
    const scores = SCORES[studentId];
    if (!scores) return callback(new Error(`[SCORES DB] No scores found for studentId=${studentId}`));
    callback(null, [...scores]);
  }, 40);
}

function getCourseCb(courseId, callback) {
  setTimeout(() => {
    const course = COURSES[courseId];
    if (!course) return callback(new Error(`[COURSES DB] No course found with courseId="${courseId}"`));
    callback(null, { ...course });
  }, 40);
}

function getInstructorCb(instructorId, callback) {
  setTimeout(() => {
    const instructor = INSTRUCTORS[instructorId];
    if (!instructor) return callback(new Error(`[INSTRUCTORS DB] No instructor found with instructorId="${instructorId}"`));
    callback(null, { ...instructor });
  }, 40);
}

// ==========================================
// 1. Wrap ONE function by hand: getStudent
// ==========================================
function getStudent(id) {
  return new Promise((resolve, reject) => {
    getStudentCb(id, (err, student) => {
      if (err) return reject(err);
      resolve(student);
    });
  });
}

// ==========================================
// 2. Custom generic promisify(fn) using ...args
// ==========================================
function promisify(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
}

// Wrap the other three with our custom promisify:
const getScores = promisify(getScoresCb);
const getCourse = promisify(getCourseCb);
const getInstructor = promisify(getInstructorCb);

// ==========================================
// 3. Compare with Node's util.promisify
// ==========================================
const getStudentUtil = util.promisify(getStudentCb);

// ==========================================
// 4. Test each wrapped function with Good ID (.then) and Bad ID (.catch)
// ==========================================
async function testAll() {
  console.log("=== Task 3.1: Testing Promisified Functions ===");

  // getStudent (Hand-wrapped):
  getStudent(101)
    .then((s) => console.log("[Hand-wrapped] Good Student:", s.name))
    .catch((e) => console.error(e.message));

  getStudent(999)
    .then((s) => console.log("Unexpected student:", s))
    .catch((e) => console.log("[Hand-wrapped] Bad Student caught:", e.message));

  // util.promisify comparison:
  getStudentUtil(101)
    .then((s) => console.log("[util.promisify] Good Student (identical behavior):", s.name))
    .catch((e) => console.error(e.message));

  // getScores:
  getScores(101)
    .then((scores) => console.log("[Custom promisify] Good Scores:", scores))
    .catch((e) => console.error(e.message));

  getScores(999)
    .then((scores) => console.log("Unexpected scores:", scores))
    .catch((e) => console.log("[Custom promisify] Bad Scores caught:", e.message));

  // getCourse:
  getCourse("CS-201")
    .then((course) => console.log("[Custom promisify] Good Course:", course.title))
    .catch((e) => console.error(e.message));

  getCourse("INVALID-999")
    .then((course) => console.log("Unexpected course:", course))
    .catch((e) => console.log("[Custom promisify] Bad Course caught:", e.message));

  // getInstructor:
  getInstructor("INST-1")
    .then((inst) => console.log("[Custom promisify] Good Instructor:", inst.name))
    .catch((e) => console.error(e.message));

  getInstructor("UNKNOWN-INST")
    .then((inst) => console.log("Unexpected instructor:", inst))
    .catch((e) => console.log("[Custom promisify] Bad Instructor caught:", e.message));
}

testAll();
