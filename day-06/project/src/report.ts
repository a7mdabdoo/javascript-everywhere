/**
 * Day 06 — Task 10.4: Typed Student Grade Report
 * report.ts
 */

import { readFile } from "node:fs/promises";
import type { GradedStudent, Student, LetterGrade } from "./types.ts";
import {
  isStudent,
  letterGrade,
  isPassing,
  formatScore,
  formatPercentage,
  withTimeout,
  retry,
  errorMessage,
  countBy,
  getAttendance,
} from "./lib/index.ts";

const DATA_PATH = new URL("../students.json", import.meta.url);

async function generateReport(): Promise<void> {
  const startTime = Date.now();
  console.log("==========================================================================");
  console.log("             SOUTH VALLEY NATIONAL UNIVERSITY — GRADE REPORT             ");
  console.log("==========================================================================");

  // 1. Read file with timeout guard:
  const rawText = await withTimeout(readFile(DATA_PATH, "utf8"), 2000);

  // 2. Parse as unknown — no 'any' allowed:
  const parsedData: unknown = JSON.parse(rawText);

  if (!Array.isArray(parsedData)) {
    throw new Error("Invalid student data format: Expected a JSON array.");
  }

  // 3. Separate valid students from corrupted/out-of-range records using Type Guard:
  const validStudents: Student[] = [];
  let skippedCount = 0;

  for (const item of parsedData) {
    if (isStudent(item)) {
      validStudents.push(item);
    } else {
      skippedCount++;
    }
  }

  // 4. Fetch attendance in parallel using Promise.allSettled + retry helper:
  const attendanceResults = await Promise.allSettled(
    validStudents.map((s) => retry(() => getAttendance(s.id), 2))
  );

  // 5. Combine students with grades and attendance:
  const gradedStudents: GradedStudent[] = validStudents.map((s, idx) => {
    const outcome = attendanceResults[idx];
    const attendance = outcome !== undefined && outcome.status === "fulfilled" ? outcome.value : null;

    return {
      ...s,
      letterGrade: letterGrade(s.score),
      passed: isPassing(s.score),
      attendance,
    };
  });

  // 6. Print formatted student rows:
  console.log(
    "ID".padEnd(6) +
    "NAME".padEnd(16) +
    "CITY".padEnd(16) +
    "SCORE".padEnd(10) +
    "GRADE".padEnd(8) +
    "ATTENDANCE".padEnd(12) +
    "STATUS"
  );
  console.log("-".repeat(74));

  for (const s of gradedStudents) {
    const city = s.address?.city ?? "N/A";
    const statusText = s.passed ? "PASS" : "FAIL";
    console.log(
      String(s.id).padEnd(6) +
      s.name.padEnd(16) +
      city.padEnd(16) +
      formatScore(s.score).padEnd(10) +
      s.letterGrade.padEnd(8) +
      formatPercentage(s.attendance).padEnd(12) +
      statusText
    );
  }

  console.log("-".repeat(74));

  // 7. Calculate summary metrics:
  const totalValid = gradedStudents.length;
  const passedStudents = gradedStudents.filter((s) => s.passed);
  const totalScore = gradedStudents.reduce((sum, s) => sum + s.score, 0);
  const averageScore = totalValid > 0 ? (totalScore / totalValid).toFixed(1) : "0.0";

  // Grade breakdown via countBy helper:
  const gradeDistribution = countBy(gradedStudents, (s) => s.letterGrade);

  console.log(`Summary Statistics:`);
  console.log(`- Total Processed Valid Students: ${totalValid}`);
  console.log(`- Skipped / Corrupted Records   : ${skippedCount}`);
  console.log(`- Passing Students              : ${passedStudents.length} / ${totalValid} (${Math.round((passedStudents.length / totalValid) * 100)}%)`);
  console.log(`- Class Average Score           : ${averageScore}`);
  console.log(
    `- Grade Distribution            : A: ${gradeDistribution["A"] ?? 0} | ` +
    `B: ${gradeDistribution["B"] ?? 0} | ` +
    `C: ${gradeDistribution["C"] ?? 0} | ` +
    `D: ${gradeDistribution["D"] ?? 0} | ` +
    `F: ${gradeDistribution["F"] ?? 0}`
  );
  console.log(`- Generation Time               : ${Date.now() - startTime}ms`);
  console.log("==========================================================================");
}

try {
  await generateReport();
} catch (err: unknown) {
  console.error("[Fatal Report Error]:", errorMessage(err));
}
