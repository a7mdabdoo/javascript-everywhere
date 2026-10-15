/**
 * Day 06 — Task 5.2: Typed Database
 * typed-db.ts
 */

import type {
  Student,
  Course,
  Instructor,
  StudentFullReport,
} from "./db-types.ts";

// 1. Tables as typed Record constants:
export const STUDENTS: Record<number, Student> = {
  101: { id: 101, name: "Ahmed", city: "Qena", courseId: "CS-201", status: "active", email: "a7md.m.3bdo@gmail.com" },
  102: { id: 102, name: "Mohamed", city: "Cairo", courseId: "AI-305", status: "active" },
  103: { id: 103, name: "Abdo", city: "Alexandria", courseId: "BROKEN-COURSE", status: "suspended" },
  104: { id: 104, name: "Saeed", city: "Giza", courseId: "WEB-999", status: "active", email: "saeed@gmail.com" },
  105: { id: 105, name: "Ayman", city: "Mansoura", courseId: "CS-201", status: "graduated" },
};

export const SCORES: Record<number, number[]> = {
  101: [94, 88, 96],
  102: [85, 91, 89],
  103: [72, 68, 75],
  104: [90, 92, 87],
  105: [82, 79, 85],
};

export const COURSES: Record<string, Course> = {
  "CS-201": { id: "CS-201", title: "Modern JavaScript & Node.js", credits: 4, instructorId: "INST-1", track: "Backend" },
  "AI-305": { id: "AI-305", title: "Machine Learning Foundations", credits: 3, instructorId: "INST-2", track: "AI" },
  "WEB-999": { id: "WEB-999", title: "Full-Stack Architecture", credits: 4, instructorId: "MISSING-INST", track: "Frontend" },
};

export const INSTRUCTORS: Record<string, Instructor> = {
  "INST-1": { id: "INST-1", name: "Eng. Mostafa Saqly", department: "Software Engineering", office: "Hall B-12" },
  "INST-2": { id: "INST-2", name: "Dr. Abdelkarim", department: "Artificial Intelligence" },
};

// 2. Generic lookup helper:
export function lookup<T>(
  table: Record<string | number, T>,
  id: string | number,
  tableName: string,
  delay: number = 30
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      const record = table[id];
      if (record === undefined) {
        return reject(new Error(`[${tableName} DB] No record found for id="${id}"`));
      }
      resolve(record);
    }, delay);
  });
}

// 3. Typed get... functions:
export function getStudent(id: number): Promise<Student> {
  return lookup(STUDENTS, id, "STUDENTS");
}

export function getScores(studentId: number): Promise<number[]> {
  return lookup(SCORES, studentId, "SCORES");
}

export function getCourse(courseId: string): Promise<Course> {
  return lookup(COURSES, courseId, "COURSES");
}

export function getInstructor(instructorId: string): Promise<Instructor> {
  return lookup(INSTRUCTORS, instructorId, "INSTRUCTORS");
}

// 4. buildReport with async/await returning typed StudentFullReport:
export async function buildReport(studentId: number): Promise<StudentFullReport> {
  const student = await getStudent(studentId);
  const scores = await getScores(studentId);
  const course = await getCourse(student.courseId);
  const instructor = await getInstructor(course.instructorId);

  const averageScore = Number(
    (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1)
  );

  return {
    student,
    scores,
    averageScore,
    course,
    instructor,
  };
}

// 5. Safe error message helper:
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

// 6. Main execution:
async function main(): Promise<void> {
  console.log("=== Task 5 — Typed Database Execution ===");

  // 1. Successful report:
  try {
    const report = await buildReport(101);
    console.log(`[Success Report]: ${report.student.name} | Average: ${report.averageScore} | Course: ${report.course.title} (Track: ${report.course.track}) | Instructor: ${report.instructor.name} (Office: ${report.instructor.office ?? "N/A"})`);
  } catch (err: unknown) {
    console.error("[Unexpected Error]:", errorMessage(err));
  }

  // 2. Expected error report (missing course / missing instructor):
  try {
    await buildReport(103); // courseId is 'BROKEN-COURSE'
  } catch (err: unknown) {
    console.log("[Handled DB Error]:", errorMessage(err));
  }
}

await main();

/* =====================================================================
   Task 5.3 — Break It Documentation:
   1. Misspell property name:
      { id: 101, nmae: "Ahmed" }
      error TS2353: Object literal may only specify known properties, and 'nmae' does not exist in type 'Student'.

   2. Leave out required property:
      { id: 101, name: "Ahmed", city: "Qena" } // missing courseId and status
      error TS2741: Property 'courseId' is missing in type '{ id: number; name: string; city: string; }' but required in type 'Student'.

   3. Reassign readonly id:
      const s = STUDENTS[101]!;
      s.id = 999;
      error TS2540: Cannot assign to 'id' because it is a read-only property.

   4. Changing import type to plain import:
      If a module only contains interfaces/types and no runtime code, importing it at runtime
      in Node can cause runtime module errors if not stripped, and TS flags it under verbatimModuleSyntax.

   5. Real mistakes found by types:
      In Day 04, 'instructor.office' was accessed directly without checking if it existed,
      causing 'undefined' in the final string for instructors without offices (Dr. Abdelkarim).
      TypeScript flagged 'office' as optional string | undefined, forcing the nullish coalescing check.
   ===================================================================== */
