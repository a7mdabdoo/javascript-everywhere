/* task 4.1
 Write makeCounter() returning a function that increments and returns a private count
 Create two counters and prove they're independent
 Comment one sentence on why count still exists after makeCounter() returned
 */
function makeCounter() {
    let count = 0;
    return function () {
        count++;
        return count;
    };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

console.log("counter1:", counter1(), counter1(), counter1());
console.log("counter2:", counter2(), counter2());

// count stays in memory because the returned inner function still has access to it through closure


/* task 4.2
 Write makeMultiplier(factor) returning a function that multiplies its input
 Build double, triple, and half from it and test each
 */
function makeMultiplier(factor) {
    return (num) => num * factor;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
const half = makeMultiplier(0.5);

console.log("double(8):", double(8));
console.log("triple(8):", triple(8));
console.log("half(8):", half(8));


/* task 4.3
 Write makeGrader(passMark) returning a function that gives "Pass" / "Fail"
 Build a strict grader (85) and a lenient one (60)
 Run the same score through both and print both answers
 */
function makeGrader(passMark) {
    return (score) => (score >= passMark ? "Pass" : "Fail");
}

const strict = makeGrader(85);
const lenient = makeGrader(60);

const testScore = 75;
console.log(`Score ${testScore} -> Strict (85):`, strict(testScore));
console.log(`Score ${testScore} -> Lenient (60):`, lenient(testScore));


/* task 4.4
 Write myForEach(array, callback) that calls the callback with (item, index) for every element
 Use a for loop inside — do not use the built-in .forEach
 Test it printing 1. Web, 2. Mobile, …
 */
function myForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        callback(array[i], i);
    }
}

const tracks = ["Web", "Mobile", "Desktop", "AI", "Cloud", "DevOps"];
myForEach(tracks, (track, index) => {
    console.log(`${index + 1}. ${track}`);
});


/* task 4.5
 Write myMap(array, callback) returning a new array of results
 Write myFilter(array, test) returning only the items where test(item) is truthy
 Prove the original array was not modified
 Test myFilter with a scores array, keeping only passing scores
 */
function myMap(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i));
    }
    return result;
}

function myFilter(array, test) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (test(array[i], i)) {
            result.push(array[i]);
        }
    }
    return result;
}

const numbers = [10, 20, 30];
const doubled = myMap(numbers, (x) => x * 2);
console.log("original numbers:", numbers);
console.log("doubled numbers:", doubled);

const scores = [45, 82, 60, 95, 30, 74];
const passing = myFilter(scores, (s) => s >= 60);
console.log("original scores:", scores);
console.log("passing scores:", passing);


/* task 4.6
 Write a runTwice(fn) that calls the function it's given, twice
 Call it correctly with runTwice(sayHi)
 Then deliberately call it as runTwice(sayHi()), screenshot the wrong behaviour, and comment what happened
 */
function runTwice(fn) {
    fn();
    fn();
}

function sayHi() {
    console.log("Hi there!");
}

// 1. Correct: passing function reference
console.log("Calling correctly:");
runTwice(sayHi);

// 2. Wrong: calling the function while passing it
// runTwice(sayHi());
// sayHi() runs immediately and returns undefined, so runTwice receives undefined and tries to call undefined() which throws TypeError.
