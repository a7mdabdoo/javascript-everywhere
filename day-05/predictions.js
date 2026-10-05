// Day 05 — Task 1: Predictions 1 to 10 (Promises & Async/Await)

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const later = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const failAt = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error(`failed at ${ms}`)), ms));

async function runAllPredictions() {
  console.log("=== Snippet 1 ===");
  console.log("a");
  new Promise((resolve) => {
    console.log("b");
    resolve();
  });
  console.log("c");

  await delay(50);

  console.log("\n=== Snippet 2 ===");
  const p2 = new Promise((resolve) => {
    resolve("first");
    resolve("second");
  });
  p2.then((v) => console.log("p2:", v));

  await delay(50);

  console.log("\n=== Snippet 3 ===");
  Promise.resolve("start")
    .then(() => {
      delay(100).then(() => "slow value");
    })
    .then((v) => console.log("p3:", v));

  await delay(150);

  console.log("\n=== Snippet 4 ===");
  setTimeout(() => console.log("timeout"), 0);
  Promise.resolve().then(() => console.log("then"));
  console.log("sync");

  await delay(50);

  console.log("\n=== Snippet 5 ===");
  async function f() {
    console.log("B");
    await null;
    console.log("D");
  }
  console.log("A");
  f();
  console.log("C");

  await delay(50);

  console.log("\n=== Snippet 6 ===");
  async function run6() {
    [3, 1, 2].forEach(async (n) => {
      await delay(n * 10);
      console.log("p6 item:", n);
    });
    console.log("done");
  }
  run6();

  await delay(60);

  console.log("\n=== Snippet 7 ===");
  Promise.all([later(300, "slow"), later(100, "fast")]).then((values) => console.log("p7:", values));

  await delay(350);

  console.log("\n=== Snippet 8 ===");
  Promise.all([later(100, "a"), Promise.reject(new Error("b failed")), later(50, "c")])
    .then((values) => console.log(values))
    .catch((e) => console.log("all:", e.message));

  await delay(120);

  console.log("\n=== Snippet 9 ===");
  Promise.race([later(200, "win"), failAt(100)])
    .then((v) => console.log("race:", v))
    .catch((e) => console.log("race:", e.message));

  Promise.any([later(200, "win"), failAt(100)])
    .then((v) => console.log("any:", v));

  await delay(250);

  console.log("\n=== Snippet 10 ===");
  async function risky() {
    throw new Error("boom");
  }
  async function main10() {
    try {
      return risky();
    } catch (e) {
      console.log("caught inside:", e.message);
    }
  }
  main10().catch((e) => console.log("caught outside:", e.message));

  await delay(50);
}

runAllPredictions();
