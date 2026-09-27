// Day 04 — Task 5 (Part 5.4 - 5.7): callbacks.js

console.log("=== 5.4: Synchronous vs Asynchronous Callbacks ===");

function repeat(times, callback) {
  for (let i = 0; i < times; i++) {
    callback(i);
  }
}

function repeatLater(times, callback) {
  for (let i = 0; i < times; i++) {
    setTimeout(() => callback(i), 10);
  }
}

// Synchronous repeat: "done" prints AFTER every callback
repeat(3, (i) => console.log(`[5.4 Sync] step ${i}`));
console.log("[5.4 Sync] done (printed AFTER all sync callbacks)");

// Asynchronous repeatLater: "done" prints BEFORE every callback
repeatLater(3, (i) => console.log(`[5.4 Async] step ${i}`));
console.log("[5.4 Async] done (printed BEFORE all async callbacks)");
// How to tell them apart without running them:
// Look at whether the function invokes callback(i) directly on the Call Stack during the loop (synchronous)
// or hands callback(i) to a host API like setTimeout / fs.readFile that queues it for later (asynchronous).

// --- 5.5: You Can't Return From the Future ---
console.log("\n=== 5.5: Returning From setTimeout vs Passing a Callback ===");

function getScoreBroken() {
  setTimeout(() => {
    return 92; // Returns to the timer invoker later, NOT to getScoreBroken!
  }, 20);
}

console.log("[5.5 Broken Return] getScoreBroken() returned:", getScoreBroken()); // undefined

function getScoreLater(callback) {
  setTimeout(() => {
    callback(92);
  }, 30);
}

getScoreLater((score) => {
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
  console.log(`[5.5 Working Callback] Received score ${score} -> Letter Grade: ${grade}`);
});

// --- 5.6: Error-First Callbacks ---
setTimeout(() => {
  console.log("\n=== 5.6: Error-First Callbacks (with Destructuring) ===");

  const STUDENTS_LIST = [
    { id: 1, name: "Ahmed", score: 92 },
    { id: 2, name: "Mohamed", score: 88 },
    { id: 3, name: "Abdo", score: 78 },
    { id: 4, name: "Saeed", score: 95 },
    { id: 5, name: "Ayman", score: 84 },
    { id: 6, name: "Abdelkarim", score: 90 }
  ];

  function findStudent(id, callback) {
    setTimeout(() => {
      const found = STUDENTS_LIST.find((s) => s.id === id);
      if (!found) {
        // The `return` here is mandatory so execution stops and never falls through to the success callback!
        return callback(new Error(`No student found with id=${id}`));
      }
      callback(null, found);
    }, 20);
  }

  // 1. Good ID (destructuring { name, score } = {} right in the callback parameter list):
  findStudent(1, (err, { name, score } = {}) => {
    if (err) return console.log(`[5.6 Error] ${err.message}`);
    console.log(`[5.6 Success] Found ${name} with score ${score}`);
  });

  // 2. Bad ID:
  findStudent(99, (err, { name, score } = {}) => {
    if (err) return console.log(`[5.6 Error] ${err.message}`);
    console.log(`[5.6 Success] Found ${name} with score ${score}`);
  });

  // 3. Demonstrating the bug when `return` is forgotten before callback(err):
  function findStudentBrokenNoReturn(id, callback) {
    setTimeout(() => {
      const found = STUDENTS_LIST.find((s) => s.id === id);
      if (!found) {
        callback(new Error(`Missing return bug for id=${id}`)); // Forgot `return`!
      }
      callback(null, found ?? { name: "Ghost", score: 0 }); // Fires a SECOND time!
    }, 30);
  }

  findStudentBrokenNoReturn(404, (err, student) => {
    if (err) return console.log(`[5.6 Called-Twice Demo - Call #1 (Error)] ${err.message}`);
    console.log(`[5.6 Called-Twice Demo - Call #2 (Accidental Success!)] ${student.name}`);
  });
}, 60);

// --- 5.7: Why try/catch Cannot Catch Async Timer Errors ---
setTimeout(() => {
  console.log("\n=== 5.7: Why try/catch Fails on Async Timers & How Error-First Fixes It ===");

  // Explanation: try/catch only catches synchronous exceptions thrown while the `try` block is actively on the Call Stack.
  // By the time a setTimeout callback runs from the Task Queue, the `try` block has already finished and popped off the stack.

  function riskyOperationWithCallback(shouldFail, callback) {
    setTimeout(() => {
      if (shouldFail) {
        return callback(new Error("Database connection timed out inside async timer"));
      }
      callback(null, "Query succeeded");
    }, 20);
  }

  riskyOperationWithCallback(true, (err, data) => {
    if (err) return console.log(`[5.7 Handled Safely via Callback] Caught async error: ${err.message}`);
    console.log(`[5.7 Success] ${data}`);
  });
}, 140);
