/**
 * Day 06 — Task 3: Special Types Lab
 * special-lab.ts
 */

console.log("=== Part 3.1 — any, unknown, void, never ===");

// 1. One 'any' on purpose that lets a bug slip through:
const badApiResponse: any = { status: 200, payload: { studentName: "Sara" } };
try {
  // Developer made a typo: 'pyload' instead of 'payload'
  console.log("Bug with any:", badApiResponse.pyload.studentName.toUpperCase());
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Caught runtime crash allowed by any:", err.message);
  }
}

// 2. Changing to unknown and narrowing safely:
const safeApiResponse: unknown = { status: 200, payload: { studentName: "Sara" } };
// safeApiResponse.payload // error TS18046: 'safeApiResponse' is of type 'unknown'.

if (
  typeof safeApiResponse === "object" &&
  safeApiResponse !== null &&
  "payload" in safeApiResponse
) {
  const payload = (safeApiResponse as { payload: unknown }).payload;
  if (typeof payload === "object" && payload !== null && "studentName" in payload) {
    const student = payload as { studentName: unknown };
    if (typeof student.studentName === "string") {
      console.log("Safely narrowed unknown:", student.studentName.toUpperCase());
    }
  }
}

// 3. void function vs undefined:
// 'void' tells callers: "do not care about or use any return value from this function".
// 'undefined' means the function explicitly returns the literal value `undefined`.
function logActivity(activity: string): void {
  console.log(`[LOG]: Student performed: ${activity}`);
}
logActivity("Submitted Lab 02");

// 4. never function that always throws:
function panic(message: string): never {
  throw new Error(`CRITICAL SYSTEM FAILURE: ${message}`);
}

try {
  panic("Database connection lost");
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Caught never function throw:", err.message);
  }
}

// 5. Parameter without type (recorded error):
// function calculateRatio(val) { return val * 2; }
// error TS7006: Parameter 'val' implicitly has an 'any' type.


console.log("\n=== Part 3.2 — Literals, Unions, Intersections, Aliases ===");

// 1. Two literal unions:
type CourseStatus = "enrolled" | "completed" | "dropped" | "waitlisted";
type CreditHours = 1 | 2 | 3 | 4;

const myCourseStatus: CourseStatus = "enrolled";
const courseCredits: CreditHours = 3;
console.log({ myCourseStatus, courseCredits });
// Invalid values (recorded):
// const invalidStatus: CourseStatus = "graduated"; // error TS2322: Type '"graduated"' is not assignable to type 'CourseStatus'.
// const invalidCredits: CreditHours = 5; // error TS2322: Type '5' is not assignable to type 'CreditHours'.

// 2. Union of different kinds:
type IdOrCode = number | string;
function formatIdentifier(id: IdOrCode): string {
  if (typeof id === "number") {
    return `STUDENT_ID_${id.toString().padStart(4, "0")}`;
  }
  return `COURSE_CODE_${id.toUpperCase()}`;
}
console.log(formatIdentifier(32));
console.log(formatIdentifier("cs201"));

// 3. Object type aliases and intersection with &:
type UserBase = {
  id: number;
  email: string;
};

type StudentProfile = {
  gpa: number;
  major: string;
};

type FullStudent = UserBase & StudentProfile;

const enrolledStudent: FullStudent = {
  id: 101,
  email: "a7md.m.3bdo@gmail.com",
  gpa: 3.82,
  major: "Computer Science & AI",
};
console.log("Full Student Intersection:", enrolledStudent);

// Missing property error (recorded):
// const missingGpa: FullStudent = { id: 102, email: "sara@svnu.edu", major: "AI" };
// error TS2741: Property 'gpa' is missing in type '{ id: number; email: string; major: string; }' but required in type 'StudentProfile'.


console.log("\n=== Part 3.3 — Enums and as const ===");

// Original enum error (recorded):
// enum Role { Admin, Student }
// error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
// Node runtime error: SyntaxError: Unexpected identifier 'Role'

// Modern 'as const' object pattern:
const Roles = {
  Admin: "ADMIN",
  Student: "STUDENT",
  Instructor: "INSTRUCTOR",
} as const;

// Derived union type from as const object:
type Role = (typeof Roles)[keyof typeof Roles];
// Inferred: "ADMIN" | "STUDENT" | "INSTRUCTOR"

function authorizeAccess(role: Role): boolean {
  return role === Roles.Admin || role === Roles.Instructor;
}

console.log("Student allowed?", authorizeAccess(Roles.Student));
console.log("Direct string allowed?", authorizeAccess("ADMIN")); // Works! Structural string literal
// Invalid call error (recorded):
// authorizeAccess("GUEST"); // error TS2345: Argument of type '"GUEST"' is not assignable to parameter of type 'Role'.


console.log("\n=== Part 3.4 — Assertions ===");

type StudentRecord = {
  id: number;
  name: string;
  enrolled: boolean;
};

// 1. Valid matching JSON:
const goodJson = '{"id":1,"name":"Ahmed Abdo","enrolled":true}';
const parsedGood = JSON.parse(goodJson) as StudentRecord;
console.log("Parsed matching student:", parsedGood.name, "Enrolled:", parsedGood.enrolled);

// 2. Mismatched JSON showing the danger of 'as':
const brokenJson = '{"id":2,"fullName":"Omar"}'; // missing 'name' and 'enrolled', renamed to 'fullName'
const parsedBroken = JSON.parse(brokenJson) as StudentRecord; // TypeScript believes us!
console.log("Danger of 'as' assertion:");
console.log("parsedBroken.name:", parsedBroken.name); // undefined at runtime!
console.log("parsedBroken.enrolled:", parsedBroken.enrolled); // undefined at runtime!

// 3. Freeze object with as const:
const appConfig = {
  apiEndpoint: "https://api.svnu.edu.eg/v1",
  timeoutMs: 3000,
} as const;
// appConfig.timeoutMs = 5000; // error TS2540: Cannot assign to 'timeoutMs' because it is a read-only property.
console.log("as const frozen config:", appConfig);

// 4. Non-null assertion operator (!):
const studentScoresMap = new Map<number, number>([
  [101, 95],
  [102, 88],
]);

// Dangerous use of !:
// const missingScore = studentScoresMap.get(999)!; // compiles fine, but missingScore is undefined!
// console.log(missingScore.toFixed(2)); // TypeError at runtime!

// Safe replacement with proper narrowing check:
const foundScore = studentScoresMap.get(101);
if (foundScore !== undefined) {
  console.log("Safe check score:", foundScore.toFixed(2));
} else {
  console.log("Score not found for student.");
}

// 5. When is 'as' acceptable vs outside data:
// 'as' is acceptable only when the developer has stricter knowledge that TypeScript cannot possibly know
// (e.g. narrowing document.getElementById("app") as HTMLDivElement, or testing mocks).
// For outside data (fetch responses, JSON.parse, localStorage), NEVER use 'as'; instead use Type Guards / Zod schemas to validate at runtime.

