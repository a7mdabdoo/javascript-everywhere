// Day 05 — Task 7.2: project/lib/index.js (Barrel File)
// Re-exports all utilities, database lookups, and grading logic.

export * from "./grade-lib.js";
export { default as getAttendance } from "./db.js";
export * from "./async-utils.js";
