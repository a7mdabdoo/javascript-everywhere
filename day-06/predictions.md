# Day 06 — Task 1: TypeScript Predictions

## Summary
- Total Snippets: 28
- Predictions evaluated against:
  - `tsc`: `npx tsc -p predictions` (Type checking)
  - `node`: `node predictions/pNN.ts` (Runtime execution via Node 24 native type stripping)

---

### Snippet 01 (`p01.ts`)
```ts
let score = 92;
score = "92";
console.log(score);
```
- **Prediction A (tsc):** Fails. Line 2 `score = "92"` cannot assign string to number.
- **Actual A (tsc):** `predictions/p01.ts(3,1): error TS2322: Type 'string' is not assignable to type 'number'.`
- **Prediction B (node):** Runs and prints `92`.
- **Actual B (node):** Prints `92`.
- **Lesson:** TypeScript infers `let score = 92` as `number`. Node strips types and executes valid JavaScript where variables can change types dynamically.

---

### Snippet 02 (`p02.ts`)
```ts
const grade = "A";
let other = "A";
const g1: "A" | "B" = grade;
const g2: "A" | "B" = other;
console.log(g1, g2);
```
- **Prediction A (tsc):** Fails on `g2`. `other` is declared with `let`, so TS infers `string` (widened), not the literal `"A"`.
- **Actual A (tsc):** `predictions/p02.ts(5,7): error TS2322: Type 'string' is not assignable to type '"A" | "B"'.`
- **Prediction B (node):** Runs and prints `A A`.
- **Actual B (node):** Prints `A A`.
- **Mechanism (#2):** **Literal types vs Type widening**. `const grade = "A"` is inferred as the narrow literal type `"A"` because it cannot be reassigned. `let other = "A"` is widened to `string` because it can be reassigned to any string later.

---

### Snippet 03 (`p03.ts`)
```ts
function add(a: number, b: number) { return a + b; }
console.log(add(2, "3" as any));
```
- **Prediction A (tsc):** Passes. `as any` silences compiler checks on argument `b`.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `"23"` because JS `+` performs string concatenation when one operand is a string.
- **Actual B (node):** Prints `23`.
- **Lesson:** `any` shuts down the type checker and allows buggy types through to runtime.

---

### Snippet 04 (`p04.ts`)
```ts
const scores = [90, 80];
const top = scores[5];
console.log(top.toFixed(1));
```
- **Prediction A (tsc):** Fails. `top` is possibly `undefined` due to `noUncheckedIndexedAccess`.
- **Actual A (tsc):** `predictions/p04.ts(4,13): error TS18048: 'top' is possibly 'undefined'.`
- **Prediction B (node):** Crashes with `TypeError: Cannot read properties of undefined (reading 'toFixed')`.
- **Actual B (node):** Crashes with `TypeError: Cannot read properties of undefined (reading 'toFixed')`.
- **Mechanism (#4):** **`noUncheckedIndexedAccess`**. In standard JS and default TS, indexing an array `scores[5]` is typed as `number`. With `noUncheckedIndexedAccess: true`, TS types it as `number | undefined`, forcing us to check before accessing methods.

---

### Snippet 05 (`p05.ts`)
```ts
const found = [90, 80].find((n) => n > 95);
console.log(found.toFixed(1));
```
- **Prediction A (tsc):** Fails. Array `.find()` returns `T | undefined`, so `found` is possibly `undefined`.
- **Actual A (tsc):** `predictions/p05.ts(3,13): error TS18048: 'found' is possibly 'undefined'.`
- **Prediction B (node):** Crashes at runtime because `find` returns `undefined`.
- **Actual B (node):** Crashes with `TypeError: Cannot read properties of undefined (reading 'toFixed')`.
- **Lesson:** TypeScript accurately models JavaScript functions that can fail to find an element.

---

### Snippet 06 (`p06.ts`)
```ts
function greet(name?: string) { return `Hi ${name.toUpperCase()}`; }
console.log(greet());
```
- **Prediction A (tsc):** Fails. `name` is optional (`string | undefined`), so calling `.toUpperCase()` without checking is rejected.
- **Actual A (tsc):** `predictions/p06.ts(2,46): error TS18048: 'name' is possibly 'undefined'.`
- **Prediction B (node):** Crashes at runtime when called with no arguments.
- **Actual B (node):** Crashes with `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`.
- **Lesson:** Optional parameters `name?: string` require narrowing (e.g. `name ? name.toUpperCase() : "there"`).

---

### Snippet 07 (`p07.ts`)
```ts
const pair: [string, number] = ["Sara", 92, true];
console.log(pair);
```
- **Prediction A (tsc):** Fails. Tuple type allows 2 elements, but literal array has 3.
- **Actual A (tsc):** `predictions/p07.ts(2,7): error TS2322: Type '[string, number, boolean]' is not assignable to type '[string, number]'. Source has 3 element(s) but target allows only 2.`
- **Prediction B (node):** Prints `[ 'Sara', 92, true ]`.
- **Actual B (node):** Prints `[ 'Sara', 92, true ]`.
- **Lesson:** Tuples enforce fixed element count and positional types at compile time.

---

### Snippet 08 (`p08.ts`)
```ts
interface Student { name: string; score: number }
const s: Student = { name: "Sara", score: 92, age: 20 };
console.log(s);
```
- **Prediction A (tsc):** Fails. Excess property `age` is not defined on `Student`.
- **Actual A (tsc):** `predictions/p08.ts(3,47): error TS2353: Object literal may only specify known properties, and 'age' does not exist in type 'Student'.`
- **Prediction B (node):** Prints `{ name: 'Sara', score: 92, age: 20 }`.
- **Actual B (node):** Prints `{ name: 'Sara', score: 92, age: 20 }`.
- **Lesson:** Object literals assigned directly to a type trigger strict excess property checks to catch typos.

---

### Snippet 09 (`p09.ts`)
```ts
interface Student { name: string; score: number }
const data = { name: "Sara", score: 92, age: 20 };
const s: Student = data;
console.log(s);
```
- **Prediction A (tsc):** Passes! Because `data` is an intermediate variable, TypeScript checks structural compatibility (shape), not excess literal properties.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `{ name: 'Sara', score: 92, age: 20 }`.
- **Actual B (node):** Prints `{ name: 'Sara', score: 92, age: 20 }`.
- **Mechanism (#9):** **Structural Typing vs Excess Property Checking**. TypeScript uses duck typing (if it has `name` and `score`, it satisfies `Student`). Excess property checking only applies to fresh object literals passed directly.

---

### Snippet 10 (`p10.ts`)
```ts
interface Student { readonly id: number; tags: string[] }
const s: Student = { id: 1, tags: [] };
s.tags.push("ts");
console.log(s);
```
- **Prediction A (tsc):** Passes! `tags` itself is not marked `readonly string[]`, only the reference on `s` is readonly. Mutating with `.push()` is allowed.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `{ id: 1, tags: [ 'ts' ] }`.
- **Actual B (node):** Prints `{ id: 1, tags: [ 'ts' ] }`.
- **Mechanism (#10):** **Shallow Readonly**. Marking a property `readonly tags: string[]` prevents reassigning `s.tags = []`, but does NOT prevent mutating array contents. For immutable arrays, use `readonly string[]` or `ReadonlyArray<string>`.

---

### Snippet 11 (`p11.ts`)
```ts
const raw: unknown = JSON.parse('{"name":"Sara"}');
console.log(raw.name);
```
- **Prediction A (tsc):** Fails. Cannot access properties on type `unknown` without narrowing first.
- **Actual A (tsc):** `predictions/p11.ts(3,13): error TS18046: 'raw' is of type 'unknown'.`
- **Prediction B (node):** Prints `"Sara"`.
- **Actual B (node):** Prints `Sara`.
- **Lesson:** `unknown` is the type-safe counterpart of `any`. It forces developer to verify the shape before use.

---

### Snippet 12 (`p12.ts`)
```ts
const raw: any = JSON.parse('{"name":"Sara"}');
console.log(raw.nmae.toUpperCase());
```
- **Prediction A (tsc):** Passes. `any` turns off all compiler checking.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Crashes! `raw.nmae` is `undefined`, so calling `.toUpperCase()` throws TypeError.
- **Actual B (node):** Crashes with `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`.
- **Lesson:** `any` allows silent runtime crashes by disabling autocomplete and typo protection.

---

### Snippet 13 (`p13.ts`)
```ts
function label(x: string | number) {
  if (typeof x === "string") return x.toUpperCase();
  return x.toFixed(1);
}
console.log(label("a"), label(2));
```
- **Prediction A (tsc):** Passes. `typeof x === "string"` narrows `x` to `string` in the first branch, and control flow analysis narrows `x` to `number` in the fallback.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `"A 2.0"`.
- **Actual B (node):** Prints `A 2.0`.
- **Lesson:** Type narrowing with `typeof` lets TypeScript track the specific type down each branch.

---

### Snippet 14 (`p14.ts`)
```ts
function first<T>(items: T[]): T { return items[0]; }
const n = first([1, 2, 3]);
const s = first(["a"]);
console.log(n + 1, s + 1);
```
- **Prediction A (tsc):** Fails on `return items[0]`. With `noUncheckedIndexedAccess`, `items[0]` has type `T | undefined`, which cannot be assigned to return type `T`.
- **Actual A (tsc):** `predictions/p14.ts(2,36): error TS2322: Type 'T | undefined' is not assignable to type 'T'.`
- **Prediction B (node):** Prints `2 a1`.
- **Actual B (node):** Prints `2 a1`.
- **Mechanism (#14):** **Generics & Indexed Access**. An empty array `first([])` returns `undefined`, so a function returning `items[0]` must either return `T | undefined` or throw if empty.

---

### Snippet 15 (`p15.ts`)
```ts
function longest<T extends { length: number }>(a: T, b: T): T { return a.length >= b.length ? a : b; }
console.log(longest("abc", "de"), longest([1], [1, 2]));
console.log(longest(10, 20));
```
- **Prediction A (tsc):** Fails on line 4 `longest(10, 20)`. Primitive numbers do not have a `.length` property.
- **Actual A (tsc):** `predictions/p15.ts(4,21): error TS2345: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.`
- **Prediction B (node):** Runs line 3, then on line 4 evaluates `undefined >= undefined` (false) and prints `20`.
- **Actual B (node):** Prints `abc [ 1, 2 ] \n 20`.
- **Lesson:** Generic constraints (`T extends { length: number }`) guarantee that operations inside the generic function are valid.

---

### Snippet 16 (`p16.ts`)
```ts
async function getScore(): Promise<number> { return 92; }
const score: number = getScore();
console.log(score);
```
- **Prediction A (tsc):** Fails. An `async` function always returns a `Promise<number>`, not a raw `number`.
- **Actual A (tsc):** `predictions/p16.ts(3,7): error TS2322: Type 'Promise<number>' is not assignable to type 'number'.`
- **Prediction B (node):** Prints `Promise { 92 }`.
- **Actual B (node):** Prints `Promise { 92 }`.
- **Lesson:** Calling an async function without `await` stores the pending Promise object, not its resolved value.

---

### Snippet 17 (`p17.ts`)
```ts
async function getScore(): Promise<number> { return 92; }
const score = await getScore();
console.log(score.toFixed(1));
```
- **Prediction A (tsc):** Passes. Top-level await unwraps `Promise<number>` to `number`.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `92.0`.
- **Actual B (node):** Prints `92.0`.
- **Lesson:** `await` extracts the fulfilled value from the Promise with complete type safety.

---

### Snippet 18 (`p18.ts`)
```ts
try { throw new Error("boom"); }
catch (err) { console.log(err.message); }
```
- **Prediction A (tsc):** Fails. In strict mode, `err` in `catch` defaults to `unknown`, so accessing `.message` without narrowing is rejected.
- **Actual A (tsc):** `predictions/p18.ts(3,27): error TS18046: 'err' is of type 'unknown'.`
- **Prediction B (node):** Prints `boom`.
- **Actual B (node):** Prints `boom`.
- **Lesson:** In JavaScript, anything can be thrown (`throw "string"` or `throw 42`). TypeScript enforces checking `if (err instanceof Error)` before accessing `err.message`.

---

### Snippet 19 (`p19.ts`)
```ts
type Student = { name: string; score: number };
const s = { name: "Sara", score: 92 } as Student;
const t = { name: "Omar" } as Student;
console.log(s.score, t.score);
```
- **Prediction A (tsc):** Passes. Type assertion `as Student` forces the compiler to accept `{ name: "Omar" }`.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `92 undefined`.
- **Actual B (node):** Prints `92 undefined`.
- **Mechanism (#19):** **Type Assertions (`as`)**. Using `as` tells the compiler "trust me, I know what I'm doing", bypassing type checking and allowing missing required properties (`score`) to slip into runtime as `undefined`.

---

### Snippet 20 (`p20.ts`)
```ts
enum Grade { A, B }
console.log(Grade.A);
```
- **Prediction A (tsc):** Fails under `erasableSyntaxOnly: true`. `enum` emits JavaScript runtime objects and cannot be erased.
- **Actual A (tsc):** `predictions/p20.ts(2,6): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`
- **Prediction B (node):** Crashes with `SyntaxError` because Node type-stripping cannot strip enums.
- **Actual B (node):** Crashes with `SyntaxError`.
- **Mechanism (#20):** **Erasable Syntax & Const Objects vs Enums**. TypeScript `enum` creates custom JS objects at runtime. Modern Node 24 executes TS by simply stripping type annotations; therefore, non-erasable syntax like `enum` and namespaces are forbidden. Prefer `const Grade = { A: 0, B: 1 } as const`.

---

### Snippet 21 (`p21.ts`)
```ts
type Student = { name: string; score: number };
const update: Partial<Student> = { score: 80 };
const full: Required<Partial<Student>> = { score: 80 };
console.log(update, full);
```
- **Prediction A (tsc):** Fails on `full`. `Required<...>` turns all optional properties back into required properties, so `name` is required.
- **Actual A (tsc):** `predictions/p21.ts(4,7): error TS2741: Property 'name' is missing in type '{ score: number; }' but required in type 'Required<Partial<Student>>'.`
- **Prediction B (node):** Prints `{ score: 80 } { score: 80 }`.
- **Actual B (node):** Prints `{ score: 80 } { score: 80 }`.
- **Lesson:** `Partial<T>` makes all fields optional; `Required<T>` makes all fields mandatory.

---

### Snippet 22 (`p22.ts`)
```ts
const sizes = { S: 1, M: 2 };
type Size = keyof typeof sizes;
const a: Size = "M";
const b: Size = "L";
console.log(a, b);
```
- **Prediction A (tsc):** Fails on `b`. `keyof typeof sizes` produces `"S" | "M"`. `"L"` is not in that union.
- **Actual A (tsc):** `predictions/p22.ts(5,7): error TS2322: Type '"L"' is not assignable to type '"M" | "S"'.`
- **Prediction B (node):** Prints `M L`.
- **Actual B (node):** Prints `M L`.
- **Lesson:** `keyof typeof obj` creates a type-safe union of exact object keys.

---

### Snippet 23 (`p23.ts`)
```ts
console.log(typeof null, typeof [], typeof NaN, typeof 10n);
```
- **Prediction A (tsc):** Passes. All are valid JS expressions.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `"object object number bigint"`.
- **Actual B (node):** Prints `object object number bigint`.
- **Mechanism (#23):** **JavaScript Runtime Type Quirks**. `typeof null` is historical bug `"object"`, arrays are objects, `NaN` is technically of type number. In TypeScript, `null` has its own distinct type `null`, arrays have array types, and `bigint` is a primitive.

---

### Snippet 24 (`p24.ts`)
```ts
const list = [];
list.push(1);
list.push("two");
console.log(list);
```
- **Prediction A (tsc):** Passes. An empty array initialized without annotation is inferred as `any[]` (evolving array).
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `[ 1, 'two' ]`.
- **Actual B (node):** Prints `[ 1, 'two' ]`.
- **Lesson:** Always annotate empty arrays (e.g. `const list: number[] = []`) to avoid unintentional `any[]`.

---

### Snippet 25 (`p25.ts`)
```ts
let big = 10n;
big = big + 5;
console.log(big);
```
- **Prediction A (tsc):** Fails. Cannot mix `bigint` and standard `number` with operator `+`.
- **Actual A (tsc):** `predictions/p25.ts(3,7): error TS2365: Operator '+' cannot be applied to types 'bigint' and '5'.`
- **Prediction B (node):** Crashes with `TypeError: Cannot mix BigInt and other types, use explicit conversions`.
- **Actual B (node):** Crashes with `TypeError: Cannot mix BigInt and other types, use explicit conversions`.
- **Lesson:** BigInt operations require both sides to be BigInt (`big + 5n`).

---

### Snippet 26 (`p26.ts`)
```ts
const pair: [string, number] = ["Sara", 92];
pair.push(100);
console.log(pair.length, pair);
```
- **Prediction A (tsc):** Passes! Because TypeScript models tuples as subclasses of JS Array, `.push()` is permitted unless marked `readonly`.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `3 [ 'Sara', 92, 100 ]`.
- **Actual B (node):** Prints `3 [ 'Sara', 92, 100 ]`.
- **Mechanism (#26):** **Tuple Mutation Hole**. TypeScript tuples can be mutated by Array methods like `.push()`, `.pop()` at runtime unless typed as `readonly [string, number]`.

---

### Snippet 27 (`p27.ts`)
```ts
const settings = { theme: "dark" } as const;
settings.theme = "light";
console.log(settings.theme);
```
- **Prediction A (tsc):** Fails. `as const` marks all properties deeply `readonly`.
- **Actual A (tsc):** `predictions/p27.ts(3,10): error TS2540: Cannot assign to 'theme' because it is a read-only property.`
- **Prediction B (node):** Prints `light` (Node strips `as const` and treats it as a normal mutable object).
- **Actual B (node):** Prints `light`.
- **Mechanism (#27):** **`as const` Type Freeze vs Runtime Object**. `as const` is a purely compile-time construct that narrows literal values and marks properties readonly in TypeScript. It does not call `Object.freeze()` at runtime unless explicitly written.

---

### Snippet 28 (`p28.ts`)
```ts
const score: number = Number("12px");
console.log(score, typeof score, Number.isNaN(score));
```
- **Prediction A (tsc):** Passes. `Number()` returns `number` according to the type definitions, even when the runtime value is `NaN`.
- **Actual A (tsc):** Clean (passes).
- **Prediction B (node):** Prints `NaN number true`.
- **Actual B (node):** Prints `NaN number true`.
- **Lesson:** In JavaScript and TypeScript, `NaN` is a valid value of type `number`. Type checking cannot verify whether string parsing succeeded at runtime; you must use `Number.isNaN()` to validate.
