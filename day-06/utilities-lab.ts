/**
 * Day 06 — Task 9: Utility Types Lab
 * utilities-lab.ts
 */

import type { Student } from "./db-types.ts";
import { STUDENTS, getStudent } from "./typed-db.ts";

console.log("=== Task 9: Utility Types Lab ===");

// 1. Omit: NewStudent creation without 'id':
export type NewStudent = Omit<Student, "id">;

let studentIdCounter = 105;
const localDb: Record<number, Student> = { ...STUDENTS };

export function addStudent(input: NewStudent): Student {
  studentIdCounter++;
  const created: Student = {
    id: studentIdCounter,
    ...input,
  };
  localDb[created.id] = created;
  return created;
}

const newEntry = addStudent({
  name: "Kareem Tarek",
  city: "Qena",
  courseId: "CS-201",
  status: "active",
  email: "kareem@svnu.edu.eg",
});
console.log("1. Added student with Omit:", newEntry);


// 2. Partial + Omit: Safe immutable updates:
export type StudentUpdate = Partial<Omit<Student, "id">>;

export function updateStudent(id: number, changes: StudentUpdate): Student {
  const current = localDb[id];
  if (!current) throw new Error(`Student ${id} not found in database`);

  // Immutable update with spread (no mutation of original current):
  const updated: Student = {
    ...current,
    ...changes,
  };
  localDb[id] = updated;
  return updated;
}

const updatedEntry = updateStudent(101, {
  city: "Luxor",
  status: "graduated",
});
console.log("2. Updated student with Partial<Omit>:", updatedEntry);

// Rejected updates (recorded):
// updateStudent(101, { id: 999 }); // error TS2353: 'id' does not exist in type 'StudentUpdate'
// updateStudent(101, { status: "unknown-status" }); // error TS2322: Type '"unknown-status"' is not assignable to type 'StudentStatus | undefined'


// 3. Pick: Public Card View:
export type StudentCard = Pick<Student, "id" | "name" | "status">;

export function getPublicCard(student: Student): StudentCard {
  return {
    id: student.id,
    name: student.name,
    status: student.status,
  };
}
console.log("3. Public card with Pick:", getPublicCard(updatedEntry));


// 4. Readonly: Deeply immutable snapshot:
const studentSnapshot: Readonly<Student> = { ...updatedEntry };
console.log("4. Readonly student snapshot:", studentSnapshot.name);
// studentSnapshot.name = "Modified Name";
// error TS2540: Cannot assign to 'name' because it is a read-only property.


// 5. Record<LetterGrade, number>: Full grade tally:
export type LetterGrade = "A" | "B" | "C" | "D" | "F";

const gradeTally: Record<LetterGrade, number> = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  F: 0,
};

const sampleScores = [92, 85, 78, 95, 62, 54, 88, 71];
for (const score of sampleScores) {
  if (score >= 90) gradeTally["A"]++;
  else if (score >= 80) gradeTally["B"]++;
  else if (score >= 70) gradeTally["C"]++;
  else if (score >= 60) gradeTally["D"]++;
  else gradeTally["F"]++;
}
console.log("5. Grade tally Record<LetterGrade, number>:", gradeTally);


// 6. ReturnType and Awaited to infer types from existing async functions:
type GetStudentReturn = ReturnType<typeof getStudent>; // Inferred: Promise<Student>
type UnwrappedStudent = Awaited<GetStudentReturn>;     // Inferred: Student

const extractedStudent: UnwrappedStudent = {
  id: 301,
  name: "Nouran Hany",
  city: "Qena",
  courseId: "AI-305",
  status: "active",
};
// 7. as const array and derived union type with (typeof X)[number]:
const VALID_DEPARTMENTS = ["AI", "CS", "IS", "IT"] as const;
type ValidDepartment = (typeof VALID_DEPARTMENTS)[number]; // Inferred: "AI" | "CS" | "IS" | "IT"

const myDept: ValidDepartment = "AI";
console.log("7. Valid department from (typeof X)[number]:", myDept);

/*
   Adding a property to Student interface (e.g. gpa: number):
   Lines in addStudent, localDb records, and getPublicCard would turn red immediately.
   This is great because TypeScript immediately pinpoints every location in the codebase
   where the new required contract must be satisfied, making refactoring safe and error-free.
*/

