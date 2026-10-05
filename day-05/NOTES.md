# Day 05 — Notes: Promises, Modules & Git

**Student:** Ahmed Mohamed Abdo  
**Track:** JavaScript Everywhere (SVNU / Eng. Mostafa Saqly)  

---

## Part 1 & 2: Promises and async / await

### 1. What is a Promise?
A Promise is an object representing a task that will finish in the future.
Instead of passing a callback function and hoping it gets called correctly, the function returns a Promise object right away like a receipt.

A Promise is always in one of three states:
- `pending`: still waiting.
- `fulfilled`: finished successfully with a value (`resolve`).
- `rejected`: failed with an error (`reject`).

**Why "settles once" matters:**
In Day 04, a buggy function could call a callback multiple times by mistake.
A Promise settles once: after it resolves or rejects, any other calls to `resolve()` or `reject()` are completely ignored.

### 2. The Missing `return` Bug
If you call another promise inside `.then()` but forget `return`:
```js
getUser(1).then(user => {
  fetchScores(user.id); // forgot return!
}).then(scores => {
  console.log(scores); // undefined!
});
```
The chain won't wait for `fetchScores` and receives `undefined`. You must write `return fetchScores(user.id);`.

### 3. One `.catch` Replaces Every `if (err)`
In Day 04's pyramid, every single step had `if (err) return callback(err)`.
With Promises, an error in any step automatically drops straight down to the single `.catch()` at the end of the chain, or into the `catch` block of `try/catch`.

### 4. Combinators (all, allSettled, race, any)
- `Promise.all`: waits for all to succeed. If one fails, the whole thing fails fast. Used when you need all data to display a page.
- `Promise.allSettled`: waits for all to finish, never fails. Gives you an array showing what succeeded and what failed. Great for batch tasks like loading attendance.
- `Promise.race`: returns the first one that finishes, whether it succeeded or failed. Used for timeouts.
- `Promise.any`: returns the first one that succeeds, ignores errors unless all fail. Used when fetching from backup servers.

### 5. Why `.then` Runs Before `setTimeout(..., 0)`
JavaScript has two queues in the event loop:
- Microtask queue (Promise `.then`, `catch`, `finally`).
- Macrotask queue (`setTimeout`, `setInterval`).
Microtasks are always executed before macrotasks. So a resolved Promise callback runs before `setTimeout(..., 0)`.

### 6. What `await` Pauses
`await` only pauses the execution of the `async` function it is inside.
It does not block the browser, Node.js, or other code running in the background.

### 7. Sequential vs Parallel
Before writing `await`, ask yourself: does step B need data from step A?
- If yes: run sequentially (`const user = await getUser(); const scores = await getScores(user.id);`).
- If no: run in parallel (`const [s1, s2] = await Promise.all([getStudent(1), getStudent(2)]);`).
- Our timings in Task 5.2:
  - Sequential loading of 3 students: ~138ms.
  - Parallel loading of 3 students: ~60ms (more than 2x faster).

### 8. `forEach` Trap and `return await`
- `forEach(async ...)` doesn't wait because `forEach` runs synchronously and ignores returned promises. Use `for...of` or `Promise.all(arr.map(...))`.
- Inside `try / catch`, `return risky()` exits the function immediately before the promise rejects, so the local `catch` is bypassed. Writing `return await risky()` waits inside the `try`, so the local `catch` catches the error.

---

## Part 3: Modules (CommonJS & ESM)

### 1. What is a Module?
A module is an isolated JavaScript file with its own scope.
Three main rules:
1. Everything inside is private unless explicitly exported.
2. Clear exports and imports.
3. Evaluated once and cached.

### 2. `module.exports` vs `exports`
`module.exports` is what Node actually returns. `exports` is just a shortcut variable pointing to `module.exports`.
If you write `exports = { foo }`, you reassign the local variable and break the link, so nothing is exported.

### 3. Named vs Default Exports
- Named exports (`export function foo()`) are explicit and easier to autocomplete in VS Code.
- Default exports (`export default function foo()`) are useful when a module has one main job.
- I prefer named exports because they prevent naming mistakes across files.

### 4. Five Differences: CommonJS vs ESM
1. CJS uses `require()` and `module.exports`; ESM uses `import` and `export`.
2. CJS loads synchronously; ESM is parsed statically before running.
3. ESM supports top-level `await`; CJS does not.
4. CJS exports primitive values by copy; ESM exports live bindings.
5. ESM works natively in both Node and modern browsers.

### 5. Live Bindings vs Copies
In CommonJS, exporting a number copies its current value. Calling a function that increments it does not change the imported number.
In ESM, the import is a live reference: when the module changes its internal variable, the importer sees the new value immediately.

### 6. Modules in Browser
Browser modules require an HTTP server (like Live Server) because `file:///` URLs are blocked by CORS policies.
In HTML, `<script type="module">` keeps variables out of the global `window` object.

### 7. Code Metrics
- Day 04 `report.js`: 216 lines (all functions crammed in one file).
- Day 05 `project/report.js`: 84 lines (clean coordinator script).
- Separate reusable files: `grade-lib.js` (68 lines), `db.js` (58 lines), `async-utils.js` (53 lines).
- Copies of `letterGrade`: went from 4 copies down to 1 single file used in both Node.js and the browser.

---

## Part 4: Git Workflow

### 1. The Three Places Code Lives
1. Working Tree: files you are editing on your hard drive.
2. Staging Area (Index): files prepared for the next commit (`git add`).
3. Git History (HEAD): committed snapshots in the repository (`git commit`).

### 2. `.gitignore` & Secrets
Add `node_modules/`, `.env`, and OS files to `.gitignore`.
If an API key or password is ever pushed to GitHub, deleting it in a new commit is not enough because it stays in git history. You must revoke the key immediately and generate a new one.

### 3. Fast-forward vs Merge Commit
- Fast-forward: when the main branch has no new commits, Git just moves the pointer forward.
- Merge commit: when both branches have new commits, Git creates a new commit joining them.

### 4. Resolving a Conflict
1. Run `git merge branch-name`.
2. Git marks conflicts with `<<<<<<<`, `=======`, `>>>>>>>`.
3. Open the file, pick the correct lines, and delete the marker lines.
4. Run `git add` and `git commit` to finish the merge.

### 5. Pull Request Flow
1. Update main: `git switch main && git pull`.
2. Make a branch: `git switch -c feature/my-feature`.
3. Make changes and commit: `git commit -m "..."`.
4. Push: `git push -u origin feature/my-feature`.
5. Open PR on GitHub, review changes, and merge.
6. Clean up locally: `git switch main && git pull && git branch -d feature/my-feature`.

### 6. Undo Commands
- Before push:
  - Discard uncommitted edit: `git restore file.js`.
  - Unstage file: `git restore --staged file.js`.
  - Fix last commit message: `git commit --amend`.
- After push:
  - Create a new commit that reverses changes: `git revert <commit-hash>`.

---

## Bug I Hit & How I Fixed It

When running `node day-05/project/report.js` from the repository root, `fs.readFile("./students.json")` failed with `ENOENT: no such file or directory`.
**Reason:** Node resolves relative paths from the folder where you run the terminal command (`process.cwd()`), not from where `report.js` lives.
**Fix:** Used `import.meta.url` to build the path relative to the file:
```js
const fileUrl = new URL("./students.json", import.meta.url);
const data = await fs.readFile(fileUrl, "utf8");
```
