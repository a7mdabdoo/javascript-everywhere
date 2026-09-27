// Day 04 — Task 7.3: report.js (Grade Library + Parallel Async Report)

const fs = require("fs");
const path = require("path");

// --- Pure Functions from grade-lib.js ---
const isValidScore = (score) =>
  typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;

function letterGrade(score) {
  if (!isValidScore(score)) return "?";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const isPassing = ({ score = 0, passMark = 60 } = {}) =>
  isValidScore(score) && score >= passMark;

const isAtRisk = ({ score = 0, attendance = 0 } = {}) =>
  !isValidScore(score) || score < 60 || (attendance ?? 0) < 70;

function average(numbers = []) {
  if (numbers.length === 0) return 0;
  let sum = 0;
  for (const num of numbers) sum += num;
  return sum / numbers.length;
}

function minMaxStudent(students = []) {
  if (students.length === 0) return [null, null];
  let low = students[0];
  let high = students[0];
  for (const student of students) {
    if (student.score < low.score) low = student;
    if (student.score > high.score) high = student;
  }
  return [low, high];
}

function countByGrade(students = []) {
  const counts = {};
  for (const { score } of students) {
    const grade = letterGrade(score);
    counts[grade] = (counts[grade] ?? 0) + 1;
  }
  return counts;
}

function formatRow({ name = "???", score = 0, attendance = 0 } = {}) {
  const paddedName = `${name}`.padEnd(10);
  const paddedScore = `${score}`.padStart(3);
  const grade = letterGrade(score);
  const safeAtt = `${attendance ?? 0}%`.padStart(4);
  const status = isPassing({ score }) ? "PASS" : "FAIL";
  const riskFlag = isAtRisk({ score, attendance: attendance ?? 0 }) ? "AT-RISK" : "OK";
  return `${paddedName} ${paddedScore}   ${grade}   ${safeAtt}   ${status.padEnd(5)} ${riskFlag}`;
}

const withBonus = ({ score = 0, ...rest } = {}, bonus = 5) => ({
  ...rest,
  score: Math.min(100, score + bonus)
});

const withoutField = (student = {}, field) => {
  const { [field]: omitted, ...rest } = student;
  return rest;
};

// --- Simulated Slow Attendance Service (Variable Delay Per Student ID) ---
const ATTENDANCE_DELAYS = {
  1: 180,
  2: 60,
  3: 140,
  4: 40,
  5: 210,
  6: 90,
  7: 30,
  8: 110,
  9: 75,
  10: 160,
  11: 50,
  12: 125
};

const ATTENDANCE_BACKUP_DB = {
  6: 89 // Karim had missing attendance in JSON, fetched from service
};

function getAttendance(student, callback) {
  const delay = ATTENDANCE_DELAYS[student.id] ?? 80;
  setTimeout(() => {
    const resolvedAttendance = student.attendance ?? ATTENDANCE_BACKUP_DB[student.id] ?? 0;
    callback(null, { delay, attendance: resolvedAttendance });
  }, delay);
}

// --- 1. Demonstrate Error Handling for Missing File & Malformed JSON ---
fs.readFile(path.join(__dirname, "missing-file.json"), "utf8", (err) => {
  if (err) {
    console.log(`[Guard 1: Read Error Handled] Could not read missing-file.json (${err.code})`);
  }
});

try {
  JSON.parse("{ invalid json: true ");
} catch (parseErr) {
  console.log(`[Guard 2: JSON.parse Error Handled] Malformed JSON caught safely (${parseErr.message})`);
}

// --- 2. Main Asynchronous Report Pipeline ---
const filePath = path.join(__dirname, "students.json");

fs.readFile(filePath, "utf8", (err, rawText) => {
  if (err) {
    return console.log(`[Fatal Error] Failed to read students.json: ${err.code} - ${err.message}`);
  }

  let rawStudents;
  try {
    rawStudents = JSON.parse(rawText);
  } catch (parseError) {
    return console.log(`[Fatal Error] students.json contains invalid JSON: ${parseError.message}`);
  }

  console.log(`\n[File Loaded] Parsed ${rawStudents.length} records from students.json. Fetching attendance in parallel...`);

  const parallelStart = Date.now();
  const hydratedStudents = [];
  let finishedCount = 0;
  let sequentialSumMs = 0;

  rawStudents.forEach((student, index) => {
    const expectedDelay = ATTENDANCE_DELAYS[student.id] ?? 80;
    sequentialSumMs += expectedDelay;

    getAttendance(student, (attErr, { delay, attendance }) => {
      // Store by index (hydratedStudents[index] = ...) instead of .push() to preserve original JSON order!
      hydratedStudents[index] = {
        ...student,
        attendance: attErr ? 0 : attendance
      };

      finishedCount++;
      console.log(
        `  -> [Arrived #${String(finishedCount).padStart(2, "0")} after ${String(delay).padStart(3)}ms] ID=${student.id} (${student.name}) -> stored at index [${index}]`
      );

      if (finishedCount === rawStudents.length) {
        const actualParallelMs = Date.now() - parallelStart;
        printFinalReport(hydratedStudents, actualParallelMs, sequentialSumMs);
      }
    });
  });
});

// Prove fs.readFile is non-blocking: this line prints BEFORE the file arrives!
console.log("Loading... (fs.readFile started asynchronously — main thread continues immediately!)");

function printFinalReport(allStudents, actualParallelMs, sequentialSumMs) {
  // Timing comment:
  // Running all 12 attendance requests one-after-another (sequentially) would have taken the sum of all delays (~1325ms).
  // Because we fired all 12 requests in parallel, the total wait time is only the slowest single timer (~210ms)!
  console.log(
    `\n[Timing Proof] Parallel execution took ${actualParallelMs}ms (Sequential one-after-another would have taken ~${sequentialSumMs}ms!)`
  );

  const validStudents = [];
  const validScores = [];
  let skippedInvalid = 0;

  // Destructuring in the loop header + skipping invalid records with `continue`
  for (const student of allStudents) {
    const { name, score } = student;
    if (!isValidScore(score)) {
      skippedInvalid++;
      console.log(`[Skipped Invalid Record] ${name} has invalid score: ${score}`);
      continue;
    }
    validStudents.push(student);
    validScores.push(score);
  }

  console.log("\n================================================");
  console.log("Name       Score Gr   Att    Result Risk");
  console.log("------------------------------------------------");
  for (const student of validStudents) {
    console.log(formatRow(student));
  }
  console.log("------------------------------------------------");

  const [lowest, highest] = minMaxStudent(validStudents);
  console.log(`Valid Students : ${validStudents.length} (Skipped Invalid: ${skippedInvalid})`);
  console.log(`Class Average  : ${average(validScores).toFixed(1)}`);
  console.log(`Highest Student: ${highest.name} (${highest.score})`);
  console.log(`Lowest Student : ${lowest.name} (${lowest.score})`);

  console.log("\n--- Grade Distribution Tally ---");
  const tally = countByGrade(validStudents);
  for (const [grade, count] of Object.entries(tally)) {
    console.log(`Grade ${grade}: ${"█".repeat(count)} (${count})`);
  }

  // Prove immutability with withBonus and withoutField
  const targetStudent = validStudents[4]; // Nour (55)
  const boostedStudent = withBonus(targetStudent, 10);
  const sanitizedStudent = withoutField(targetStudent, "address");
  console.log("\n--- Immutability Proof (withBonus & withoutField) ---");
  console.log(
    `Original ${targetStudent.name} score: ${targetStudent.score} | Boosted copy score: ${boostedStudent.score} (Original untouched!)`
  );
  console.log(`withoutField("address") keys: [${Object.keys(sanitizedStudent).join(", ")}]`);
  console.log("================================================");
}
