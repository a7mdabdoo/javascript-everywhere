# Day 05 — Notes & Architecture Synthesis

**Student:** Ahmed Mohamed Abdo (`a7mdabdoo`)  
**Track:** JavaScript Everywhere (SVNU / Eng. Mostafa Saqly)  
**Topic:** Promises, Async/Await, ESM vs CommonJS Modules, and Git Branching & PR Workflow  

---

## Part 1 & 2 — Promises & `async` / `await`

### 1. What a Promise Is, The Three States & "Settles Once"
A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. Instead of surrendering a callback function to an async API (inversion of control), the API returns a Promise object—a "receipt"—immediately.

A Promise is always in one of three mutually exclusive states:
1. `pending`: Initial state; neither fulfilled nor rejected.
2. `fulfilled`: Operation completed successfully, holding an immutable value (`resolve(val)`).
3. `rejected`: Operation failed, holding an error reason (`reject(err)`).

**Why "Settles Once" fixes a real Day 04 bug:**
In Day 04 callbacks, a buggy function could execute a callback twice (e.g. failing to return early after an error, calling `callback(err)` and subsequently `callback(null, data)`). With Promises, state transition is strictly one-way and locked forever. Once a Promise resolves or rejects, any subsequent `resolve()` or `reject()` invocation is silently discarded by the JavaScript engine.

### 2. The Missing `return` Bug in Promise Chains
In a `.then()` callback, if you invoke an async operation returning a Promise but forget the `return` statement:
```javascript
// BUG:
getUser(1).then(user => {
  fetchPermissions(user.id); // Missing return!
}).then(perms => {
  console.log(perms); // undefined!
});
```
The callback returns `undefined` immediately. The subsequent `.then()` does not wait for `fetchPermissions` to finish and receives `undefined`. To chain correctly, always explicitly return the inner Promise: `return fetchPermissions(user.id);`.

### 3. How One `.catch` (or One `try`) Replaces Every `if (err)`
In Day 04's 4-level callback pyramid, every single level required defensive boilerplate:
```javascript
if (err) return callback(err);
```
With Promises, unhandled rejections automatically cascade down the chain until encountering a `.catch()`. A single `.catch()` at the end of a 10-step chain captures any failure occurring at step 1, step 5, or step 10. In `async/await`, standard synchronous `try / catch` works seamlessly around all awaited promises.

### 4. Combinators Comparison & Production Use Cases
| Combinator | Behavior | Production Use Case |
|---|---|---|
| `Promise.all` | Waits for all to fulfill; rejects immediately if ANY reject (fail-fast). Preserves input array order. | When rendering a critical page requiring all core entities (e.g., User Profile + Permissions + Preferences). |
| `Promise.allSettled` | Waits for all to finish, never rejects. Returns array of `{ status, value/reason }`. | Batch independent operations where partial failure is tolerable (e.g., sending 100 emails, fetching classroom attendance). |
| `Promise.race` | Settles as soon as the first promise settles (fulfilled OR rejected). | Implementing request timeouts (racing API fetch against a 3-second rejection timer). |
| `Promise.any` | Ignores rejections and fulfills with the first successful promise. Only rejects if all fail (`AggregateError`). | Redundant CDNs or mirror endpoints; you only care about the fastest healthy response. |

### 5. Why `.then` Runs Before `setTimeout(..., 0)` (Microtasks vs Macrotasks)
JavaScript's Event Loop maintains distinct queues:
- **Microtask Queue:** Promise callbacks (`.then`, `.catch`, `.finally`), `queueMicrotask`, `process.nextTick`.
- **Macrotask Queue:** `setTimeout`, `setInterval`, `setImmediate`, I/O events.
After each macrotask completes (or when initial synchronous script finishes), the engine completely drains the entire Microtask Queue before picking the next macrotask. Therefore, a resolved Promise's `.then()` always executes before a `setTimeout(..., 0)` macrotask.

### 6. What `await` Pauses and What It Does NOT Pause
- `await` **pauses** execution of the *enclosing `async` function* only.
- `await` **does NOT pause** the main JavaScript thread, the event loop, or other running code. Synchronous code outside the `async` function and other concurrent tasks continue executing unblocked.

### 7. Sequential vs Parallel: The Question Before Every `await`
Before writing `await`, always ask: **Does task B need the data produced by task A?**
- If **Yes** (Dependent): Run sequentially (`const user = await getUser(); const posts = await getPosts(user.id);`).
- If **No** (Independent): Run in parallel (`const [students, courses] = await Promise.all([getStudents(), getCourses()]);`).
- **Our Task 5.2 Timings:**
  - Sequential loading of 3 students: **~138ms** (sum of delays).
  - Parallel loading of 3 students: **~60ms** (time of slowest single operation). Parallel was more than 2x faster!

### 8. The `forEach` Async Trap & `return await`
- **Why `forEach(async ...)` fails:** `Array.prototype.forEach` expects a synchronous callback. It invokes the async callback, ignores the returned Promise, and proceeds immediately. Any code after the `forEach` executes before the iterations finish. Use `for...of` (for sequential) or `Promise.all(arr.map(...))` (for parallel).
- **Why `return await` matters inside `try`:**
  - `return risky()` immediately returns the pending Promise. The function finishes and exits the `try` block before the promise rejects; the local `catch` is bypassed.
  - `return await risky()` pauses inside the `try` block until the promise settles. If it rejects, the error is thrown locally and caught by the local `catch`.

---

## Part 3 — Modules (CommonJS vs ES Modules)

### 1. What a Module Is & The Three Rules
A module is an isolated, self-contained unit of code that scopes its internal variables and explicitly declares what it exports and imports.
**The Three Rules:**
1. **Module Scope:** Variables declared in a module are private unless explicitly exported.
2. **Explicit Contracts:** Clear inputs (`import`/`require`) and outputs (`export`/`module.exports`).
3. **Singleton Evaluation & Caching:** A module executes once on first load; subsequent imports receive the cached export.

### 2. `module.exports` vs `exports`
- `module.exports` is the actual object Node returns from `require()`.
- `exports` is merely a convenience reference pointing to `module.exports`.
- **The Trap:** Adding properties works (`exports.foo = 1`). But reassigning `exports = { foo: 1 }` breaks the reference to `module.exports`. Node still returns the empty `module.exports` object.

### 3. Named vs Default Exports
- **Named Exports:** `export function add() {}` / `import { add } from './math.js'`. Explicit, self-documenting, enables IDE autocompletion and robust tree-shaking.
- **Default Export:** `export default function main() {}` / `import anyName from './main.js'`. Good for modules with a single primary responsibility.
- **Preference:** Named exports are far superior in large codebases because renaming requires explicit aliases (`as`), eliminating ambiguous import naming.

### 4. Five Key Differences: CommonJS vs ESM
| Feature | CommonJS (CJS) | ES Modules (ESM) |
|---|---|---|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous & Dynamic (runtime) | Asynchronous & Static (parse-time) |
| Environment | Node.js default historically | Standardized for Browser and Node |
| Top-level Await | Not supported | Supported natively |
| Binding Mechanism | Exports values by copy | Exports live read-only bindings |

### 5. Live Bindings vs Copies (Snippets #15 vs #16)
In CJS, exporting a primitive (`module.exports = { count }`) copies the value at export time. Mutations inside the module do not affect the consumer's copy. In ESM, `import { count }` binds directly to the exporter's variable slot; when the exporter modifies `count`, consumers immediately observe the new value.

### 6. Why Browser Modules Need Live Server & `type="module"`
Browsers block ES module imports over the `file:///` protocol due to CORS / Same-Origin security policies. An HTTP server (like VS Code Live Server or Node http) is required. In HTML, `<script type="module">` enables module scope (preventing global pollution), defers execution until the HTML is parsed, and enforces strict mode automatically.

### 7. Task 7.4 Metrics Comparison
- **Day 04 `report.js`:** 216 lines (all functions pasted in a single monolithic script).
- **Day 05 `project/report.js`:** 84 lines (61% reduction in file size; zero grading logic; pure coordination).
- **Modular `lib/` files:** `grade-lib.js` (68 lines), `db.js` (58 lines), `async-utils.js` (53 lines), `index.js` (6 lines).
- **Copies of `letterGrade`:** Reduced from 4 duplicated copies across Days 03 and 04 to **exactly 1 single authoritative definition** imported seamlessly in Node and Chrome.

---

## Part 4 — Git & GitHub Workflow

### 1. Three Trees of Git
```
 +------------------+        git add        +--------------------+       git commit       +------------------+
 |   Working Tree   | --------------------> |    Staging Area    | ---------------------> |   Git History    |
 | (Files on Disk)  |                       |      (Index)       |                        |   (Repository)   |
 +------------------+ <-------------------- +--------------------+                        +------------------+
                        git restore --staged
```

### 2. `.gitignore` Rules & Secret Security
`.gitignore` specifies intentionally untracked files: `node_modules/`, `.env`, OS artifacts (`.DS_Store`, `Thumbs.db`), build caches.
**Why deleting a pushed secret is insufficient:** Git is a permanent content-addressable history. Deleting a secret in a subsequent commit leaves the secret in prior commits. If a secret is ever pushed, it must immediately be **revoked and rotated** at the provider, and the commit history scrubbed with tools like `git filter-repo` or BFG.

### 3. Fast-Forward vs Merge Commit
- **Fast-Forward:** When the destination branch has not diverged since the feature branch split, Git simply points HEAD to the feature branch tip. No new commit object is created.
- **Merge Commit (3-way merge):** When both branches have new commits, Git creates a new merge commit with two parents reconciling both histories.

### 4. Step-by-Step Conflict Resolution
1. Run `git merge <branch>`. Git detects conflicting lines and writes conflict markers:
   `<<<<<<< HEAD`, `=======`, `>>>>>>> <branch>`.
2. Inspect conflicting files with `git status`.
3. Open each file, choose the desired logic, and delete all three marker lines.
4. Run tests (`npm run report`) to verify working state.
5. Stage the resolved files: `git add <file>`.
6. Finalize the merge: `git commit` (or cancel completely with `git merge --abort`).

### 5. The Professional PR Loop
```bash
git switch main
git pull origin main
git switch -c feature/my-feature
# ... make logical atomic commits ...
git push -u origin feature/my-feature
# ... open PR on GitHub, code review, discuss, approve ...
# ... merge on GitHub ...
git switch main
git pull origin main
git branch -d feature/my-feature
```

### 6. Undo Commands Reference
- **Before pushing:**
  - Discard working tree edit: `git restore <file>`
  - Unstage file: `git restore --staged <file>`
  - Modify latest commit message or files: `git commit --amend`
  - Undo last commit keeping changes staged: `git reset --soft HEAD~1`
- **After pushing:**
  - Safely undo a commit by creating a new inverse commit: `git revert <commit-hash>`. Never force push (`git push --force`) on shared branches.

---

## Real Bug Encountered & Resolved

**Bug Description:**
In `day-05/project/report.js`, when reading `students.json` using `fs.readFile("./students.json", "utf8")`, running `node day-05/project/report.js` from the repository root failed with `ENOENT: no such file or directory, open './students.json'`.

**Cause:**
Relative paths passed to Node's `fs` functions are resolved relative to the current working directory (`process.cwd()`), not relative to the script file location. Running the script from `d:\BU\programming\web\javascript everewhere` caused Node to search for `students.json` in the root folder instead of inside `day-05/project/`.

**Fix:**
Replaced the relative string path with a file URL constructed from `import.meta.url`:
```javascript
const studentsUrl = new URL("./students.json", import.meta.url);
const rawData = await fs.readFile(studentsUrl, "utf8");
```
This guarantees the file is always located relative to `report.js` regardless of where the `node` command is executed.
