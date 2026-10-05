// Day 05 — Task 3.2: promise-db.js
// Rewriting Day 04 relational database to return Promises directly using a single shared lookup helper.

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

// --- Single Shared Helper: lookup ---
function lookup(table, id, tableName, delay = 40) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const record = table[id];
      if (!record) {
        return reject(new Error(`[${tableName} DB] No record found with id="${id}"`));
      }
      // Return a shallow copy if object/array
      resolve(Array.isArray(record) ? [...record] : { ...record });
    }, delay);
  });
}

function getStudent(id) {
  const customDelay = STUDENT_DELAYS[id] ?? 30;
  return lookup(STUDENTS, id, "STUDENTS", customDelay);
}

function getScores(studentId) {
  return lookup(SCORES, studentId, "SCORES", 40);
}

function getCourse(courseId) {
  return lookup(COURSES, courseId, "COURSES", 40);
}

function getInstructor(instructorId) {
  return lookup(INSTRUCTORS, instructorId, "INSTRUCTORS", 40);
}

if (typeof module !== "undefined") {
  module.exports = {
    STUDENTS,
    SCORES,
    COURSES,
    INSTRUCTORS,
    lookup,
    getStudent,
    getScores,
    getCourse,
    getInstructor
  };
}
