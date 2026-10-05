// Day 05 — Task 6.1: CommonJS report.js
// Destructuring required functions from lib/grade-lib:
const { letterGrade, average, formatRow } = require("./lib/grade-lib");
const gradeLib = require("./lib/grade-lib");
const delay = require("./lib/delay");

// Loading JSON with require (no fs, no JSON.parse needed in CJS):
const students = require("./students.json");

async function runReport() {
  console.log("=== Task 6.1: CommonJS Grade Report ===");
  console.log("Loaded students synchronously via require(): count =", students.length);

  // Proving private helper is NOT visible:
  console.log("Is private helper visible from gradeLib?", gradeLib._privateSanitize !== undefined ? "YES (LEAKED)" : "NO (Properly Hidden)");

  console.log("\nName         Score Grade Att.  Status");
  console.log("-------------------------------------");
  for (const s of students) {
    console.log(formatRow(s));
  }
  console.log("-------------------------------------");
  const avgScore = average(students.map((s) => s.score)).toFixed(1);
  console.log(`Class Average: ${avgScore} (Letter: ${letterGrade(Number(avgScore))})`);

  await delay(50);
  console.log("\n[CJS delay test] Waited 50ms successfully using required delay.js");
}

runReport();
