// Day 04 — Bonus Challenges: bonus.js
// Implements: pick, omit (with object rest), groupBy (computed keys), deepMerge, structuredClone vs spread,
// series(tasks, done), withTimeout(fn, ms), retry(fn, times, done), debounce(fn, ms), and Promise getAttendance.

console.log("=== Day 04 Bonus Challenges ===");

// 1. pick(object, keys) and omit(object, keys) using Object Rest
function pick(object = {}, keys = []) {
  const result = {};
  for (const key of keys) {
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
}

function omit(object = {}, keys = []) {
  let current = { ...object };
  for (const key of keys) {
    const { [key]: removed, ...rest } = current;
    current = rest;
  }
  return current;
}

const sampleStudent = { id: 101, name: "Ahmed", score: 95, city: "Qena", secretToken: "xyz-999" };
console.log("[1. pick] ->", pick(sampleStudent, ["name", "score"]));
console.log("[1. omit] ->", omit(sampleStudent, ["secretToken", "id"]));

// 2. groupBy(students, key) using Computed Property Names & ??
function groupBy(items = [], key) {
  let grouped = {};
  for (const item of items) {
    const groupValue = item[key] ?? "Unknown";
    grouped = {
      ...grouped,
      [groupValue]: [...(grouped[groupValue] ?? []), item.name]
    };
  }
  return grouped;
}

const sampleRoster = [
  { name: "Ahmed", city: "Qena" },
  { name: "Mohamed", city: "Cairo" },
  { name: "Abdo", city: "Qena" },
  { name: "Saeed", city: "Alexandria" },
  { name: "Ayman", city: "Cairo" },
  { name: "Abdelkarim", city: "Aswan" }
];
console.log("[2. groupBy city] ->", groupBy(sampleRoster, "city"));

// 3. deepMerge(a, b) — merges nested objects recursively without mutation
const isPlainObject = (val) => typeof val === "object" && val !== null && !Array.isArray(val);

function deepMerge(target = {}, source = {}) {
  const output = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key], value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

const baseSettings = { theme: "dark", grades: { passMark: 60, bonus: 5 } };
const userOverrides = { grades: { passMark: 75 } };
console.log("[3. deepMerge] ->", deepMerge(baseSettings, userOverrides));

// 4. structuredClone vs Manual Nested Spread
const nestedOriginal = { name: "Sara", grades: { midterm: 90, final: 95 } };
const clonedDeep = structuredClone(nestedOriginal);
clonedDeep.grades.midterm = 0;
console.log(
  `[4. structuredClone] Original midterm: ${nestedOriginal.grades.midterm}, Cloned midterm: ${clonedDeep.grades.midterm}`
);

// 5. series(tasks, done) — runs callback-style async functions sequentially, stopping on first error
function series(tasks = [], done) {
  const results = [];
  let index = 0;

  function next() {
    if (index === tasks.length) {
      return done(null, results);
    }
    const currentTask = tasks[index];
    index++;
    currentTask((err, value) => {
      if (err) return done(err, results);
      results.push(value);
      next();
    });
  }

  next();
}

series(
  [
    (cb) => setTimeout(() => cb(null, "Step 1 Complete"), 30),
    (cb) => setTimeout(() => cb(null, "Step 2 Complete"), 20),
    (cb) => setTimeout(() => cb(null, "Step 3 Complete"), 10)
  ],
  (err, results) => {
    console.log("[5. series] ->", err ? err.message : results);
  }
);

// 6. withTimeout(fn, ms) — errors with "Timed out" if fn takes longer than ms, and ignores the late answer
function withTimeout(fn, ms) {
  return (callback) => {
    let settled = false;
    const timerId = setTimeout(() => {
      if (settled) return;
      settled = true;
      callback(new Error(`Timed out after ${ms}ms`));
    }, ms);

    fn((err, data) => {
      if (settled) return; // Ignore late answer!
      settled = true;
      clearTimeout(timerId);
      callback(err, data);
    });
  };
}

const slowQuery = (cb) => setTimeout(() => cb(null, "Late data"), 120);
const guardedQuery = withTimeout(slowQuery, 50);
guardedQuery((err, data) => {
  console.log("[6. withTimeout] ->", err ? err.message : data);
});

// 7. retry(fn, times, done) — retries a failing async function up to `times` attempts
function retry(fn, times, done) {
  let attempt = 0;

  function tryOnce() {
    attempt++;
    fn((err, result) => {
      if (!err) {
        return done(null, `Succeeded on attempt #${attempt}: ${result}`);
      }
      if (attempt >= times) {
        return done(new Error(`Failed after all ${times} attempts: ${err.message}`));
      }
      tryOnce();
    });
  }

  tryOnce();
}

let flakyCounter = 0;
function flakyService(cb) {
  setTimeout(() => {
    flakyCounter++;
    if (flakyCounter < 3) return cb(new Error("Temporary network glitch"));
    cb(null, "200 OK Data");
  }, 15);
}

retry(flakyService, 4, (err, res) => {
  console.log("[7. retry] ->", err ? err.message : res);
});

// 8. Promise version of getAttendance (Teaser for Session 05)
function getAttendancePromise(studentId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ studentId, attendance: 95 });
    }, 40);
  });
}

getAttendancePromise(101).then((res) => {
  console.log("[8. Promise getAttendance] ->", res);
});
