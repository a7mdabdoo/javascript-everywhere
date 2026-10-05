// Day 05 — Task 8: project/main.js
// Client-side Browser Entry Point importing the exact same lib/ modules as Node.js report!

import {
  PASS_MARK,
  isValidScore,
  letterGrade,
  isPassing,
  isAtRisk,
  average
} from "./lib/grade-lib.js";

import getAttendance from "./lib/db.js";
import { delay, withTimeout } from "./lib/async-utils.js";

// DOM Elements
const btnLoad = document.getElementById("btnLoad");
const btnTimeBoth = document.getElementById("btnTimeBoth");
const chkSlowNetwork = document.getElementById("chkSlowNetwork");
const statusDiv = document.getElementById("status");
const timingOutput = document.getElementById("timingOutput");
const tableBody = document.getElementById("tableBody");
const summaryBar = document.getElementById("summaryBar");
const addStudentForm = document.getElementById("addStudentForm");

// Local in-memory state:
let students = [];

/**
 * Render the student records in the HTML table
 */
function renderTable(studentList, failedAttendanceCount = 0) {
  if (studentList.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 1.5rem;">No students loaded.</td></tr>`;
    summaryBar.innerHTML = `<span>Total: 0</span><span>Average Score: —</span><span>Attendance Failures: 0</span>`;
    return;
  }

  tableBody.innerHTML = studentList
    .map((s) => {
      const grade = letterGrade(s.score);
      const passing = isPassing({ score: s.score });
      const atRisk = isAtRisk({ score: s.score, attendance: s.attendance ?? 0 });
      const attDisplay = s.attendance !== null && s.attendance !== undefined ? `${s.attendance}%` : "—";

      return `
        <tr>
          <td>${s.id}</td>
          <td><strong>${s.name}</strong></td>
          <td>${s.score}</td>
          <td><strong>${grade}</strong></td>
          <td>${attDisplay}</td>
          <td><span class="badge ${passing ? "badge-pass" : "badge-fail"}">${passing ? "PASS" : "FAIL"}</span></td>
          <td><span class="badge ${atRisk ? "badge-risk" : "badge-ok"}">${atRisk ? "AT-RISK" : "OK"}</span></td>
        </tr>
      `;
    })
    .join("");

  const validScores = studentList.filter((s) => isValidScore(s.score)).map((s) => s.score);
  const avg = average(validScores).toFixed(1);

  summaryBar.innerHTML = `
    <span>Total Students: ${studentList.length}</span>
    <span>Class Average: ${avg} (Grade: ${letterGrade(Number(avg))})</span>
    <span>Attendance Failures: ${failedAttendanceCount}</span>
  `;
}

/**
 * 8.2 — Load Students with await, try/catch, and button re-enabled in FINALLY ONLY
 */
async function handleLoadStudents() {
  btnLoad.disabled = true;
  statusDiv.style.color = "#2563eb";
  statusDiv.textContent = "Loading students and fetching attendance in parallel...";

  try {
    // If simulate slow network is checked, sleep 2500ms to trip 2000ms timeout
    if (chkSlowNetwork.checked) {
      statusDiv.textContent = "Simulating slow network connection (>2s)...";
      await delay(2500);
    }

    // Fetch students.json with timeout guard
    const fetchPromise = fetch("./students.json").then((res) => {
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return res.json();
    });

    const data = await withTimeout(fetchPromise, 2000);

    // Filter valid students like Day 04:
    const validStudents = data.filter((s) => isValidScore(s.score));

    // Parallel attendance fetching with Promise.allSettled:
    const attendanceResults = await Promise.allSettled(
      validStudents.map((s) => getAttendance(s.id))
    );

    let failedLookups = 0;
    students = validStudents.map((student, idx) => {
      const outcome = attendanceResults[idx];
      let att = null;
      if (outcome.status === "fulfilled") {
        att = outcome.value;
      } else {
        failedLookups++;
      }
      return { ...student, attendance: att };
    });

    renderTable(students, failedLookups);

    statusDiv.style.color = "#16a34a";
    statusDiv.textContent = `Successfully loaded ${students.length} students. (${failedLookups} attendance lookup${failedLookups === 1 ? "" : "s"} failed and shown as '—').`;
  } catch (err) {
    statusDiv.style.color = "#dc2626";
    statusDiv.textContent = `Error loading students: ${err.message}`;
  } finally {
    // Re-enable button in FINALLY ONLY!
    btnLoad.disabled = false;
  }
}

/**
 * 8.2 — Timing comparison: Sequential vs Parallel Attendance
 */
async function handleTimeBoth() {
  if (students.length === 0) {
    alert("Please click 'Load Students' first!");
    return;
  }

  timingOutput.style.display = "block";
  timingOutput.textContent = "Running sequential vs parallel timing test on attendance...";

  const sampleIds = students.slice(0, 4).map((s) => s.id);

  // Sequential
  const startSeq = performance.now();
  for (const id of sampleIds) {
    try {
      await getAttendance(id);
    } catch {
      // ignore in benchmark
    }
  }
  const seqTime = (performance.now() - startSeq).toFixed(1);

  // Parallel
  const startPar = performance.now();
  await Promise.allSettled(sampleIds.map((id) => getAttendance(id)));
  const parTime = (performance.now() - startPar).toFixed(1);

  timingOutput.textContent =
    `[Benchmark on 4 students]\n` +
    `Sequential (for...of + await) : ${seqTime}ms\n` +
    `Parallel   (Promise.allSettled): ${parTime}ms\n` +
    `Speedup    : ${(Number(seqTime) / Math.max(1, Number(parTime))).toFixed(1)}x faster using parallel!`;
}

/**
 * 8.2 — Add student form handler: Immutable state update [ ...students, newStudent ]
 */
function handleAddStudent(e) {
  e.preventDefault();
  const nameInput = document.getElementById("inputName");
  const scoreInput = document.getElementById("inputScore");
  const attInput = document.getElementById("inputAttendance");

  const name = nameInput.value.trim();
  const score = Number(scoreInput.value);
  const attendance = attInput.value !== "" ? Number(attInput.value) : null;

  if (!name || isNaN(score)) return;

  const nextId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 101;
  const newStudent = { id: nextId, name, score, attendance };

  // Immutable append:
  students = [...students, newStudent];
  renderTable(students);

  // Reset form
  addStudentForm.reset();
  statusDiv.style.color = "#16a34a";
  statusDiv.textContent = `Added ${name} (Score: ${score}, Grade: ${letterGrade(score)}, Status: ${isPassing({ score }) ? "PASS" : "FAIL"}).`;
}

// Wire events via addEventListener (no onclick in HTML)
btnLoad.addEventListener("click", handleLoadStudents);
btnTimeBoth.addEventListener("click", handleTimeBoth);
addStudentForm.addEventListener("submit", handleAddStudent);
