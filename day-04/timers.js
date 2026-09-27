// Day 04 — Task 5 (Part 5.1 - 5.3): timers.js

console.log("=== 5.1: setTimeout Scheduling, Arguments & Cancellation ===");

// Prediction before running:
// Even though 300ms is registered first, the outputs will print in order of delay:
// 1st: "100ms message" -> 2nd: "200ms message" -> 3rd: "300ms message"
setTimeout(() => console.log("[5.1] 300ms message (scheduled 1st, prints 3rd)"), 300);
setTimeout(() => console.log("[5.1] 100ms message (scheduled 2nd, prints 1st)"), 100);
setTimeout(() => console.log("[5.1] 200ms message (scheduled 3rd, prints 2nd)"), 200);

// Passing two extra arguments through setTimeout(fn, ms, a, b):
setTimeout(
  (studentName, studentScore) => {
    console.log(`[5.1 Extra Args] Student ${studentName} scored ${studentScore}`);
  },
  150,
  "Ahmed",
  92
);

// Saving timer ID and cancelling with clearTimeout:
const cancelledId = setTimeout(() => {
  console.log("THIS SHOULD NEVER PRINT!");
}, 50);
clearTimeout(cancelledId);
console.log("[5.1] Cancelled timer ID cleanly before it could fire.");

// Calling sayHi() immediately vs passing sayHi reference:
function sayHi() {
  console.log("[5.1 sayHi()] Executed IMMEDIATELY during argument evaluation (not after 1000ms)!");
}
// Note: In Node.js, passing undefined (the return value of sayHi()) to setTimeout throws ERR_INVALID_ARG_TYPE,
// so we wrap it in try/catch to record the exact behavior:
// Calling sayHi() invokes the function right now on the Call Stack and passes its return value (undefined) to setTimeout.
try {
  setTimeout(sayHi(), 1000);
} catch (err) {
  console.log(`[5.1 sayHi() Result] Passing sayHi() returned undefined to setTimeout -> ${err.code}`);
}

// --- 5.3: The Delay Is a Minimum ---
console.log("\n=== 5.3: Minimum Delay vs Actual Delay (blockFor) ===");

function blockFor(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy-wait blocking the single JavaScript thread
  }
}

const timerStart = Date.now();
setTimeout(() => {
  const actualElapsed = Date.now() - timerStart;
  console.log(`[5.3 Minimum Delay] Asked for 100ms, actually ran after ${actualElapsed}ms!`);
  // Explanation: setTimeout(fn, 100) only guarantees the callback will NOT run BEFORE 100ms;
  // because blockFor(1000) occupied the single Call Stack for 1000ms, the queued callback had to wait until the stack emptied.
}, 100);

blockFor(1000);

// --- 5.2: setInterval Countdown ---
console.log("\n=== 5.2: setInterval Countdown (5 down to 1) ===");

let secondsLeft = 5;
const intervalId = setInterval(() => {
  console.log(`[5.2 Countdown] ${secondsLeft}...`);
  secondsLeft--;

  if (secondsLeft === 0) {
    // Without clearInterval(intervalId), the interval stays registered in Node's active handles
    // and the script keeps printing 0, -1, -2... forever until stopped with Ctrl+C.
    clearInterval(intervalId);
    console.log("[5.2 Countdown] Lift off! (Interval cleared, script will now exit on its own)");
  }
}, 120);
