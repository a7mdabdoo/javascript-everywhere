/**
 * Day 06 — Task 4.1: Functions Lab
 * functions-lab.ts
 */

console.log("=== Part 4.1 — Functions Lab ===");

// 1. Function and Arrow function with typed parameters and return:
function calculateWeightedScore(exam: number, coursework: number): number {
  return exam * 0.7 + coursework * 0.3;
}

const calculateWeightedScoreArrow = (exam: number, coursework: number): number => {
  return exam * 0.7 + coursework * 0.3;
};

console.log("Function:", calculateWeightedScore(90, 85));
console.log("Arrow:", calculateWeightedScoreArrow(90, 85));

// 2. Default and Optional parameters with '??':
function formatStudentBadge(
  name: string,
  department: string = "Computer Science",
  honorsTitle?: string
): string {
  const title = honorsTitle ?? "Student";
  return `[${department.toUpperCase()}] ${name} (${title})`;
}

console.log(formatStudentBadge("Ahmed Abdo"));
console.log(formatStudentBadge("Sara Mohamed", "AI", "High Honors"));

// 3. Rest parameters function:
function calculateAverage(...scores: number[]): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + s, 0);
  return total / scores.length;
}

console.log("Avg zero args:", calculateAverage());
console.log("Avg one arg :", calculateAverage(88));
console.log("Avg five args:", calculateAverage(90, 85, 92, 78, 95));

// 4. Destructured object parameter:
type StudentSummaryInput = {
  id: number;
  name: string;
  gpa: number;
  active?: boolean;
};

function displayStudentSummary({ id, name, gpa, active = true }: StudentSummaryInput): string {
  return `#${id} - ${name} | GPA: ${gpa.toFixed(2)} | Status: ${active ? "ACTIVE" : "INACTIVE"}`;
}

console.log(displayStudentSummary({ id: 101, name: "Ahmed", gpa: 3.82 }));

// 5. Function type alias and two implementations:
type ScoreTransformer = (score: number) => number;

const addBonusMarks: ScoreTransformer = (s) => Math.min(100, s + 5);
const applyCurveFactor: ScoreTransformer = (s) => Math.round(s * 1.05);

console.log("Bonus 88:", addBonusMarks(88));
console.log("Curved 88:", applyCurveFactor(88));

// 6. Higher-order function taking a callback:
function processStudentScores(scores: number[], transformer: ScoreTransformer): number[] {
  // TypeScript infers 's' as number without explicit annotation inside .map()
  return scores.map((s) => transformer(s));
}

const rawScores = [75, 82, 90];
const adjustedScores = processStudentScores(rawScores, (s) => s + 3);
console.log("Adjusted scores:", adjustedScores);

// 7. Async function and Promise assignment:
async function fetchEnrolledCount(): Promise<number> {
  return 124;
}

async function runAsyncDemo(): Promise<void> {
  // Error without await (recorded):
  // const plainCount: number = fetchEnrolledCount();
  // error TS2322: Type 'Promise<number>' is not assignable to type 'number'.

  const enrolledCount = await fetchEnrolledCount();
  console.log("Async Enrolled Count:", enrolledCount);
}
await runAsyncDemo();

// 8. Function Overloads:
// Signature 1: when passing string, returns string[]
function splitCourse(input: string): string[];
// Signature 2: when passing string array, returns string
function splitCourse(input: string[]): string;
// Implementation signature:
function splitCourse(input: string | string[]): string | string[] {
  if (typeof input === "string") {
    return input.split(",");
  }
  return input.join(", ");
}

const parsedList = splitCourse("CS101,CS102,AI201"); // Inferred return type: string[]
const joinedStr = splitCourse(["CS101", "CS102"]);   // Inferred return type: string
console.log("Overload string -> list:", parsedList);
console.log("Overload list -> string:", joinedStr);

// 9. Recorded argument errors:
// Wrong number of arguments: calculateWeightedScore(90); // error TS2554: Expected 2 arguments, but got 1.
// Wrong type: calculateWeightedScore(90, "85"); // error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
