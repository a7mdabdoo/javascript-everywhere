// Day 05 — Task 7.2: project/lib/db.js
// Simulated Attendance Database returning Promises with variable delays, flaky IDs, and permanent failures.

const ATTENDANCE_RECORDS = {
  1: 95,
  2: 62,
  3: 88,
  4: 91,
  5: 70,
  6: 84, // Flaky: fails on first attempt, succeeds on retry
  7: 96,
  10: 90,
  12: 76
};

// Delays per student ID:
const ATTENDANCE_DELAYS = {
  1: 30,
  2: 45,
  3: 25,
  4: 35,
  5: 50,
  6: 40,
  7: 20,
  9: 60,
  10: 30,
  12: 35
};

// Flaky attempt counter for testing retry logic:
const attemptCounts = {};

/**
 * getAttendance(id) - default export
 * @param {number} id
 * @returns {Promise<number>}
 */
export default function getAttendance(id) {
  const delay = ATTENDANCE_DELAYS[id] ?? 30;
  attemptCounts[id] = (attemptCounts[id] ?? 0) + 1;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Student 6 is flaky: fails on attempt 1, succeeds on attempt 2:
      if (id === 6 && attemptCounts[id] === 1) {
        return reject(new Error(`[ATTENDANCE DB] Flaky network error for student id=${id} (attempt 1)`));
      }

      // Student 9 or missing IDs: permanent rejection
      const att = ATTENDANCE_RECORDS[id];
      if (att === undefined) {
        return reject(new Error(`[ATTENDANCE DB] No attendance record found for student id=${id}`));
      }

      resolve(att);
    }, delay);
  });
}
