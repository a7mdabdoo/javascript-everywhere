/**
 * Day 06 — Task 6.2: Type Guards for Untrusted Data
 * guards.ts
 */

import type { Course } from "./db-types.ts";

console.log("=== Part 6.2 — Type Guards (guards.ts) ===");

export interface ValidatedStudent {
  id: number;
  name: string;
  score: number;
  status: "active" | "graduated" | "suspended";
}

// 1. Helper to safely check if unknown is an object:
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// 2. Custom Type Guard for ValidatedStudent:
export function isStudent(value: unknown): value is ValidatedStudent {
  if (!isRecord(value)) return false;

  // Check required fields & types:
  if (typeof value["id"] !== "number" || !Number.isInteger(value["id"])) return false;
  if (typeof value["name"] !== "string" || value["name"].trim().length === 0) return false;
  if (typeof value["score"] !== "number" || Number.isNaN(value["score"])) return false;

  // Range validation: score must be between 0 and 100
  if (value["score"] < 0 || value["score"] > 100) return false;

  // Literal union validation:
  const allowedStatuses = ["active", "graduated", "suspended"];
  if (typeof value["status"] !== "string" || !allowedStatuses.includes(value["status"])) {
    return false;
  }

  return true;
}

// 3. Second Type Guard for Course:
export function isCourse(value: unknown): value is Course {
  if (!isRecord(value)) return false;
  if (typeof value["id"] !== "string" || value["id"].trim().length === 0) return false;
  if (typeof value["title"] !== "string" || value["title"].trim().length === 0) return false;
  if (typeof value["credits"] !== "number" || value["credits"] < 1) return false;
  if (typeof value["instructorId"] !== "string") return false;

  const allowedTracks = ["Frontend", "Backend", "AI"];
  if (typeof value["track"] !== "string" || !allowedTracks.includes(value["track"])) {
    return false;
  }

  return true;
}

// 4. Untrusted JSON with 6 records (3 valid, 3 broken in distinct ways):
const untrustedJsonString = JSON.stringify([
  { id: 101, name: "Ahmed Abdo", score: 94, status: "active" },             // 1. Valid
  { id: 102, name: "Sara Mohamed", score: 105, status: "active" },           // 2. Broken: score > 100 out of range
  { id: "103", name: "Omar", score: 85, status: "active" },                  // 3. Broken: id is string instead of number
  { id: 104, name: "Fatima", score: 78 },                                    // 4. Broken: missing 'status' field
  "Just a plain string",                                                     // 5. Broken: not an object
  { id: 105, name: "Mostafa", score: 88, status: "graduated" },              // 6. Valid
  { id: 106, name: "Karim", score: 65, status: "suspended" },                // 7. Valid
]);

const rawParsed: unknown = JSON.parse(untrustedJsonString);

if (Array.isArray(rawParsed)) {
  const validStudents: ValidatedStudent[] = rawParsed.filter(isStudent);
  const rejectedCount = rawParsed.length - validStudents.length;

  console.log(`Total parsed records: ${rawParsed.length}`);
  console.log(`Valid records found : ${validStudents.length}`);
  console.log(`Rejected records    : ${rejectedCount}`);
  console.log("Valid student names:", validStudents.map((s) => `${s.name} (${s.score}/100 - ${s.status})`));
}

/* =====================================================================
   Differences and Explanations:

   1. Changing 'value is ValidatedStudent' to 'boolean':
      If we write: function isStudent(value: unknown): boolean
      Then rawParsed.filter(isStudent) returns 'unknown[]'!
      TypeScript does not narrow array elements without the 'value is Type' predicate.

   2. 'raw as ValidatedStudent' vs 'isStudent(raw)':
      - 'raw as ValidatedStudent' is a compile-time blindfold. It produces 0 JavaScript code.
        If 'raw' has the wrong shape or missing fields, it crashes unexpectedly later at runtime.
      - 'isStudent(raw)' runs actual runtime JavaScript checks on typeof, property existence,
        and value boundaries, and ONLY narrows the TypeScript type if every check succeeded.
   ===================================================================== */
