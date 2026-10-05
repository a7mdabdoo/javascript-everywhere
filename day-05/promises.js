// Task 2: promises lab
console.log("=== Task 2.1: Creating Promises ===");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const delayValue = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const failAfter = (ms, message) => new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

// inspect before and after
const pendingP = delayValue(100, "Ahmed");
console.log("Before settling:", pendingP);

pendingP.then((val) => {
  console.log("After settling:", pendingP, "Value:", val);
  runPart2_2();
});

// 2.2: settles once
function runPart2_2() {
  console.log("\n=== Task 2.2: Settles Once ===");

  const doubleResolve = new Promise((resolve) => {
    resolve("First Value");
    resolve("Second Value");
  });
  doubleResolve.then((val) => console.log("doubleResolve:", val));

  const resolveThenReject = new Promise((resolve, reject) => {
    resolve("Resolved");
    reject(new Error("Error"));
  });
  resolveThenReject
    .then((val) => console.log("resolveThenReject:", val))
    .catch((err) => console.log("Error:", err.message));

  // In Day 04, a callback could accidentally run twice. Promises guarantee only one settlement.

  setTimeout(runPart2_3, 50);
}

// 2.3: chaining
function runPart2_3() {
  console.log("\n=== Task 2.3: Chaining ===");

  // 4 transformations
  Promise.resolve(10)
    .then((n) => n + 5)
    .then((n) => n * 2)
    .then((n) => n - 4)
    .then((n) => n / 2)
    .then((res) => console.log("Final result:", res));

  // chained delayValues
  const startTime = Date.now();
  delayValue(50, "Step 1")
    .then((step1) => {
      console.log(`[+${Date.now() - startTime}ms] ${step1}`);
      return delayValue(50, "Step 2");
    })
    .then((step2) => {
      console.log(`[+${Date.now() - startTime}ms] ${step2}`);
      return delayValue(50, "Step 3");
    })
    .then((step3) => {
      console.log(`[+${Date.now() - startTime}ms] ${step3}`);
      console.log(`Total time: ~${Date.now() - startTime}ms`);
    });

  // missing return
  Promise.resolve("test")
    .then(() => {
      delayValue(50, "missing return");
    })
    .then((received) => {
      console.log("Without return, next received:", received);
    });

  // destructure in parameter
  Promise.resolve({ name: "Ahmed", score: 95 })
    .then(({ name, score }) => {
      console.log(`Destructured: ${name}, score: ${score}`);
    });

  setTimeout(runPart2_4, 250);
}

// 2.4: errors
function runPart2_4() {
  console.log("\n=== Task 2.4: Errors & Error Handling ===");

  // throw and catch
  Promise.resolve("Start")
    .then(() => {
      throw new Error("step 1 error");
    })
    .then(() => console.log("skipped"))
    .then(() => console.log("skipped"))
    .catch((err) => {
      console.log("Caught after skipped steps:", err.message);
    });

  // catch returning fallback
  Promise.reject(new Error("failed"))
    .catch((err) => {
      console.log("Recovering from:", err.message);
      return { id: 101, name: "Ahmed", fallback: true };
    })
    .then((data) => {
      console.log("Chain continued with fallback:", data);
    });

  // finally
  Promise.resolve("done")
    .finally(() => console.log("[Finally]: cleanup"))
    .then((v) => console.log("value after finally:", v));

  // reject string vs Error
  Promise.reject("string error")
    .catch((err) => console.log("Reject string -> message:", err.message));

  Promise.reject(new Error("real error"))
    .catch((err) => console.log("Reject Error -> message:", err.message));
}
