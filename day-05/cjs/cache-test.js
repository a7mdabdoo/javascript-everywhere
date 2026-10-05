// Day 05 — Task 6.2: Demonstrating CommonJS Module Cache
console.log("=== Task 6.2: CommonJS Module Cache Proof ===");

// 1. Requiring grade-lib from two separate callers:
console.log("First require of grade-lib:");
const gl1 = require("./lib/grade-lib");

console.log("Second require of grade-lib (Notice: no evaluation log prints):");
const gl2 = require("./lib/grade-lib");

console.log("Are gl1 and gl2 the exact same cached reference?", gl1 === gl2);

// 2. Requiring counter from two callers:
console.log("\nTesting counter cache sharing:");
const counterA = require("./lib/counter");
const counterB = require("./lib/counter");

console.log("counterA call 1 ->", counterA());
console.log("counterB call 1 ->", counterB());
console.log("counterA call 2 ->", counterA());
console.log("Proved: Both callers mutate and share the exact same underlying module closure state!");
