/**
 * Day 06 — Task 11: Typed Browser DOM Application
 * main.ts
 */

import type { Student, GradedStudent } from "./types.ts";
import {
  isStudent,
  letterGrade,
  isPassing,
  formatPercentage,
  withTimeout,
  delay,
  getAttendance,
} from "./lib/index.ts";

// 1. Strongly typed DOM element references:
const btnLoad = document.getElementById("btnLoad") as HTMLButtonElement | null;
const btnTimeBoth = document.getElementById("btnTimeBoth") as HTMLButtonElement | null;
const chkSlowNetwork = document.getElementById("chkSlowNetwork") as HTMLInputElement | null;
const statusDiv = document.getElementById("status") as HTMLDivElement | null;
const timingOutput = document.getElementById("timingOutput") as HTMLDivElement | null;
const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement | null;
const summaryBar = document.getElementById("summaryBar") as HTMLDivElement | null;
const addStudentForm = document.getElementById("addStudentForm") as HTMLFormElement | null;

// Application state:
let students: GradedStudent[] = [];

/**
 * Render table without innerHTML interpolation (safe DOM manipulation)
 */
function renderTable(list: GradedStudent[], failedCount: number = 0): void {
  if (!tableBody || !summaryBar) return;

  // Clear existing rows safely:
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  if (list.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.style.textAlign = "center";
    cell.style.color = "#64748b";
    cell.style.padding = "1.5rem";
    cell.textContent = "No valid student data found.";
    row.appendChild(cell);
    tableBody.appendChild(row);
    summaryBar.textContent = "Total: 0 | Average: —";
    return;
  }

  for (const s of list) {
    const row = document.createElement("tr");

    // ID
    const tdId = document.createElement("td");
    tdId.textContent = String(s.id);
    row.appendChild(tdId);

    // Name
    const tdName = document.createElement("td");
    tdName.textContent = s.name;
    row.appendChild(tdName);

    // Score
    const tdScore = document.createElement("td");
    tdScore.textContent = s.score.toFixed(1);
    row.appendChild(tdScore);

    // Grade
    const tdGrade = document.createElement("td");
    tdGrade.textContent = s.letterGrade;
    row.appendChild(tdGrade);

    // Attendance
    const tdAtt = document.createElement("td");
    tdAtt.textContent = formatPercentage(s.attendance);
    row.appendChild(tdAtt);

    // Status Badge
    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = s.passed ? "badge badge-pass" : "badge badge-fail";
    badge.textContent = s.passed ? "PASS" : "FAIL";
    tdStatus.appendChild(badge);
    row.appendChild(tdStatus);

    tableBody.appendChild(row);
  }

  const avg = (list.reduce((sum, s) => sum + s.score, 0) / list.length).toFixed(1);
  summaryBar.textContent = `Total Valid: ${list.length} | Average: ${avg} | Attendance Lookups Failed: ${failedCount}`;
}

/**
 * Load students with timeout guard, type-guard validation, and parallel attendance
 */
async function handleLoadStudents(): Promise<void> {
  if (!btnLoad || !statusDiv) return;

  btnLoad.disabled = true;
  statusDiv.style.color = "#2563eb";
  statusDiv.textContent = "Loading students and validating records...";

  try {
    if (chkSlowNetwork?.checked) {
      statusDiv.textContent = "Simulating slow connection (>2000ms)...";
      await delay(2500);
    }

    const fetchPromise = fetch("./students.json").then((res) => {
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return res.json() as Promise<unknown>;
    });

    const rawData = await withTimeout(fetchPromise, 2000);
    if (!Array.isArray(rawData)) {
      throw new Error("Invalid student data: Expected an array");
    }

    // Type Guard filter:
    const validRawStudents: Student[] = rawData.filter(isStudent);

    // Fetch attendance in parallel using Promise.allSettled:
    const attendanceOutcomes = await Promise.allSettled(
      validRawStudents.map((s) => getAttendance(s.id))
    );

    let failedLookups = 0;
    students = validRawStudents.map((s, idx) => {
      const outcome = attendanceOutcomes[idx];
      let att: number | null = null;
      if (outcome !== undefined && outcome.status === "fulfilled") {
        att = outcome.value;
      } else {
        failedLookups++;
      }

      return {
        ...s,
        letterGrade: letterGrade(s.score),
        passed: isPassing(s.score),
        attendance: att,
      };
    });

    renderTable(students, failedLookups);
    statusDiv.style.color = "#16a34a";
    statusDiv.textContent = `Loaded ${students.length} valid students (${failedLookups} attendance lookup${failedLookups === 1 ? "" : "s"} failed shown as '—').`;
  } catch (err: unknown) {
    statusDiv.style.color = "#dc2626";
    const msg = err instanceof Error ? err.message : String(err);
    statusDiv.textContent = `Error loading students: ${msg}`;
  } finally {
    // Re-enable button in finally ONLY:
    btnLoad.disabled = false;
  }
}

/**
 * Benchmark: Sequential vs Parallel Attendance Lookups
 */
async function handleTimeBoth(): Promise<void> {
  if (students.length === 0) {
    alert("Please click 'Load Students' first!");
    return;
  }
  if (!timingOutput) return;

  timingOutput.style.display = "block";
  timingOutput.textContent = "Running sequential vs parallel timing test on attendance...";

  const sampleIds = students.slice(0, 4).map((s) => s.id);

  // Sequential:
  const startSeq = performance.now();
  for (const id of sampleIds) {
    try {
      await getAttendance(id);
    } catch {
      // ignore in benchmark
    }
  }
  const seqTime = (performance.now() - startSeq).toFixed(1);

  // Parallel:
  const startPar = performance.now();
  await Promise.allSettled(sampleIds.map((id) => getAttendance(id)));
  const parTime = (performance.now() - startPar).toFixed(1);

  const speedup = (Number(seqTime) / Math.max(1, Number(parTime))).toFixed(1);
  timingOutput.textContent =
    `[Benchmark on 4 students]\n` +
    `Sequential (for...of + await) : ${seqTime}ms\n` +
    `Parallel   (Promise.allSettled): ${parTime}ms\n` +
    `Speedup    : ${speedup}x faster using parallel!`;
}

/**
 * Add student form handler: Immutable state update
 */
function handleAddStudent(e: SubmitEvent): void {
  e.preventDefault();
  const nameInput = document.getElementById("inputName") as HTMLInputElement | null;
  const scoreInput = document.getElementById("inputScore") as HTMLInputElement | null;
  const attInput = document.getElementById("inputAttendance") as HTMLInputElement | null;

  if (!nameInput || !scoreInput || !statusDiv) return;

  const name = nameInput.value.trim();
  const score = Number(scoreInput.value);
  const attRate = attInput && attInput.value !== "" ? Number(attInput.value) / 100 : null;

  if (!name || Number.isNaN(score) || score < 0 || score > 100) return;

  const nextId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 101;
  const newStudent: GradedStudent = {
    id: nextId,
    name,
    score,
    letterGrade: letterGrade(score),
    passed: isPassing(score),
    attendance: attRate,
  };

  // Immutable append:
  students = [...students, newStudent];
  renderTable(students);

  addStudentForm?.reset();
  statusDiv.style.color = "#16a34a";
  statusDiv.textContent = `Added ${name} (Score: ${score}, Grade: ${newStudent.letterGrade}, Status: ${newStudent.passed ? "PASS" : "FAIL"}).`;
}

// Event wiring:
btnLoad?.addEventListener("click", () => void handleLoadStudents());
btnTimeBoth?.addEventListener("click", () => void handleTimeBoth());
addStudentForm?.addEventListener("submit", (e) => handleAddStudent(e as SubmitEvent));
