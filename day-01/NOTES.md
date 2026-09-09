# Day 01 Notes

## 1. Node.js vs Browser
- **Browser:** Runs JavaScript to interact with the DOM (`document`, `window`, UI elements). It cannot access the operating system or run local files directly.
- **Node.js:** A runtime that lets JavaScript run outside the browser (on servers or terminal). It has access to system features like `process` and file systems, but it has no `document` or `window`.

## 2. What is npm?
npm is the package manager for Node.js. It is used to install libraries, manage dependencies, and run project scripts defined in `package.json`.

## 3. Git vs GitHub
- **Git:** A local version control tool installed on the computer to track code changes and commits.
- **GitHub:** An online platform used to host Git repositories remotely and share code.

## 4. Commands Learned
- `node file.js` - Runs a JavaScript file in Node.
- `npm --version` - Checks the installed npm version.
- `git status` - Shows changed, untracked, and staged files.
- `git add .` - Stages files for the next commit.
- `git commit -m "msg"` - Saves a snapshot of staged changes.
- `git push origin main` - Pushes commits to GitHub.
- `git log --oneline` - Shows short commit history.
- `code .` - Opens current folder in VS Code.

## 5. What Broke & How I Fixed It
When running `npm --version` in PowerShell, it gave an error saying script execution was disabled (`PSSecurityException`).
Fixed it by changing the execution policy for the current user:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```
After that, `npm` ran normally without errors.

## 6. Questions & Answers
- **When do you use `let` instead of `const`?**  
  Use `const` by default for variables that won't be reassigned. Use `let` only when the value needs to change later (like counters in loops).

- **What does `typeof []` return, and why is that surprising?**  
  It returns `"object"`. It is surprising because you expect it to return `"array"`, but arrays in JavaScript are a special kind of object.

- **What is the difference between `===` and `==`, and why do we only use `===`?**  
  `===` checks both value and type without conversion. `==` tries to convert types automatically (e.g. `5 == "5"` is true), which causes bugs. We only use `===` to avoid unexpected type coercion.

- **When would you use `while` instead of `for`?**  
  Use `for` when you know the number of iterations in advance. Use `while` when you don't know how many times the loop will run and it depends on a condition becoming false.
