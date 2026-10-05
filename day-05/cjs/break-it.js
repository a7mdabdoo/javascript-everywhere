// Day 05 — Task 6.3: CommonJS Break It Demonstrations
console.log("=== Task 6.3: CommonJS Break It Lab ===");

// 1. Trying to require a local path without './' prefix:
try {
  console.log("Attempting: require('lib/grade-lib') [Omitted ./]");
  require("lib/grade-lib");
} catch (err) {
  console.log("Caught Error:", err.code || err.name, "-", err.message);
  console.log(
    "Explanation: Without './' or '../', Node treats 'lib/grade-lib' as an npm package or built-in core module." +
    " It searches node_modules/ folders up the directory tree and fails with MODULE_NOT_FOUND."
  );
}

// 2. The `exports = { ... }` reassignment trap:
// In a simulated wrapper:
function simulateModuleLoading() {
  const module = { exports: {} };
  let exports = module.exports; // alias reference

  // Developer attempts to export by reassigning exports:
  exports = { brokenFunction: () => "I will never be exported!" };

  // What Node actually returns from require():
  return module.exports;
}

const exportedResult = simulateModuleLoading();
console.log("\nSimulated `exports = { ... }` result:", exportedResult);
console.log("Is brokenFunction exported?", exportedResult.brokenFunction !== undefined);
console.log(
  "Explanation: `exports` is just a local variable pointing to `module.exports`." +
  " Reassigning `exports = { ... }` simply overwrites the local pointer. Node always returns `module.exports`."
);
