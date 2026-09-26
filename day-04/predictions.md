# Day 04 — Task 1: Predictions vs Actual Results

## Part 1 — Unpacking (Snippets 1–12)

| # | My Prediction (Before Running) | Actual Output | Correct? | Mechanism / Explanation |
|---|---|---|---|---|
| **1** | `1 "undefined"` | `1 undefined` | Yes | Only `a` was destructured from `{ a: 1, b: 2 }`; `b` was never declared so `typeof b` evaluates to `"undefined"`. |
| **2** | `10` | `ReferenceError: x is not defined` | **No** | In `const { x: y } = { x: 10 }`, `x` is the source property name to match and `y` is the actual variable created. `x` itself is not created as a variable. |
| **3** | `5` | `5` | Yes | Destructuring default values fire whenever the property value is `undefined`. |
| **4** | `5` | `null` | **No** | **Mechanism: Strict `=== undefined` Default Trigger.** Destructuring defaults ONLY trigger when the value is strictly `undefined`. Because `null` is an explicit object value (`null !== undefined`), JavaScript keeps `null` instead of using `5`. |
| **5** | `"c"` | `c` | Yes | Array destructuring matches by position (index). Two leading commas `[, , third]` skip indices `0` and `1` and bind index `2` (`"c"`). |
| **6** | `3` | `3` | Yes | `const copy = arr` copies the reference (alias), not the array itself. Pushing to `copy` mutates `arr`. |
| **7** | `1` | `99` | **No** | **Mechanism: Shallow Copy (`...` copies one level deep).** `const shallow = { ...obj }` creates a new outer object, but `shallow.nested` and `obj.nested` still point to the exact same inner object reference in memory. |
| **8** | `{ b: 2, a: 1 }` | `{ b: 2, a: 1 }` | Yes | **Mechanism: Object Spread Merge Order (Last Key Wins).** When two spread objects share the key `b`, the property from the rightmost spread (`b: 2`) overwrites the earlier `b: 3`. |
| **9** | `undefined 7` | `undefined 7` | Yes | `function f({ a } = {})` provides a fallback empty object `{}` when called with no arguments, so `f()` safely destructures `a` as `undefined`. |
| **10** | `undefined` | `TypeError: Cannot destructure property 'a' of 'undefined' as it is undefined.` | **No** | **Mechanism: Destructuring `undefined` Without Parameter Default `= {}`.** Calling `g()` passes `undefined` as the first argument, and JavaScript cannot destructure properties from `undefined` or `null`. |
| **11** | `TypeError` | `TypeError: Cannot read properties of undefined (reading 'city')` | Yes | `s.address` is `undefined`, so reading `.city` on `undefined` immediately throws a `TypeError` (which `s.address?.city` would prevent). |
| **12** | `"fallback" 0` | `fallback 0` | Yes | Logical OR (`\|\|`) treats `0` as falsy and falls back to `"fallback"`, whereas Nullish Coalescing (`??`) only falls back on `null` or `undefined`, preserving `0`. |

---

## Part 2 — Order & Timing (Snippets 13–22)

| # | My Prediction (Before Running) | Actual Output | Correct? | Mechanism / Explanation |
|---|---|---|---|---|
| **13** | `a`, `c`, `b` | `a`, `c`, `b` | Yes | `setTimeout(..., 0)` sends the callback to the Task Queue, which cannot run until all synchronous code (`a` and `c`) finishes and the Call Stack is empty. |
| **14** | `sync`, `micro`, `timeout` | `sync`, `micro`, `timeout` | Yes | Synchronous code runs first (`sync`), then the Event Loop drains the VIP Microtask Queue (`micro`) before taking a task from the Task Queue (`timeout`). |
| **15** | `0`, `1`, `2` | `3`, `3`, `3` | **No** | **Mechanism: Function-Scoped `var` Shared Closure + Post-Loop Timer Execution.** `var i` creates a single shared variable for the whole loop. By the time the three `0ms` timers run from the Task Queue, the synchronous `for` loop has already finished with `i = 3`. |
| **16** | `undefined` | `undefined` | Yes | `later()` schedules a timer and returns `undefined` immediately; `return 42` inside the timer returns to the timer dispatcher later, not to `later()`. |
| **17** | `loop finished`, `timer` | `loop finished`, `timer` | Yes | The busy `while` loop blocks the single JS thread for 500ms. Even though the `0ms` timer is ready in the Task Queue, the Event Loop cannot push it onto the Call Stack until the synchronous script finishes. |
| **18** | `outer`, `first`, `nested`, `second` | `outer`, `first`, `second`, `nested` | **No** | **Mechanism: FIFO Task Queue Ordering.** `outer`, `first`, and `second` are already queued in the Task Queue in order `[outer, first, second]`. When `first` runs, it schedules `nested` at the **back** of the Task Queue, after `second`. |
| **19** | `timer`, `timer 2`, `micro inside timer` | `timer`, `micro inside timer`, `timer 2` | **No** | **Mechanism: Microtask Queue Drains Between Every Macrotask.** After the Event Loop runs one Task (`timer`), it immediately checks and empties the entire Microtask Queue (`micro inside timer`) before picking the next Task (`timer 2`). |
| **20** | `after try`, then `Error: late` | `after try`, then `Uncaught Error: late` | Yes | `try/catch` only catches synchronous errors on the current Call Stack. By the time the `setTimeout` callback throws, the `try` block has already exited the stack. |
| **21** | `sync call`, `after load`, `async call` | `sync call`, `after load`, `async call` | Yes | **Mechanism: Mixed Sync/Async Callback Execution ("Zalgo").** `cb("sync call")` runs immediately on the Call Stack before `load()` returns, `after load` prints next, and `cb("async call")` runs later from the Task Queue. |
| **22** | `D`, `C`, `B`, `A` | `D`, `C`, `B`, `A` | Yes | `D` runs synchronously, `C` runs next from the Microtask Queue, `B` finishes its 10ms timer before `A`'s 20ms timer. |
