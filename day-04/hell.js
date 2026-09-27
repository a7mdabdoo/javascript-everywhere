// Day 04 — Task 6.2: hell.js (The Pyramid of Doom)
// Pasting fake-db.js lookup functions at the top as instructed.

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

const STUDENT_DELAYS = { 101: 80, 102: 40, 103: 60, 104: 50 };

function getStudent(id, callback) {
  setTimeout(() => {
    const student = STUDENTS[id];
    if (!student) return callback(new Error(`[STUDENTS DB] No student found with id=${id}`));
    callback(null, { ...student });
  }, STUDENT_DELAYS[id] ?? 30);
}

function getScores(studentId, callback) {
  setTimeout(() => {
    const scores = SCORES[studentId];
    if (!scores) return callback(new Error(`[SCORES DB] No scores found for studentId=${studentId}`));
    callback(null, [...scores]);
  }, 40);
}

function getCourse(courseId, callback) {
  setTimeout(() => {
    const course = COURSES[courseId];
    if (!course) return callback(new Error(`[COURSES DB] No course found with courseId="${courseId}"`));
    callback(null, { ...course });
  }, 40);
}

function getInstructor(instructorId, callback) {
  setTimeout(() => {
    const instructor = INSTRUCTORS[instructorId];
    if (!instructor) return callback(new Error(`[INSTRUCTORS DB] No instructor found with instructorId="${instructorId}"`));
    callback(null, { ...instructor });
  }, 40);
}

// --- Chaining all 4 levels in Callback Hell (The Pyramid of Doom) ---
function runPyramidLookup(studentId, label) {
  getStudent(studentId, (err, student) => {
    if (err) return console.log(`${label} -> Error at Level 1: ${err.message}`);

    getScores(student.id, (err, scores) => {
      if (err) return console.log(`${label} -> Error at Level 2: ${err.message}`);

      getCourse(student.courseId, (err, course) => {
        if (err) return console.log(`${label} -> Error at Level 3: ${err.message}`);

        getInstructor(course.instructorId, (err, instructor) => {
          if (err) return console.log(`${label} -> Error at Level 4: ${err.message}`);

          // Indentation count at this deepest line: 5 levels deep (10 spaces)!
          const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
          console.log(
            `${label} -> SUCCESS: ${student.name} (${student.city}) | Avg Score: ${avg} | Course: ${course.title} | Instructor: ${instructor.name} (${instructor.office})`
          );
        });
      });
    });
  });
}

console.log("=== Task 6.2: Callback Hell (4-Level Pyramid + 3 Deliberate Failures) ===");

// 1. Valid 4-level chain (Student 101 -> Scores -> Course CS-201 -> Instructor INST-1)
runPyramidLookup(101, "[1. Good Chain id=101]");

// 2. Break #1: Bad Student ID (999)
runPyramidLookup(999, "[2. Bad Student id=999]");

// 3. Break #2: Bad Course ID (Student 103 has courseId: "BROKEN-COURSE")
runPyramidLookup(103, "[3. Bad Course id=103]");

// 4. Break #3: Bad Instructor ID (Student 104 has course WEB-999 with instructorId: "MISSING-INST")
runPyramidLookup(104, "[4. Bad Instructor id=104]");
