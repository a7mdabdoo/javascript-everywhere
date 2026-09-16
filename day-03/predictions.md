# Day 03 Predictions — Scope, Hoisting & Functions

| # | Code Snippet | Prediction | Actual | Match? |
|---|---|---|---|:---:|
| 1 | `console.log(a); var a = 1;` | `undefined` | `undefined` | ✅ |
| 2 | `console.log(b); let b = 2;` | `undefined` | `ReferenceError` | ❌ |
| 3 | `hello(); function hello() { console.log("hi"); }` | `"hi"` | `"hi"` | ✅ |
| 4 | `bye(); const bye = () => console.log("bye");` | `TypeError` | `ReferenceError` | ❌ |
| 5 | `function f() { return; 42; } console.log(f());` | `undefined` | `undefined` | ✅ |
| 6 | `const g = (x) => { x * 2 }; console.log(g(5));` | `10` | `undefined` | ❌ |
| 7 | `const h = (x) => { value: x }; console.log(h(5));` | `{ value: 5 }` | `undefined` | ❌ |
| 8 | `function k(a, b) { return a + b; } console.log(k(1));` | `NaN` | `NaN` | ✅ |
| 9 | `function m(x = 10) { return x; } console.log(m(null), m(undefined), m(0));` | `null 10 0` | `null 10 0` | ✅ |
| 10 | `let n = "outer"; function p() { let n = "inner"; return n; } console.log(p(), n);` | `inner outer` | `inner outer` | ✅ |
| 11 | `for (var i = 0; i < 3; i++) {} console.log(i);` | `3` | `3` | ✅ |
| 12 | `for (let j = 0; j < 3; j++) {} console.log(j);` | `ReferenceError` | `ReferenceError` | ✅ |
| 13 | `function counter() { let c = 0; return () => ++c; } const q = counter(); console.log(q(), q(), counter()());` | `1 2 1` | `1 2 1` | ✅ |
| 14 | `const nums = [1, 2, 3]; console.log(nums.map((x) => x * 2));` | `[2, 4, 6]` | `[2, 4, 6]` | ✅ |
| 15 | `function r() { console.log("ran"); } console.log(r);` | `[Function: r]` | `[Function: r]` | ✅ |

---

## Explanations for Surprises & Mistakes:

- **#2 (`let b = 2`):**
  Predicted `undefined`, but it threw `ReferenceError: Cannot access 'b' before initialization`. This is caused by the **Temporal Dead Zone (TDZ)**: `let` declarations are registered in scope during creation phase, but cannot be read or assigned before the line where initialization happens.

- **#4 (`const bye = () => ...`):**
  Predicted `TypeError: bye is not a function`, but it threw `ReferenceError: Cannot access 'bye' before initialization`. Because `bye` is declared with `const`, it enters the **Temporal Dead Zone (TDZ)** until its declaration line, meaning it cannot even be accessed before initialization.

- **#6 (`const g = (x) => { x * 2 }`):**
  Predicted `10`, but it returned `undefined`. When using curly braces `{ }` in an arrow function, JavaScript treats it as a statement block rather than an expression. Without an explicit `return` statement, the function body evaluates and returns `undefined`.

- **#7 (`const h = (x) => { value: x }`):**
  Predicted `{ value: 5 }`, but it returned `undefined`. JavaScript parses the `{ }` as a function body block and `value:` as a label statement, returning `undefined`. To return an object literal implicitly, it must be wrapped in parentheses: `(x) => ({ value: x })`.
