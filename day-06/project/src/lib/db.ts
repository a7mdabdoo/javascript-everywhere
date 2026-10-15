/**
 * Day 06 — Project Library: Mock Attendance Database
 * db.ts
 */

import { delay } from "./async-utils.ts";

const ATTENDANCE_MAP: Record<number, number> = {
  1: 0.94,
  2: 0.88,
  3: 0.91,
  4: 0.98,
  5: 0.72,
  6: 0.85,
  7: 0.92,
  8: 0.80,
  9: 0.89,
  10: 0.96,
  12: 0.82,
};

export async function getAttendance(id: number): Promise<number> {
  await delay(25);

  // Student 5 intentionally simulates an intermittent server failure on initial lookup:
  if (id === 5) {
    throw new Error(`[Attendance DB]: Temporary outage for student #${id}`);
  }

  const rate = ATTENDANCE_MAP[id];
  if (rate === undefined) {
    throw new Error(`[Attendance DB]: No attendance record for student #${id}`);
  }

  return rate;
}
