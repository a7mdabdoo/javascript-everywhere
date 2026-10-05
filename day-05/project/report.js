// Task 7: async report with modules
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
  const studentsUrl = new URL("./students.json", import.meta.url);
  const filePromise = fs.readFile(studentsUrl, "utf8");
  const rawData = await withTimeout(filePromise, 2000);
  const rawStudents = JSON.parse(rawData);

  // filter valid students
  const validStudents = [];
  let invalidCount = 0;

  for (const student of rawStudents) {
    if (isValidScore(student.score)) {
      validStudents.push(student);
    } else {
      invalidCount++;
    }
  }

  // fetch attendance in parallel with retry
  const attendanceResults = await Promise.allSettled(
    validStudents.map((s) => retry(() => getAttendance(s.id), 2, 40))
  );

  const studentsWithAttendance = validStudents.map((student, idx) => {
    const outcome = attendanceResults[idx];
    const attendance = outcome.status === "fulfilled" ? outcome.value : null;
    return { ...student, attendance };
  });

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

  const scores = studentsWithAttendance.map((s) => s.score);
  const avg = average(scores).toFixed(1);
  const tally = countByGrade(studentsWithAttendance);

  console.log(`Total Students Processed : ${rawStudents.length}`);
  console.log(`Valid Records Displayed  : ${validStudents.length}`);
  console.log(`Invalid Records Skipped  : ${invalidCount}`);
  console.log(`Class Average Score      : ${avg} (Grade: ${letterGrade(Number(avg))})`);
  console.log(`Grade Distribution       : A:${tally["A"] ?? 0}, B:${tally["B"] ?? 0}, C:${tally["C"] ?? 0}, D:${tally["D"] ?? 0}, F:${tally["F"] ?? 0}`);

  // bonus test
  const sample = studentsWithAttendance[0];
  const boosted = withBonus(sample, 5);
  console.log(`Immutability Check: Original (${sample.name}) score=${sample.score} | Boosted score=${boosted.score} (Original unchanged: ${sample.score !== boosted.score})`);
} catch (err) {
  console.error("\n[Report Error]:", err.message);
} finally {
  console.log(`\nReport finished in ${Date.now() - startTime}ms`);
}
