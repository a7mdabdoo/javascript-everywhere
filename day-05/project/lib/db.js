// Task 7: simulated database for attendance
const ATTENDANCE_RECORDS = {
  1: 95,
  2: 62,
  3: 88,
  4: 91,
  5: 70,
  6: 84, // flaky student for testing retry
  7: 96,
  10: 90,
  12: 76
};

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

const attemptCounts = {};

export default function getAttendance(id) {
  const delay = ATTENDANCE_DELAYS[id] ?? 30;
  attemptCounts[id] = (attemptCounts[id] ?? 0) + 1;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // student 6 fails first time, succeeds on retry
      if (id === 6 && attemptCounts[id] === 1) {
        return reject(new Error(`[ATTENDANCE DB] Flaky network error for student id=${id} (attempt 1)`));
      }

      // student 9 missing
      const att = ATTENDANCE_RECORDS[id];
      if (att === undefined) {
        return reject(new Error(`[ATTENDANCE DB] No attendance record found for student id=${id}`));
      }

      resolve(att);
    }, delay);
  });
}
