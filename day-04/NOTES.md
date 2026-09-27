# Day 04 — Study Notes & Reflections (`NOTES.md`)

---

## Part 1 — Modern ES6+ (Destructuring, Spread, Rest & Safe Access)

### 1. What Destructuring Actually Does (Object vs. Array Matching)
Destructuring unpacks values from an object or array directly into distinct local variables in a single declaration instead of repeating `obj.prop` or `arr[i]` line after line.
- **Object destructuring (`const { name, score } = student`)** matches by **property key name**, so the order in which you list the variables does not matter.
- **Array destructuring (`const [first, second] = tracks`)** matches by **index position**, so variable names can be anything, and skipping positions requires skip-commas (`[, , third]`).

### 2. What `const { a: b } = obj` Creates (and What It Does NOT Create)
It looks up the property key named `a` inside `obj` and assigns its value to a **new variable named `b`**.
It **does NOT create a variable named `a`** — `a` is only the lookup label, so logging `a` throws `ReferenceError: a is not defined`.

### 3. When a Destructuring Default Fires (and Three Values That Do NOT Trigger It)
A default value (`const { score = 0 } = student`) fires **only** when the property value is strictly `undefined` (`value === undefined` or the key is missing entirely).
Three values that do **not** trigger the default are **`null`**, **`0`**, and **`""` (or `false`)**, because JavaScript treats them as defined values rather than `undefined`.

### 4. Why `const { x } = undefined` Throws, and the Fix
JavaScript cannot read properties from `undefined` or `null`, so trying to unpack `{ x }` from `undefined` immediately throws `TypeError: Cannot destructure property 'x' of 'undefined' as it is undefined.`
The fix in function parameters is adding a whole-object default `= {}` at the end: `function f({ x = 10 } = {})`.

### 5. Rest vs. Spread — How to Tell Them Apart at a Glance
- **Rest (`...` on the LEFT of `=` or in a function parameter list `function f(a, ...rest)`)**: **collects** multiple remaining items into a single array or object (and must always come last).
- **Spread (`...` on the RIGHT of `=` inside `[...arr]`, `{ ...obj }`, or inside a function call `Math.max(...scores)`)**: **scatters** one collection out into individual elements or properties.

### 6. What "Shallow Copy" Means (and the Bug from Task 3.5)
A shallow copy (`const copy = { ...original }`) only copies the **top-level properties**. Any nested object or array inside `original` is copied **by reference** (both objects point to the exact same inner object in memory).
In Task 3.5, mutating `shallowCopy.grades.midterm = 0` accidentally changed `originalUser.grades.midterm` from `90` to `0` because `grades` was still shared! We fixed it by spreading the inner level too: `grades: { ...originalUser.grades, midterm: 0 }`.

### 7. Why Spread Order Matters When Merging Defaults
When merging two objects (`{ ...defaults, ...custom }`), if both share the same key, **the last (rightmost) key wins** and overwrites earlier ones. Putting `...defaults` first ensures user `...custom` settings override the defaults; reversing the order (`{ ...custom, ...defaults }`) causes a bug where defaults wipe out the user's custom values.

### 8. The Difference Between `||` and `??` (The `0` Attendance Example from Task 4)
- Logical OR (`||`) falls back on **any falsy value** (`0`, `""`, `false`, `NaN`, `null`, `undefined`).
- Nullish Coalescing (`??`) falls back **only on `null` or `undefined`**.
In Task 4, when a student had a real recorded attendance of `0`, `student.attendance || "Not recorded"` wrongly printed `"Not recorded"` because `0` is falsy, whereas `student.attendance ?? "Not recorded"` accurately printed `0`.

### 9. Task 7.4 — Library Comparison (Day 03 vs. Day 04)
- **Line Count Comparison:**
  - Day 03 `grade-analyzer.js` library functions: **98 lines**
  - Day 04 `grade-lib.js` modern ES6+ pure library: **68 lines**
- **Before & After Function (`isPassing` / `formatRow`):**

```javascript
// Day 03 Version:
function formatStudentRow(student) {
  const name = student && student.name ? student.name : "???";
  const score = student && typeof student.score === "number" ? student.score : 0;
  const attendance = student && typeof student.attendance === "number" ? student.attendance : 0;
  return name.padEnd(10) + " " + String(score).padStart(3) + "  " + getLetterGrade(score) + "  " + String(attendance).padStart(3) + "%";
}

// Day 04 Version:
function formatRow({ name = "???", score = 0, attendance = 0 } = {}) {
  const paddedName = `${name}`.padEnd(10);
  const paddedScore = `${score}`.padStart(3);
  return `${paddedName} ${paddedScore}   ${letterGrade(score)}   ${`${attendance ?? 0}%`.padStart(4)}`;
}
```

**Why the new signature is better:**
The Day 04 signature `formatRow({ name = "???", score = 0, attendance = 0 } = {})` immediately tells any developer reading the first line which exact properties the function expects and what their fallback values are without reading the body. Furthermore, the `= {}` guard ensures calling `formatRow()` with no arguments never crashes with a `TypeError`.

---

## Part 2 — Async JS, Callbacks & The Event Loop

### 1. What "Single-Threaded" Means, and What Blocking Costs in the Browser
"Single-threaded" means JavaScript has only **one Call Stack** and can execute only **one piece of code at a time**. In the browser, that same single thread is also responsible for repainting the UI, handling button clicks, and typing in inputs — so running a synchronous blocking loop like `blockFor(3000)` completely freezes the entire browser tab for 3 seconds.

### 2. ASCII Diagram of the Event Loop

```text
 ┌────────────────────────┐         ┌──────────────────────────────────┐
 │       CALL STACK       │         │       BROWSER / NODE APIs        │
 │  (Runs JS code 1 line  │ ──────► │  Timers (setTimeout), fs.readFile│
 │   at a time — LIFO)    │  Hands  │  Network (run OUTSIDE JS thread) │
 └───────────▲────────────┘   off   └─────────────────┬────────────────┘
             │                                        │ When timer/IO finishes,
             │                                        ▼ callback enters queue
             │                      ┌──────────────────────────────────┐
             │                      │   MICROTASK QUEUE (VIP Lane)     │
             │                      │   queueMicrotask, Promises       │
             │                      ├──────────────────────────────────┤
             │                      │   TASK QUEUE (Normal Lane)       │
             │                      │   setTimeout, setInterval, I/O   │
             │                      └─────────────────┬────────────────┘
             │                                        │
             └────────────── EVENT LOOP ◄─────────────┘
        Rule: Wait until Call Stack is completely empty ->
              Run ALL Microtasks first -> Then run ONE Task -> Repeat!
```

### 3. Why `setTimeout(fn, 0)` Doesn't Run Immediately, and Which Queue Goes First
`setTimeout(fn, 0)` does not put `fn` on the Call Stack; it registers a `0ms` timer with the host API, which places `fn` into the **Task Queue**. The Event Loop will never move `fn` to the Call Stack until **all synchronous code** on the stack finishes AND the **entire Microtask Queue (VIP lane)** is completely emptied first.

### 4. Why You Can't `return` a Value Out of an Async Callback (and What You Do Instead)
When a function schedules `setTimeout(() => { return 92; }, 100)`, the outer function finishes immediately, returns `undefined`, and pops off the Call Stack before the 100ms timer ever fires. When `return 92` finally executes later, there is no caller left on the stack to receive it. Instead, we pass a **`callback` function** as a parameter (`getScoreLater(callback)`) and invoke `callback(92)` inside the timer when the data is ready.

### 5. The Error-First Convention & Why `return callback(err)` Matters
In Node.js, async callbacks follow `callback(err, result)` where the **first argument is reserved for an `Error` object** (or `null` when the operation succeeds). Writing `return callback(err)` when reporting an error is critical because without `return`, execution continues down the function and invokes `callback(null, data)` a **second time**.

### 6. Why `try`/`catch` Can't Catch an Error Thrown Inside `setTimeout`
`try`/`catch` only catches synchronous exceptions thrown while the `try` block is actively on the Call Stack. Because the `setTimeout` callback executes later from the Task Queue after the `try` block has already exited the stack, the `catch` block is long gone and the unhandled error crashes the process.

### 7. The Three Problems With Callbacks (One Sentence Each)
1. **Pyramid of Doom (Callback Hell):** Chaining sequential async operations where each step depends on the previous result forces deeply nested callbacks that drift horizontally across the screen.
2. **Scattered Error Handling:** Every single nested callback level must manually repeat `if (err) return ...`, making it easy to forget a check and lose errors.
3. **Inversion of Control:** Passing your callback to an external function surrenders control over whether your callback is called once, never, or accidentally multiple times.

### 8. Parallel vs. Sequential Timing (from Task 7) & Why Results Go In By Index
In Task 7 (`report.js`), loading 12 students' attendance one-after-another (sequentially) would have taken the sum of all 12 delays (**`~1325ms`**), whereas launching all 12 requests in **parallel** finished in only **`~215ms`** (the duration of the slowest single student). We store each arriving student with `hydratedStudents[index] = ...` instead of `.push()` because fast timers finish before slow ones, so `.push()` would scramble the students into arrival order instead of their original order.

---

## Real Bug I Hit & How I Fixed It

- **The Bug:** In Task 7 (`report.js`) and Task 6, when I first tested checking completion of parallel callbacks using `if (results.length === rawStudents.length)`, the report printed prematurely with `undefined` slots in the middle of the array!
- **Why It Happened:** Because I assigned `results[index] = student` by index, when student `#12` (`index = 11`) finished early after `125ms`, JavaScript automatically set `results.length` to `12` even though slower students (like index `4` at `210ms`) were still `undefined`!
- **The Fix:** I introduced a dedicated `let finishedCount = 0;` counter that increments (`finishedCount++`) inside each callback and checked `if (finishedCount === rawStudents.length)` instead of `results.length`.
