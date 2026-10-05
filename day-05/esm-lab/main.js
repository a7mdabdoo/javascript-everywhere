// Day 05 — Task 6.4 & 6.5: ESM Lab Main Runner
// 1. Importing named exports in braces:
import { add, multiply } from "./math-utils.js";

// 2. Renaming a named export with 'as':
import { PI as CIRCLE_PI } from "./math-utils.js";

// 3. Namespace import with 'import * as':
import * as math from "./math-utils.js";

// 4. Default import:
import defaultCalc from "./math-utils.js";
import calcAlias from "./math-utils.js";

// 5. Node.js built-in fs/promises with node: protocol:
import fs from "node:fs/promises";

console.log("=== Task 6.4: ES Module Imports Lab ===");
console.log("Named import add(5, 7):", add(5, 7));
console.log("Named import multiply(4, 6):", multiply(4, 6));
console.log("Renamed import CIRCLE_PI:", CIRCLE_PI);

// Inspect namespace keys:
console.log("Namespace import keys (Object.keys(math)):", Object.keys(math));

// Prove default export identity under two different names:
console.log("Is defaultCalc identical to calcAlias?", defaultCalc === calcAlias);
console.log("Using default export calculator:", defaultCalc("multiply", 7, 8));

// 6. Dynamic import inside an if statement:
const loadBonus = true;
if (loadBonus) {
  const dynamicModule = await import("./math-utils.js");
  console.log("Dynamic import inside if condition successful. power(2, 5) =", dynamicModule.power(2, 5));
}

console.log("\n=== Task 6.5: ESM Rules & Top-Level Await ===");
// Top-level await reading students.json:
const jsonUrl = new URL("./students.json", import.meta.url);
const rawJson = await fs.readFile(jsonUrl, "utf8");
const students = JSON.parse(rawJson);
console.log("Top-level await read students.json via import.meta.url successfully! Count:", students.length);

// Log import.meta metadata:
console.log("import.meta.dirname :", import.meta.dirname);
console.log("import.meta.filename:", import.meta.filename);
