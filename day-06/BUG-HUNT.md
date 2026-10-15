# Day 06 — Task 12: The Bug Hunt (`BUG-HUNT.md`)

## 1. Migration Overview
- **Migrated Files:**
  1. `day-04/grade-lib.js` -> `day-06/migrate/grade-lib.ts` (84 lines)
  2. `day-04/callbacks.js` -> `day-06/migrate/callbacks.ts` (124 lines)
- **Initial Compiler Output:** **33 errors** reported across both files upon renaming to `.ts`.
- **Final Compiler Output:** **0 errors** (`npx tsc` completely clean).

---

## 2. Bug & Error Audit Table

| File | Error Code | Location | Category | Details & Impact |
|---|---|---|---|---|
| `grade-lib.ts` | `TS7006` | line 3, 6 | Missing Type | Parameter `score` implicitly has `any` type. |
| `grade-lib.ts` | `TS18048` | line 35, 36 | **REAL BUG** | `low` and `high` possibly `undefined`. Calling `minMaxStudent([])` on empty array evaluates `low = students[0]` (`undefined`), then attempts to read `low.score`, causing immediate `TypeError: Cannot read properties of undefined (reading 'score')`. |
| `grade-lib.ts` | `TS7053` | line 45 | Missing Type / Type safety | `counts[grade]` was indexing plain `{}` without a defined index signature or `Record<string, number>`. |
| `grade-lib.ts` | `TS7006` | line 65 | Missing Type | Parameter `field` implicitly has `any` type in `withoutField`. |
| `callbacks.ts` | `TS7006` | line 5, 11 | Missing Type | Parameters `times` and `callback` implicitly have `any` type. |
| `callbacks.ts` | `TS2339` | line 75, 81 | **REAL BUG** | Destructuring `{ name, score } = {}` in callback parameter list. When `callback(new Error(...))` is called on lookup failure, the second argument is omitted; reading `name` and `score` silently yields `undefined` instead of enforcing error checks. |
| `callbacks.ts` | `TS7006` | line 87, 97 | Missing Type | `id`, `callback`, `err`, `student` missing types. |
| `callbacks.ts` | `TS7006` | line 110, 119 | Missing Type | Async timer test parameters missing type definitions. |

---

## 3. Analysis of Real Bugs Found

### Bug 1: Array Indexing Crash in `minMaxStudent`
- **Trigger Input:** `minMaxStudent([])`
- **Runtime Outcome:** In Day 04 JavaScript, passing an empty array passed the initial check, set `low = students[0]` (`undefined`), and then immediately crashed on `low.score < ...`.
- **The TypeScript Fix:** Enforced checking that `first !== undefined` before proceeding, safely returning `[null, null]` when empty.

### Bug 2: Blind Destructuring on Failed Error-First Callbacks
- **Trigger Input:** `findStudent(99, (err, { name, score } = {}) => { ... })`
- **Runtime Outcome:** When `err` exists, the second argument was not provided. If a developer accidentally accessed `name` before checking `if (err)`, JavaScript printed `undefined` without warning.
- **The TypeScript Fix:** Typed the callback as `(err: Error | null, student?: StudentItem) => void`. The compiler forces checking `if (student)` before accessing any student properties.

---

## 4. Reflection
The vast majority of errors were `TS7006` (implicit `any` on function parameters), followed by index signature issues (`TS7053`) and unchecked array access (`TS18048`). In plain JavaScript, we often write code assuming "happy path" inputs, passing objects and assuming properties always exist. TypeScript exposed the exact edge cases—such as empty arrays and omitted callback parameters—that lead to production crashes. Adding strict interfaces and narrowing transformed fragile assumptions into self-documenting, bulletproof code.
