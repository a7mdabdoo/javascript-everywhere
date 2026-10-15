/**
 * Day 06 — Task 2: Data Types Lab
 * types-lab.ts
 */

console.log("=== Part 2.1 — Annotate and Infer ===");

// Five variables without annotations (types inferred):
const studentName = "Ahmed Abdo"; // Inferred: "Ahmed Abdo" (literal string)
let currentSemester = 3;           // Inferred: number
let isEnrolled = true;              // Inferred: boolean
const completedCourses = ["CS101", "Math2", "Algorithms"]; // Inferred: string[]
const university = "SVNU";          // Inferred: "SVNU" (literal string)

console.log({ studentName, currentSemester, isEnrolled, completedCourses, university });

// Redundant annotation (could be inferred):
const campusLocation: string = "Qena National"; // Normally omitted to avoid noise; TS infers "Qena National"

// let vs const inference:
let letterGradeLet = "A";  // Inferred: string (can be reassigned to any string later)
const letterGradeConst = "A"; // Inferred: "A" (literal type, cannot change)
// Type error if reassigned:
// currentSemester = "three"; // error TS2322: Type 'string' is not assignable to type 'number'.


console.log("\n=== Part 2.2 — The Primitives ===");

// 1. String with template literal and 3 methods:
const welcomeMsg = `Welcome ${studentName} to Year ${currentSemester} at ${university}!`;
console.log(welcomeMsg.toUpperCase());
console.log(welcomeMsg.includes("SVNU"));
console.log(welcomeMsg.slice(0, 15).trim());

// 2. Numbers (whole, decimal, negative) & IEEE-754 quirks:
const examScore = 94;
const gpa = 3.82;
const balanceDeduction = -150;
console.log("Scores:", examScore, gpa, balanceDeduction);
console.log("0.1 + 0.2 =", 0.1 + 0.2); // 0.30000000000000004 (floating-point binary representation issue)
console.log("10 / 0 =", 10 / 0);       // Infinity (JS does not throw on divide by zero)
console.log("Number('abc') =", Number("abc")); // NaN (failed numeric conversion, but typeof NaN is 'number')

// 3. Boolean from comparison:
const isHonorStudent = gpa >= 3.5 && examScore >= 90;
console.log("Honor student?", isHonorStudent);

// 4. BigInt (> Number.MAX_SAFE_INTEGER):
const largeRecordId: bigint = 9007199254740995n; // larger than 9007199254740991
const nextRecordId = largeRecordId + 1n; // valid
console.log("Record IDs:", largeRecordId, nextRecordId);
// Mixing rejected: const badBig = largeRecordId + 1; // error TS2365: Operator '+' cannot be applied to types 'bigint' and 'number'.

// 5. Symbols:
const symKey1: symbol = Symbol("studentToken");
const symKey2: symbol = Symbol("studentToken");
console.log("Symbols equal?", symKey1 === symKey2); // false (each Symbol is guaranteed unique)

// 6. null vs undefined:
const middleName: string | null = null; // null: explicitly absent by developer/DB choice
let graduationProjectIdea: string | undefined = undefined; // undefined: variable not yet populated/uninitialized
console.log({ middleName, graduationProjectIdea });
// Assign null to plain string rejected:
// const plainStr: string = null; // error TS2322: Type 'null' is not assignable to type 'string'.


console.log("\n=== Part 2.3 — Arrays, Tuples, Objects ===");

// 1. Number[] of scores with map, filter, reduce:
const myScores: number[] = [92, 88, 76, 85, 95];
const curvedScores = myScores.map((s) => s + 2); // Inferred: number[]
const highDistinction = curvedScores.filter((s) => s >= 90); // Inferred: number[]
const averageScore = curvedScores.reduce((acc, curr) => acc + curr, 0) / curvedScores.length; // Inferred: number
console.log({ myScores, curvedScores, highDistinction, averageScore });

// 2. Empty arrays with and without annotation:
const unannotatedEmpty = []; // Inferred: any[] (evolving array)
const annotatedEmpty: string[] = []; // Inferred: string[]
unannotatedEmpty.push("any type");
unannotatedEmpty.push(123);
annotatedEmpty.push("strictly string");
console.log({ unannotatedEmpty, annotatedEmpty });

// 3. Mixed array vs precedence mistake:
const validMixed: (string | number)[] = ["Algorithms", 95, "Database", 88];
// Mistake: string | number[] means EITHER a single string OR an array of numbers!
// const mistake: string | number[] = ["Algorithms", 95]; // error TS2322
console.log("validMixed:", validMixed);

// 4. Readonly array:
const immutableCodes: readonly string[] = ["CS201", "CS202", "AI203"];
// immutableCodes.push("CS204"); // error TS2339: Property 'push' does not exist on type 'readonly string[]'.
console.log("immutableCodes:", immutableCodes);

// 5. Named tuple with optional element & destructuring function:
type CourseGrade = [course: string, score: number, remarks?: string];
const course1: CourseGrade = ["Data Structures", 94, "Excellent"];
const course2: CourseGrade = ["Operating Systems", 86];

function getTopPerformance(): CourseGrade {
  return ["Web Development", 98, "First in Class"];
}
const [topCourse, topScore, topNote] = getTopPerformance();
console.log({ course1, course2, topCourse, topScore, topNote });

// 6. Nested object type with optional property:
type Department = {
  code: string;
  name: string;
  headOfDept?: string; // optional
  courses: Array<{ id: number; title: string; credits: number }>;
};

const csDepartment: Department = {
  code: "AI-CS",
  name: "Computer Science & Artificial Intelligence",
  courses: [
    { id: 201, title: "Discrete Math", credits: 3 },
    { id: 202, title: "Object-Oriented Programming", credits: 4 },
  ],
};
console.log("Department:", csDepartment);
// Extra property error:
// const badDept: Department = { code: "IT", name: "Information Tech", budget: 50000 }; // error TS2353


console.log("\n=== Part 2.4 — Conversions and typeof ===");

// 1. String to number three ways:
const inputVal = "68";
const n1 = Number(inputVal);          // 68
const n2 = Number.parseInt(inputVal); // 68
const n3 = +inputVal;                 // 68
console.log({ n1, n2, n3 });

// Divergence test with alphanumeric string:
const diffInput = "68px";
console.log("Number('68px'):", Number(diffInput));            // NaN
console.log("parseInt('68px'):", Number.parseInt(diffInput)); // 68 (parses leading digits)
console.log("+'68px':", +diffInput);                          // NaN

// 2. Number to string and falsy conversions:
const scoreStr = String(95);
console.log("Number to string:", scoreStr, typeof scoreStr);
console.log("Boolean(0):", Boolean(0));
console.log("Boolean(''):", Boolean(""));
console.log("Boolean(null):", Boolean(null));
console.log("Boolean(undefined):", Boolean(undefined));
console.log("Boolean(NaN):", Boolean(NaN));
console.log("Boolean('0'):", Boolean("0")); // true (non-empty string is truthy)

// 3. typeof table:
console.log("\n--- typeof Table ---");
console.log("string:     ", typeof "Sara");
console.log("number:     ", typeof 42);
console.log("boolean:    ", typeof true);
console.log("bigint:     ", typeof 100n);
console.log("symbol:     ", typeof Symbol());
console.log("undefined:  ", typeof undefined);
console.log("null:       ", typeof null); // 'object' - historical legacy JS quirk
console.log("function:   ", typeof function () {});

// 4. Type annotation never converts values:
const fakeNumber: number = "5" as unknown as number;
console.log("fakeNumber value:", fakeNumber, "| actual typeof:", typeof fakeNumber);
// Result: typeof fakeNumber is 'string' at runtime. TypeScript types disappear at runtime.
