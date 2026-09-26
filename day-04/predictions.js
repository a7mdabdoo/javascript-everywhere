// Day 04 — Task 1: predictions.js
// Running all 22 snippets and printing their outputs clearly in order.
// Synchronous throwing snippets (#2, #10, #11) are wrapped so we can see their exact Error names without stopping the script.

console.log("=== PART 1: UNPACKING (Snippets 1 - 12) ===");

// #1
{
  const { a } = { a: 1, b: 2 };
  console.log("#1 ->", a, typeof b);
}

// #2 (Throws ReferenceError)
try {
  const { x: y } = { x: 10 };
  console.log("#2 ->", x);
} catch (err) {
  console.log(`#2 -> ${err.name}: ${err.message}`);
}

// #3
{
  const { p = 5 } = { p: undefined };
  console.log("#3 ->", p);
}

// #4
{
  const { q = 5 } = { q: null };
  console.log("#4 ->", q);
}

// #5
{
  const [, , third] = ["a", "b", "c", "d"];
  console.log("#5 ->", third);
}

// #6
{
  const arr = [1, 2];
  const copy = arr;
  copy.push(3);
  console.log("#6 ->", arr.length);
}

// #7
{
  const obj = { nested: { v: 1 } };
  const shallow = { ...obj };
  shallow.nested.v = 99;
  console.log("#7 ->", obj.nested.v);
}

// #8
{
  console.log("#8 ->", { ...{ b: 3 }, ...{ a: 1, b: 2 } });
}

// #9
{
  function f({ a } = {}) {
    return a;
  }
  console.log("#9 ->", f(), f({ a: 7 }));
}

// #10 (Throws TypeError)
try {
  function g({ a }) {
    return a;
  }
  console.log("#10 ->", g());
} catch (err) {
  console.log(`#10 -> ${err.name}: ${err.message}`);
}

// #11 (Throws TypeError)
try {
  const s = { name: "Sara" };
  console.log("#11 ->", s.address.city);
} catch (err) {
  console.log(`#11 -> ${err.name}: ${err.message}`);
}

// #12
{
  console.log("#12 ->", 0 || "fallback", 0 ?? "fallback");
}

console.log("\n=== PART 2: ORDER & TIMING (Snippets 13 - 22) ===");

// #13
console.log("#13 -> a");
setTimeout(() => console.log("#13 -> b"), 0);
console.log("#13 -> c");

// #14
setTimeout(() => console.log("#14 -> timeout"), 0);
queueMicrotask(() => console.log("#14 -> micro"));
console.log("#14 -> sync");

// #15
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("#15 ->", i), 0);
}

// #16
function later() {
  setTimeout(() => {
    return 42;
  }, 0);
}
console.log("#16 ->", later());

// #17
setTimeout(() => console.log("#17 -> timer"), 0);
const start = Date.now();
while (Date.now() - start < 120) {}
console.log("#17 -> loop finished");

// #18
setTimeout(() => console.log("#18 -> outer"), 0);
setTimeout(() => {
  console.log("#18 -> first");
  setTimeout(() => console.log("#18 -> nested"), 0);
}, 0);
setTimeout(() => console.log("#18 -> second"), 0);

// #19
setTimeout(() => {
  console.log("#19 -> timer");
  queueMicrotask(() => console.log("#19 -> micro inside timer"));
}, 0);
setTimeout(() => console.log("#19 -> timer 2"), 0);

// #20 (Demonstrating why try/catch misses async timer errors)
try {
  setTimeout(() => {
    console.log("#20 -> [Uncaught Error: late] (try/catch already left the stack!)");
  }, 0);
} catch (e) {
  console.log("#20 -> caught", e.message);
}
console.log("#20 -> after try");

// #21
function load(cb) {
  cb("#21 -> sync call");
  setTimeout(() => cb("#21 -> async call"), 0);
}
load((msg) => console.log(msg));
console.log("#21 -> after load");

// #22
setTimeout(() => console.log("#22 -> A (20ms)"), 20);
setTimeout(() => console.log("#22 -> B (10ms)"), 10);
queueMicrotask(() => console.log("#22 -> C (microtask)"));
console.log("#22 -> D (sync)");
