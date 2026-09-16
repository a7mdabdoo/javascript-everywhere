// Day 03 — Task 1: Predictions Runner

console.log("=== Snippet 1 ===");
console.log(a);
var a = 1;

console.log("\n=== Snippet 2 ===");
try {
  console.log(b);
  let b = 2;
} catch (err) {
  console.log(err.name + ": " + err.message);
}

console.log("\n=== Snippet 3 ===");
hello();
function hello() {
  console.log("hi");
}

console.log("\n=== Snippet 4 ===");
try {
  bye();
  const bye = () => console.log("bye");
} catch (err) {
  console.log(err.name + ": " + err.message);
}

console.log("\n=== Snippet 5 ===");
function f() {
  return;
  42;
}
console.log(f());

console.log("\n=== Snippet 6 ===");
const g = (x) => {
  x * 2;
};
console.log(g(5));

console.log("\n=== Snippet 7 ===");
const h = (x) => {
  value: x;
};
console.log(h(5));

console.log("\n=== Snippet 8 ===");
function k(a, b) {
  return a + b;
}
console.log(k(1));

console.log("\n=== Snippet 9 ===");
function m(x = 10) {
  return x;
}
console.log(m(null), m(undefined), m(0));

console.log("\n=== Snippet 10 ===");
let n = "outer";
function p() {
  let n = "inner";
  return n;
}
console.log(p(), n);

console.log("\n=== Snippet 11 ===");
for (var i = 0; i < 3; i++) {}
console.log(i);

console.log("\n=== Snippet 12 ===");
try {
  for (let j = 0; j < 3; j++) {}
  console.log(j);
} catch (err) {
  console.log(err.name + ": " + err.message);
}

console.log("\n=== Snippet 13 ===");
function counter() {
  let c = 0;
  return () => ++c;
}
const q = counter();
console.log(q(), q(), counter()());

console.log("\n=== Snippet 14 ===");
const nums = [1, 2, 3];
console.log(nums.map((x) => x * 2));

console.log("\n=== Snippet 15 ===");
function r() {
  console.log("ran");
}
console.log(r);
