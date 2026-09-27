// Day 04 — Task 6.3 & 6.4: flat.js (Escaping Callback Hell + once() Defense)

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

// Note the delays: id=101 takes 120ms in getStudent (+ 3 more steps = ~270ms total),
// while a bad id (999) takes only 30ms and fails immediately at Step 1!
const STUDENT_DELAYS = { 101: 120, 102: 40, 103: 70, 104: 50 };

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
  }, 50);
}

function getCourse(courseId, callback) {
  setTimeout(() => {
    const course = COURSES[courseId];
    if (!course) return callback(new Error(`[COURSES DB] No course found with courseId="${courseId}"`));
    callback(null, { ...course });
  }, 50);
}

function getInstructor(instructorId, callback) {
  setTimeout(() => {
    const instructor = INSTRUCTORS[instructorId];
    if (!instructor) return callback(new Error(`[INSTRUCTORS DB] No instructor found with instructorId="${instructorId}"`));
    callback(null, { ...instructor });
  }, 50);
}

// --- 6.3: Flattened Named Step Functions (No nesting deeper than 1 level, zero mutation) ---

function step1FetchStudent(id, done) {
  getStudent(id, (err, student) => {
    if (err) return done(err);
    step2AttachScores(student, done);
  });
}

function step2AttachScores(student, done) {
  getScores(student.id, (err, scores) => {
    if (err) return done(err);
    // Build a NEW object with spread (no mutation)
    const withScores = { ...student, scores };
    step3AttachCourse(withScores, done);
  });
}

function step3AttachCourse(studentData, done) {
  getCourse(studentData.courseId, (err, course) => {
    if (err) return done(err);
    const withCourse = { ...studentData, course };
    step4AttachInstructor(withCourse, done);
  });
}

function step4AttachInstructor(studentData, done) {
  getInstructor(studentData.course.instructorId, (err, instructor) => {
    if (err) return done(err);
    const avg = (studentData.scores.reduce((a, b) => a + b, 0) / studentData.scores.length).toFixed(1);
    const fullRecord = {
      ...studentData,
      instructor,
      averageScore: Number(avg),
      summary: `${studentData.name} (${studentData.city}) | Avg: ${avg} | Course: ${studentData.course.title} | Instructor: ${instructor.name}`
    };
    done(null, fullRecord);
  });
}

function buildReport(id, done) {
  step1FetchStudent(id, done);
}

console.log("=== Task 6.3: Flattened Async Chain (buildReport) ===");

// Calling buildReport for a good ID (101) and a bad ID (999) at the exact same time:
// Why they finish in this order:
// Even though buildReport(101) is called FIRST, buildReport(999) finishes FIRST!
// Reason: id=999 fails at Step 1 after only 30ms, whereas id=101 succeeds at Step 1 (120ms) and still has to complete Steps 2, 3, and 4 (~270ms total).
buildReport(101, (err, report) => {
  if (err) return console.log(`[buildReport id=101 ERROR] ${err.message}`);
  console.log(`[buildReport id=101 FINISHED 2nd] ${report.summary}`);
});

buildReport(999, (err, report) => {
  if (err) return console.log(`[buildReport id=999 FINISHED 1st (Error)] ${err.message}`);
  console.log(`[buildReport id=999 SUCCESS] ${report.summary}`);
});

// --- 6.4: Defend Yourself with once(fn) ---
setTimeout(() => {
  console.log("\n=== Task 6.4: Defending Against Inversion of Control with once(fn) ===");

  function once(fn) {
    let called = false;
    return (...args) => {
      if (called) return;
      called = true;
      return fn(...args);
    };
  }

  // A badly written library function that forgets `return` and calls its callback TWICE:
  function buggySavePayment(amount, callback) {
    if (amount > 1000) {
      callback(new Error("Amount exceeds daily limit")); // Forgot `return`!
    }
    setTimeout(() => {
      callback(null, `Charged $${amount} successfully`); // Calls callback a 2nd time!
    }, 30);
  }

  console.log("1) Calling buggySavePayment WITHOUT once():");
  buggySavePayment(5000, (err, msg) => {
    console.log("   [Unprotected Callback]", err ? `Error: ${err.message}` : `Success: ${msg}`);
  });

  setTimeout(() => {
    console.log("2) Calling buggySavePayment WITH once() protection:");
    buggySavePayment(
      5000,
      once((err, msg) => {
        console.log("   [Protected by once()]", err ? `Error: ${err.message}` : `Success: ${msg}`);
      })
    );
  }, 60);
}, 320);
