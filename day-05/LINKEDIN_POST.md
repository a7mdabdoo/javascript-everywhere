Day 05 of JavaScript Everywhere with Eng. Mostafa Saqly done!

In Day 04, handling async tasks with callbacks led to a deep 4-level pyramid (Callback Hell) and repetitive if (err) lines everywhere.

Today we moved to modern async JavaScript:
1. Promises: Why "settles once" prevents callbacks from running more than once.
2. Flattening the pyramid: Rewrote the database lookups with async/await. A single try/catch block replaced all manual error checks.
3. Sequential vs Parallel: Tested loading students one by one (138ms) vs with Promise.all (60ms). Running independent async calls sequentially is a big waste of time.
4. The forEach trap: Learned why forEach(async ...) does not wait for async callbacks and fixed it with for...of and Promise.all.
5. ES Modules: Split our grade report into reusable modules (grade-lib.js, db.js, async-utils.js). The exact same module runs in Node.js and in the browser.
6. Git workflow: Worked on a feature branch, simulated a merge conflict by hand, resolved it, and practiced opening a pull request.

Repo: https://github.com/a7mdabdoo/javascript-everywhere

Next up: TypeScript!
