// Day 05 — Task 6.6: ESM Break It Lab
console.log("=== Task 6.6: ESM Break It Lab ===");

// 1. Using require in ESM:
try {
  // @ts-ignore
  require("./math-utils.js");
} catch (err) {
  console.log("1. require in ESM caught ->", err.name, ":", err.message);
  console.log("   Explanation: In ECMAScript Modules, `require` is not in global scope. You must use `import`.");
}

// 2. Using __dirname in ESM:
try {
  // @ts-ignore
  console.log(__dirname);
} catch (err) {
  console.log("\n2. __dirname in ESM caught ->", err.name, ":", err.message);
  console.log("   Explanation: `__dirname` is a CommonJS wrapper variable. In ESM, use `import.meta.dirname`.");
}

// 3. Dynamic import without extension:
try {
  await import("./math-utils");
} catch (err) {
  console.log("\n3. Missing extension import caught ->", err.code, ":", err.message);
  console.log("   Explanation: ESM requires explicit file extensions in relative specifiers.");
}

// 4. Importing non-existent export:
try {
  // @ts-ignore
  const mod = await import("./math-utils.js");
  const missing = mod.nonExistentFunction;
  console.log("\n4. Accessing non-existent export on namespace ->", missing);
} catch (err) {
  console.log("\n4. Non-existent export caught ->", err.message);
}
