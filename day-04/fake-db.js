// Day 04 — Task 6.1: fake-db.js
// Custom 4-level relational lookup database simulated with setTimeout and variable delays per ID.

const STUDENTS = {
  101: { id: 101, name: "Ahmed", city: "Qena", courseId: "CS-201" },
  102: { id: 102, name: "Mohamed", city: "Cairo", courseId: "AI-305" },
  103: { id: 103, name: "Abdo", city: "Alexandria", courseId: "BROKEN-COURSE" }, // triggers course error
  104: { id: 104, name: "Saeed", city: "Giza", courseId: "WEB-999" },             // triggers instructor error
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

// 4th Level: INSTRUCTORS (linked from COURSES.instructorId)
const INSTRUCTORS = {
  "INST-1": { id: "INST-1", name: "Eng. Mostafa Saqly", department: "Software Engineering", office: "Hall B-12" },
  "INST-2": { id: "INST-2", name: "Dr. Abdelkarim", department: "Artificial Intelligence", office: "Lab A-04" }
};

// Different delay per ID so requests started together can finish out of order:
const STUDENT_DELAYS = { 101: 120, 102: 40, 103: 70, 104: 50, 105: 60, 106: 45 };

function getStudent(id, callback) {
  const delay = STUDENT_DELAYS[id] ?? 30;
  setTimeout(() => {
    const student = STUDENTS[id];
    if (!student) {
      return callback(new Error(`[STUDENTS DB] No student found with id=${id}`));
    }
    callback(null, { ...student });
  }, delay);
}

function getScores(studentId, callback) {
  setTimeout(() => {
    const scores = SCORES[studentId];
    if (!scores) {
      return callback(new Error(`[SCORES DB] No scores found for studentId=${studentId}`));
    }
    callback(null, [...scores]);
  }, 50);
}

function getCourse(courseId, callback) {
  setTimeout(() => {
    const course = COURSES[courseId];
    if (!course) {
      return callback(new Error(`[COURSES DB] No course found with courseId="${courseId}"`));
    }
    callback(null, { ...course });
  }, 60);
}

function getInstructor(instructorId, callback) {
  setTimeout(() => {
    const instructor = INSTRUCTORS[instructorId];
    if (!instructor) {
      return callback(new Error(`[INSTRUCTORS DB] No instructor found with instructorId="${instructorId}"`));
    }
    callback(null, { ...instructor });
  }, 50);
}

if (typeof module !== "undefined") {
  module.exports = { getStudent, getScores, getCourse, getInstructor };
}
