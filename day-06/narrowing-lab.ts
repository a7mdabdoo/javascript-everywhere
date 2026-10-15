/**
 * Day 06 — Task 4.2-4.4: Narrowing Lab
 * narrowing-lab.ts
 */

console.log("=== Part 4.2 — Literal Unions & Exhaustive Checks ===");

type LetterGrade = "A" | "B" | "C" | "D" | "F";

function letterGrade(score: number): LetterGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function getFeedbackMessage(grade: LetterGrade): string {
  switch (grade) {
    case "A":
      return "Excellent distinction!";
    case "B":
      return "Very good work.";
    case "C":
      return "Good, passed with standard credit.";
    case "D":
      return "Needs improvement, barely passing.";
    case "F":
      return "Failing mark, must repeat course.";
    default: {
      // Exhaustiveness check using 'never':
      const _unreachable: never = grade;
      throw new Error(`Unhandled grade case: ${_unreachable}`);
    }
  }
}

// If we delete e.g. case "F", TypeScript reports:
// error TS2322: Type 'string' is not assignable to type 'never'. Variable '_unreachable' catches the missing case.

console.log("Grade 94:", letterGrade(94), "->", getFeedbackMessage(letterGrade(94)));
console.log("Grade 73:", letterGrade(73), "->", getFeedbackMessage(letterGrade(73)));
console.log("Grade 55:", letterGrade(55), "->", getFeedbackMessage(letterGrade(55)));


console.log("\n=== Part 4.3 — Narrowing Techniques ===");

// 1. parseScore with full member narrowing:
function parseScore(input: number | string | null | undefined): number | null {
  // input is: number | string | null | undefined
  if (input === null || input === undefined) {
    // Narrowed type: null | undefined
    return null;
  }

  if (typeof input === "number") {
    // Narrowed type: number
    if (Number.isNaN(input)) return null;
    return input;
  }

  // Narrowed type: string
  const parsed = Number(input);
  if (Number.isNaN(parsed)) return null;
  return parsed;
}

console.log("parseScore(95)      :", parseScore(95));
console.log("parseScore('88')    :", parseScore("88"));
console.log("parseScore(null)    :", parseScore(null));
console.log("parseScore(undefined):", parseScore(undefined));
console.log("parseScore('abc')   :", parseScore("abc"));

// 2. Narrowing with Array.isArray:
function ensureArray(value: string | string[]): string[] {
  if (Array.isArray(value)) {
    // Narrowed type: string[]
    return value;
  }
  // Narrowed type: string
  return [value];
}
console.log("ensureArray('single'):", ensureArray("single"));
console.log("ensureArray(['a', 'b']):", ensureArray(["a", "b"]));

// 3. Narrowing with instanceof:
function extractErrorMessage(err: Error | string): string {
  if (err instanceof Error) {
    // Narrowed type: Error
    return `[Exception]: ${err.message}`;
  }
  // Narrowed type: string
  return `[String Error]: ${err}`;
}
console.log(extractErrorMessage(new Error("Disk quota exceeded")));
console.log(extractErrorMessage("Invalid session credentials"));

// 4. Narrowing with 'in' operator:
type StudentPerson = { name: string; studentId: number };
type BookItem = { title: string; isbn: string };

function printHeader(item: StudentPerson | BookItem): string {
  if ("name" in item) {
    // Narrowed type: StudentPerson
    return `Student: ${item.name} (#${item.studentId})`;
  }
  // Narrowed type: BookItem
  return `Book: ${item.title} (ISBN: ${item.isbn})`;
}
console.log(printHeader({ name: "Ahmed", studentId: 32 }));
console.log(printHeader({ title: "Design Patterns", isbn: "978-0201633610" }));


console.log("\n=== Part 4.4 — Handling null and undefined ===");

type Course = { id: number; name: string };
const courseCatalog: Course[] = [
  { id: 101, name: "Algorithms" },
  { id: 102, name: "Computer Networks" },
];

// Three ways to handle .find() undefined:
const foundCourse = courseCatalog.find((c) => c.id === 999);

// 1. Using 'if':
if (foundCourse) {
  console.log("Found via if:", foundCourse.name);
} else {
  console.log("Found via if: Course not found");
}

// 2. Using optional chaining (?.):
const courseNameSafe = foundCourse?.name;
console.log("Optional chaining (?.):", courseNameSafe); // undefined

// 3. Using nullish coalescing (??):
const displayName = foundCourse?.name ?? "Default: General Elective";
console.log("Nullish coalescing (??):", displayName);

// Reading array by index with noUncheckedIndexedAccess:
const firstItem = courseCatalog[0]; // Type: Course | undefined
if (firstItem !== undefined) {
  console.log("Safe index access:", firstItem.name);
}

const outOfBoundsItem = courseCatalog[10]; // Type: Course | undefined
const safeItemName = outOfBoundsItem !== undefined ? outOfBoundsItem.name : "None";
console.log("Out of bounds index:", safeItemName);
