// Day 05 — Task 7.3: project/report.js
// Asynchronous Modular Grade Report using Top-Level Await, ES Modules, and Barrel Imports.

import fs from "node:fs/promises";
import dayjs from "dayjs";
import {
  isValidScore,
  letterGrade,
  average,
  formatRow,
  countByGrade,
  withBonus,
  getAttendance,
  withTimeout,
  retry
} from "./lib/index.js";

const startTime = Date.now();
console.log("Loading student data...");

try {
  // Read students.json safely using import.meta.url and withTimeout
  const studentsUrl = new URL("./students.json", import.meta.url);
  const filePromise = fs.readFile(studentsUrl, "utf8");
  const rawData = await withTimeout(filePromise, 2000);
  const rawStudents = JSON.parse(rawData);

  // 1. Separate valid students from invalid records
  const validStudents = [];
  let invalidCount = 0;

  for (const student of rawStudents) {
    if (isValidScore(student.score)) {
      validStudents.push(student);
    } else {
      invalidCount++;
    }
  }

  // 2. Fetch attendance in parallel using Promise.allSettled + map + retry
  const attendanceResults = await Promise.allSettled(
    validStudents.map((s) => retry(() => getAttendance(s.id), 2, 40))
  );

  // Combine attendance into student objects preserving original order
  const studentsWithAttendance = validStudents.map((student, idx) => {
    const outcome = attendanceResults[idx];
    const attendance = outcome.status === "fulfilled" ? outcome.value : null;
    return { ...student, attendance };
  });

  // 3. Print Report Header & Date
  console.log(`\n======================================================`);
  console.log(`         ACADEMIC GRADE & ATTENDANCE REPORT           `);
  console.log(`         Generated: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}           `);
  console.log(`======================================================`);
  console.log("Name         Score Grade Att.  Status Risk");
  console.log("------------------------------------------------------");

  for (const student of studentsWithAttendance) {
    console.log(formatRow(student));
  }
  console.log("------------------------------------------------------");

  // 4. Summaries & Statistics using imported pure functions
  const scores = studentsWithAttendance.map((s) => s.score);
  const avg = average(scores).toFixed(1);
  const tally = countByGrade(studentsWithAttendance);

  console.log(`Total Students Processed : ${rawStudents.length}`);
  console.log(`Valid Records Displayed  : ${validStudents.length}`);
  console.log(`Invalid Records Skipped  : ${invalidCount}`);
  console.log(`Class Average Score      : ${avg} (Grade: ${letterGrade(Number(avg))})`);
  console.log(`Grade Distribution       : A:${tally["A"] ?? 0}, B:${tally["B"] ?? 0}, C:${tally["C"] ?? 0}, D:${tally["D"] ?? 0}, F:${tally["F"] ?? 0}`);

  // 5. Verify Immutability with withBonus
  const sample = studentsWithAttendance[0];
  const boosted = withBonus(sample, 5);
  console.log(`Immutability Check: Original (${sample.name}) score=${sample.score} | Boosted score=${boosted.score} (Original unchanged: ${sample.score !== boosted.score})`);
} catch (err) {
  console.error("\n[Report Error Caught]:", err.message);
} finally {
  console.log(`\nReport finished in ${Date.now() - startTime}ms`);
}
