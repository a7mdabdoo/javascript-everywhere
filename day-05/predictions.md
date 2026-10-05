# Day 05 — Task 1: Predictions, Actuals & Mechanism Analysis

> **Assignment:** Write exact prediction before running, then run each snippet, record actual output, explain any discrepancies, and explicitly name the underlying engine mechanism for #2, #3, #6, #10, #11, #15 vs #16, #17, and #19.

---

## Summary Table

| # | Topic | Prediction | Actual Result | Status | Key Mechanism / Concept |
|---|---|---|---|---|---|
| **1** | Promise Executor sync execution | `a`, `b`, `c` | `a`, `b`, `c` | Match | The Promise constructor executor function runs synchronously. |
| **2** | Promise settles once | `first` | `p2: first` | Match | **Settles Once (State Immutability)**: Once resolved or rejected, state transitions are locked. |
| **3** | Missing return in `.then` | `undefined` | `p3: undefined` | Match | **Missing Return Bug**: Without an explicit `return`, the `.then` callback returns `undefined`. |
| **4** | Microtasks vs Macrotasks | `sync`, `then`, `timeout` | `sync`, `then`, `timeout` | Match | Microtask queue (`Promise.then`) drains before macrotask queue (`setTimeout`). |
| **5** | `await null` microtask pause | `A`, `B`, `C`, `D` | `A`, `B`, `C`, `D` | Match | `await` pauses the async function execution and yields to synchronous caller (`C`), resuming in microtask queue (`D`). |
| **6** | `forEach` with async callback | `done`, `1`, `2`, `3` | `done`, `p6 item: 1`, `2`, `3` | Match | **`forEach` Trap**: `Array.prototype.forEach` ignores returned Promises and does not await them. |
| **7** | `Promise.all` result order | `['slow', 'fast']` | `p7: [ 'slow', 'fast' ]` | Match | `Promise.all` preserves input order in the resolved array, regardless of resolution timing. |
| **8** | `Promise.all` fail-fast | `all: b failed` | `all: b failed` | Match | Fail-fast: The first rejection immediately rejects the whole `Promise.all`. |
| **9** | `Promise.race` vs `Promise.any` | `race: failed at 100`, `any: win` | `race: failed at 100`, `any: win` | Match | `race` settles with the first settled promise; `any` ignores rejections and settles with the first fulfilled promise. |
| **10** | `return risky()` vs `try/catch` | `caught outside: boom` | `caught outside: boom` | Match | **Return Unawaited Promise**: Returning a pending promise without `await` bypasses the local `try/catch` block. |
| **11** | `exports` vs `module.exports` | `{ x: 1 }` | `{ x: 1 }` | Match | **Reference Reassignment Trap**: `exports` is an alias to `module.exports`. Reassigning `exports` severs the reference. |
| **12** | CommonJS module cache | `1 2 3` | `1 2 3` | Match | CJS modules are cached in `require.cache` upon first evaluation; subsequent requires return the identical cached instance. |
| **13** | ESM import hoisting | `b`, `main` | `b`, `main` | Match | Static `import` declarations are hoisted and their dependencies are evaluated before the module body. |
| **14** | ESM default export naming | `hello` | `hello` | Match | Function declarations keep their `.name` property even when imported under an alias default name. |
| **15** | ESM Live Bindings | `2` | `2` | Match | **ESM Live Bindings**: Imported variables are live references directly reflecting mutations in the exporter module. |
| **16** | CommonJS Export by Copy | `0` | `0` | Match | **CJS Export by Copy**: Primitive values exported via `module.exports = { ... }` are copied at assignment time. |
| **17** | Reassigning ESM import | `TypeError: Assignment to constant variable` | `TypeError: Assignment to constant variable.` | Match | **Read-Only Binding**: ESM imports are immutable references for consumers; they cannot be reassigned. |
| **18** | Case-sensitive named export | `SyntaxError: The requested module ... does not provide an export named 'X'` | `SyntaxError: ... does not provide an export named 'X'` | Match | ESM named imports are resolved and validated statically at parse time and are case-sensitive (`x` vs `X`). |
| **19** | Git Staging Area two-tier index | `MM notes.txt`, then committed `v2` and remaining ` M notes.txt` | `MM notes.txt`, committed `v2`, remaining ` M notes.txt` | Match | **Two-Tier Staging Area (HEAD vs Index vs Working Tree)**: `git add` copies the working tree file to the index at that moment. Subsequent modifications remain unstaged. |
| **20** | Git Branch Isolation | `ls: cannot access 'feature.txt'` | `feature.txt` does not exist on `main` | Match | Working directory reflects the checked-out branch. Switching branches restores the target branch's tree. |
| **21** | Git Fast-Forward Merge | `Fast-forward` | Line 2 begins with `Fast-forward` | Match | When the target branch has not diverged, Git simply advances the HEAD pointer without creating a merge commit. |

---

## Detailed Breakdown & Named Mechanisms

### Snippet #2 — Promise Settles Once
- **Code:**
  ```javascript
  const p2 = new Promise((resolve) => {
    resolve("first");
    resolve("second");
  });
  p2.then((v) => console.log(v));
  ```
- **Prediction:** `first`
- **Actual:** `first`
- **Named Mechanism:** **State Immutability ("Settles Once")**
- **Explanation:** In JavaScript Promises, state transition is strictly one-way: from `pending` to either `fulfilled` or `rejected`. Once settled, any subsequent calls to `resolve()` or `reject()` are silently discarded. This eliminates Day 04's common callback bug where a third-party or errant callback could be invoked multiple times.

---

### Snippet #3 — The Missing `return` Bug
- **Code:**
  ```javascript
  Promise.resolve("start")
    .then(() => {
      delay(100).then(() => "slow value");
    })
    .then((v) => console.log(v));
  ```
- **Prediction:** `undefined`
- **Actual:** `undefined`
- **Named Mechanism:** **Implicit Return of Undefined in Promise Handler**
- **Explanation:** In the first `.then()`, the inner `delay(100)...` promise is created, but the callback itself has no `return` statement. Therefore, it implicitly returns `undefined`. The outer chain does not wait for the inner promise to resolve and immediately fulfills with `undefined`. To fix it, you must write `return delay(100)...`.

---

### Snippet #6 — The `forEach` Async Trap
- **Code:**
  ```javascript
  async function run() {
    [3, 1, 2].forEach(async (n) => {
      await delay(n * 10);
      console.log(n);
    });
    console.log("done");
  }
  ```
- **Prediction:** `done`, followed by `1`, `2`, `3`
- **Actual:** `done`, then `1`, `2`, `3`
- **Named Mechanism:** **Synchronous Iteration Protocol with Ignored Return Value**
- **Explanation:** `Array.prototype.forEach` expects a synchronous callback. When given an `async` function, it immediately receives a Promise and discards it without awaiting it. It moves synchronously to the next iteration, and then immediately runs the next line (`console.log("done")`). The async tasks settle in background order determined by their delay (`10ms` -> `1`, `20ms` -> `2`, `30ms` -> `3`).

---

### Snippet #10 — `return risky()` vs Local `try/catch`
- **Code:**
  ```javascript
  async function risky() { throw new Error("boom"); }
  async function main10() {
    try {
      return risky();
    } catch (e) {
      console.log("caught inside:", e.message);
    }
  }
  main10().catch((e) => console.log("caught outside:", e.message));
  ```
- **Prediction:** `caught outside: boom`
- **Actual:** `caught outside: boom`
- **Named Mechanism:** **Returning Unawaited Promise from Try Block**
- **Explanation:** Writing `return risky()` returns the pending (and soon-to-reject) Promise directly out of `main10` before it rejects. Since the rejection happens asynchronously after `main10` has already finished execution and popped off the call stack, the local `try/catch` block is bypassed entirely. To catch the error locally, one must write `return await risky()`.

---

### Snippet #11 — The `exports = ...` Trap
- **Code:**
  ```javascript
  // a.js:
  exports.x = 1;
  exports = { y: 2 };
  // main.js:
  console.log(require("./a"));
  ```
- **Prediction:** `{ x: 1 }`
- **Actual:** `{ x: 1 }`
- **Named Mechanism:** **Broken Object Reference via Parameter Reassignment**
- **Explanation:** Node.js wraps CommonJS modules in a function where `exports` is initialized as `module.exports`. When you do `exports.x = 1`, you mutate the shared object. But doing `exports = { y: 2 }` simply reassigns the local variable `exports` to a new memory address. Node.js only ever returns `module.exports` when `require("./a")` is called.

---

### Snippet #15 vs Snippet #16 — ESM Live Bindings vs CommonJS Value Copies
- **Snippet #15 (ESM):**
  ```javascript
  // counter.mjs
  export let count = 0;
  export function inc() { count++; }
  // main.mjs
  import { count, inc } from "./counter.mjs";
  inc(); inc();
  console.log(count); // prints 2
  ```
- **Snippet #16 (CommonJS):**
  ```javascript
  // counter.js
  let count = 0;
  function inc() { count++; }
  module.exports = { count, inc };
  // main.js
  const { count, inc } = require("./counter");
  inc(); inc();
  console.log(count); // prints 0
  ```
- **Named Mechanism:** **Live Bindings vs Value Copying**
- **Explanation:**
  - In ESM, `export let count` exposes a live binding (a pointer to the module's internal variable). When `inc()` mutates `count`, any consumer importing `count` immediately sees the updated value (`2`).
  - In CommonJS, `module.exports = { count, inc }` evaluates the primitive `count` (which was `0`) and copies its value onto the exported dictionary. Calling `inc()` modifies the private `let count` inside `counter.js`, but does not change the copied number property already exported.

---

### Snippet #17 — Read-Only Imports in ESM
- **Code:**
  ```javascript
  import { count } from "./counter.mjs";
  count = 5;
  ```
- **Prediction:** `TypeError: Assignment to constant variable`
- **Actual:** `TypeError: Assignment to constant variable.`
- **Named Mechanism:** **Immutable Import Reference**
- **Explanation:** The ECMAScript specification mandates that all imported bindings are read-only to the importing module. Even though `count` was declared with `let` in `counter.mjs`, only the exporting module is permitted to mutate it. Consumers attempting to reassign it throw a `TypeError`.

---

### Snippet #19 — The Two-Tier Git Staging Area
- **Commands:**
  ```bash
  echo v2 > notes.txt
  git add notes.txt
  echo v3 > notes.txt
  git status --short
  git commit -m "Update notes"
  git status --short
  ```
- **Prediction:**
  - First status: `MM notes.txt`
  - Committed version: `v2`
  - Second status: ` M notes.txt`
- **Actual:**
  - First status: `MM notes.txt`
  - Committed version: `v2`
  - Second status: ` M notes.txt`
- **Named Mechanism:** **Three Trees of Git (HEAD vs Index vs Working Tree)**
- **Explanation:** Git separates the **Working Tree** (files on disk), the **Index / Staging Area** (snapshot prepared for the next commit), and the **HEAD** (last committed snapshot).
  1. `git add notes.txt` takes `v2` from disk and writes it into the Index.
  2. Modifying disk to `v3` without running `git add` leaves `v2` in the Index while `v3` exists on disk.
  3. `git status --short` shows `MM`: green `M` (Index differs from HEAD) and red `M` (Working Tree differs from Index).
  4. `git commit` commits the Index (`v2`).
  5. The working tree still has `v3`, which shows up as unstaged ` M notes.txt`.
