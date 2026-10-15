/**
 * Day 06 — Task 12: Migrated callbacks.ts
 * Strictly typed callbacks and error-first patterns.
 */

console.log("=== 5.4: Synchronous vs Asynchronous Callbacks ===");

export type StepCallback = (step: number) => void;

export function repeat(times: number, callback: StepCallback): void {
  for (let i = 0; i < times; i++) {
    callback(i);
  }
}

export function repeatLater(times: number, callback: StepCallback): void {
  for (let i = 0; i < times; i++) {
    setTimeout(() => callback(i), 10);
  }
}

// Synchronous repeat:
repeat(3, (i: number) => console.log(`[5.4 Sync] step ${i}`));
console.log("[5.4 Sync] done (printed AFTER all sync callbacks)");

// Asynchronous repeatLater:
repeatLater(3, (i: number) => console.log(`[5.4 Async] step ${i}`));
console.log("[5.4 Async] done (printed BEFORE all async callbacks)");


console.log("\n=== 5.5: Returning From setTimeout vs Passing a Callback ===");

export function getScoreBroken(): void {
  setTimeout(() => {
    // Cannot return from the future!
  }, 20);
}
console.log("[5.5 Broken Return] getScoreBroken() returned:", getScoreBroken()); // undefined

export type ScoreCallback = (score: number) => void;

export function getScoreLater(callback: ScoreCallback): void {
  setTimeout(() => {
    callback(92);
  }, 30);
}

getScoreLater((score: number) => {
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
  console.log(`[5.5 Working Callback] Received score ${score} -> Letter Grade: ${grade}`);
});


// 5.6: Error-First Callbacks with Strict Types:
setTimeout(() => {
  console.log("\n=== 5.6: Error-First Callbacks ===");

  interface StudentItem {
    id: number;
    name: string;
    score: number;
  }

  const STUDENTS_LIST: StudentItem[] = [
    { id: 1, name: "Ahmed", score: 92 },
    { id: 2, name: "Mohamed", score: 88 },
    { id: 3, name: "Abdo", score: 78 },
    { id: 4, name: "Saeed", score: 95 },
    { id: 5, name: "Ayman", score: 84 },
    { id: 6, name: "Abdelkarim", score: 90 },
  ];

  type StudentCallback = (err: Error | null, student?: StudentItem) => void;

  function findStudent(id: number, callback: StudentCallback): void {
    setTimeout(() => {
      const found = STUDENTS_LIST.find((s) => s.id === id);
      if (!found) {
        return callback(new Error(`No student found with id=${id}`));
      }
      callback(null, found);
    }, 20);
  }

  // 1. Good ID:
  findStudent(1, (err, student) => {
    if (err) return console.log(`[5.6 Error] ${err.message}`);
    if (student) console.log(`[5.6 Success] Found ${student.name} with score ${student.score}`);
  });

  // 2. Bad ID:
  findStudent(99, (err, student) => {
    if (err) return console.log(`[5.6 Error] ${err.message}`);
    if (student) console.log(`[5.6 Success] Found ${student.name} with score ${student.score}`);
  });
}, 60);


// 5.7: Safe error-first async operations:
setTimeout(() => {
  console.log("\n=== 5.7: Error-First Pattern Handling ===");

  type ResultCallback = (err: Error | null, data?: string) => void;

  function riskyOperationWithCallback(shouldFail: boolean, callback: ResultCallback): void {
    setTimeout(() => {
      if (shouldFail) {
        return callback(new Error("Database connection timed out inside async timer"));
      }
      callback(null, "Query succeeded");
    }, 20);
  }

  riskyOperationWithCallback(true, (err, data) => {
    if (err) return console.log(`[5.7 Handled Safely via Callback] Caught async error: ${err.message}`);
    if (data) console.log(`[5.7 Success] ${data}`);
  });
}, 140);
