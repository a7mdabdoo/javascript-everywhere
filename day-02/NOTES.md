# Day 02 Notes — JS Fundamentals

## 1. `const` vs `let`
- `const`: Default choice for variables that do not change.
- `let`: Used only when the value needs to change later (like a counter in a loop).
- **Why can you `push` to a `const` array?**
  `const` stops you from assigning a new array to the variable. But it still allows modifying the items inside the existing array using `.push()`.

## 2. The 7 Primitive Types
- `string`: Text inside quotes (e.g. `"Ahmed"`).
- `number`: Numbers, both integers and decimals (e.g. `18`, `3.5`).
- `boolean`: `true` or `false`.
- `null`: Empty value set on purpose.
- `undefined`: Variable declared but not given a value yet.
- `bigint`: Very large numbers.
- `symbol`: Unique identifier.

## 3. `typeof null` Bug
- `typeof null` returns `"object"` because of an old bug in JavaScript from 1995. They kept it so old websites do not break.
- To check for null correctly, use: `val === null`.

## 4. The 8 Falsy Values
Everything else is truthy. The only 8 falsy values are:
`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.
*(Note: `[]` and `{}` are objects, so they are truthy even if empty).*

## 5. `===` vs `==`
- `===`: Checks both value and type without converting.
- `==`: Converts types automatically before comparing, which causes bugs.
- **Example bug:**
  `"" == 0` is `true` because JavaScript turns `""` into `0`. If you check empty user input with `== 0`, an empty box is treated like the number 0. Using `===` prevents this.

## 6. `??` vs `||`
- `||` uses the fallback for **any falsy value** (like `0` or `""`).
- `??` uses the fallback **only** for `null` or `undefined`.
- Use `??` when `0` is a valid value. For example, if a score is `0`:
  `score ?? 100` gives `0` (correct).
  `score || 100` gives `100` (wrong).

## 7. When to Use Each Loop
- **`for`**: When you know how many times to repeat using a counter.
- **`for...of`**: Best for looping over array items directly.
- **`for...in`**: Best for looping over keys of an object.
- **`while`**: When you repeat until a condition becomes false, without knowing the count in advance.
- **`do...while`**: When you need the loop to run at least once before checking the condition.

## 8. `break` vs `continue`
- `break`: Stops the loop completely and exits.
- `continue`: Skips the rest of the current step and moves to the next loop step.

## 9. What Broke & How I Fixed It
- **Bug 1:** In `grade-engine.js`, when I removed `break` from `case "A"`, it fell through and printed `case "B"` too ("Excellent!" and "Good job!"). Fixed it by putting `break;` back.
- **Bug 2:** In `predictions.js`, I expected `undefined + 1` to be `1` (like `null + 1`), but it gave `NaN`. This happened because `Number(undefined)` is `NaN`, while `Number(null)` is `0`.
