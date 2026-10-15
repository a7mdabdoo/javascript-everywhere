/**
 * Day 06 — Task 7: Classes Lab
 * classes-lab.ts
 */

console.log("=== Task 7: Classes Lab ===");

// 7.1 — The Interface
export interface IStudentAccount {
  readonly id: number;
  name: string;
  getAverage(): number;
  addScore(score: number): this;
  formatSummary(): string;
}

// 7.1 — The Class implementing interface
export class StudentAccount implements IStudentAccount {
  // Static counter tracking created instances:
  static totalStudentsCreated: number = 0;

  // Fields declared and typed before constructor:
  readonly id: number;
  name: string;
  readonly enrollmentDate: string;
  #scores: number[]; // True JS runtime private field

  constructor(id: number, name: string) {
    if (id <= 0) throw new Error("Student ID must be positive");
    if (!name.trim()) throw new Error("Student name cannot be empty");

    this.id = id;
    this.name = name;
    this.enrollmentDate = new Date().toISOString();
    this.#scores = [];

    StudentAccount.totalStudentsCreated++;
  }

  // Getter:
  get scoreCount(): number {
    return this.#scores.length;
  }

  // Method with input validation:
  addScore(score: number): this {
    if (typeof score !== "number" || Number.isNaN(score) || score < 0 || score > 100) {
      throw new Error(`Invalid score ${score}. Must be between 0 and 100.`);
    }
    this.#scores.push(score);
    return this; // Method chaining
  }

  getAverage(): number {
    if (this.#scores.length === 0) return 0;
    const sum = this.#scores.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / this.#scores.length).toFixed(1));
  }

  formatSummary(): string {
    return `[Student #${this.id}] ${this.name} | Average: ${this.getAverage()} (${this.scoreCount} exams)`;
  }
}

// 7.2 — Inheritance: GraduateStudentAccount
export class GraduateStudentAccount extends StudentAccount {
  thesisTopic: string;

  constructor(id: number, name: string, thesisTopic: string) {
    super(id, name);
    this.thesisTopic = thesisTopic;
  }

  override formatSummary(): string {
    return `${super.formatSummary()} | Thesis: "${this.thesisTopic}"`;
  }
}

// --- Demonstration & Execution ---

// Method chaining with 3 calls:
const undergrad = new StudentAccount(101, "Ahmed Abdo");
undergrad.addScore(94).addScore(88).addScore(96);
console.log("Undergrad chained summary:", undergrad.formatSummary());

const grad = new GraduateStudentAccount(201, "Sara Mohamed", "AI in Healthcare");
grad.addScore(98).addScore(92);
console.log("Graduate student summary  :", grad.formatSummary());

console.log("Total accounts created:", StudentAccount.totalStudentsCreated);

// Array typed as the INTERFACE holding both classes:
const studentDirectory: IStudentAccount[] = [undergrad, grad];

console.log("\n--- Processing polymorphic directory ---");
for (const student of studentDirectory) {
  console.log(student.formatSummary());

  // Using instanceof to detect child-class objects:
  if (student instanceof GraduateStudentAccount) {
    console.log(` -> Detected Graduate Researcher working on: "${student.thesisTopic}"`);
  }
}

/* =====================================================================
   Task 7.3 — Break It Documentation:

   1. Reassigning readonly field:
      undergrad.id = 999;
      error TS2540: Cannot assign to 'id' because it is a read-only property.

   2. Reading #private field from outside:
      undergrad.#scores;
      error TS18013: Property '#scores' is not accessible outside class 'StudentAccount' because it has a private identifier.

   3. Deleting required interface method:
      Removing 'formatSummary()' from StudentAccount causes:
      error TS2420: Class 'StudentAccount' incorrectly implements interface 'IStudentAccount'.
      Property 'formatSummary' is missing in type 'StudentAccount' but required in type 'IStudentAccount'.

   4. Parameter properties:
      constructor(private name: string) {}
      error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
      (Parameter properties generate runtime code instead of being pure erasable type annotations).

   5. instanceof on interface:
      if (student instanceof IStudentAccount) {}
      error TS2693: 'IStudentAccount' only refers to a type, but is being used as a value here.
      Interfaces are purely compile-time concepts and are erased completely from the JavaScript output;
      they have no representation in memory at runtime to check with 'instanceof'.
   ===================================================================== */
