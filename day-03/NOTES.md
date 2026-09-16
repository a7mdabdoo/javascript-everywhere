# Day 03 Notes — Functions, Scope & Hoisting

## 1. Parameters vs Arguments
- **Parameter:** The placeholder variable name listed in the function definition (e.g. `a, b` in `function add(a, b)`).
- **Argument:** The actual value passed into the function when calling it (e.g. `2, 3` in `add(2, 3)`).

## 2. Declaration vs Expression vs Arrow
- **Function Declaration:** `function f() {}` — Fully hoisted with body; best for standalone, top-level named functions.
- **Function Expression:** `const f = function() {}` — Stored in a variable, not hoisted; best when functions need to be conditionally assigned or passed around.
- **Arrow Function:** `const f = () => {}` — Short syntax with lexical `this` and optional implicit return; default choice for callbacks and short helper functions.

## 3. `return` vs `console.log`
- `console.log` only prints a message to the console for a human to see and returns `undefined`.
- `return` passes a value back to the rest of the program to be saved in variables or used in expressions, and terminates function execution immediately.
- They are not interchangeable: attempting `addLog(2, 3) * 2` results in `NaN` because `undefined * 2` is `NaN`.

## 4. Guard Clauses vs Nested `if / else`
- A guard clause tests for bad input or exit conditions at the top of the function and returns immediately.
- It avoids deeply nested `if / else` blocks, keeps the main happy path flat and readable, and makes errors obvious.

## 5. Scope: Global vs Function vs Block
- **Global Scope:** Variables declared outside any function or block, accessible from anywhere in the program.
- **Function Scope:** Variables declared inside a function, accessible only within that function's body.
- **Block Scope:** Variables declared with `let` or `const` inside any `{ }` block, accessible only within that block.

## 6. The Scope Chain
- When resolving a variable, JavaScript starts at the innermost current scope and searches outward through containing scopes up to the global scope.
- It searches in one direction only: from the inside outward. It can never look inward into child scopes.

## 7. What Hoisting Actually Moves
- **`function` declaration:** Both name and body are hoisted; fully callable before the definition line.
- **`var`:** Name is hoisted and initialized to `undefined`. Accessing before definition returns `undefined`.
- **`let` and `const`:** Name is registered in scope during compilation, but remains uninitialized in the TDZ. Accessing before declaration throws a `ReferenceError`.

## 8. Temporal Dead Zone (TDZ)
- The TDZ is the region of code from the start of a block until the line where a `let` or `const` variable is declared and initialized.
- Throwing a `ReferenceError` in the TDZ is much safer than returning `undefined` because it prevents silent bugs and forces you to fix the ordering immediately.

## 9. What a Closure Is
- An inner function that retains access to its outer function's variables even after the outer function has finished execution and returned.

## 10. Passing `fn` vs Passing `fn()`
- Passing `fn` hands over the function reference so another function can call it later as a callback.
- Passing `fn()` executes the function immediately and hands over whatever value it returns.

## 11. Refactor Comparison (Task 5.3)
- **Line Counts:** Day 02 `report-card.js` was **97 lines** (all logic, loops, and printing mixed in one script). Day 03 is split into `grade-lib.js` (**75 lines**) and `report.js` (**68 lines**).
- **Single-Place Change:** In Day 02, changing the pass mark from 60 to 75 required manual edits in three places (the grade ladder, the at-risk condition, and the output). In Day 03, we change `passMark = 75` once in `grade-lib.js`, and both `report.js` and the browser app instantly use the updated rule.

## 12. What Broke & How I Fixed It
- **Bug:** When writing an arrow function to return an object literal `const makeObj = (x) => { val: x }`, it returned `undefined` instead of `{ val: 5 }`.
- **Reason & Fix:** JavaScript treated `{ }` as a block body and `val:` as a label statement. Fixed it by wrapping the object literal in parentheses: `(x) => ({ val: x })`.
