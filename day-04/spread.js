// 3.1 Copy vs alias

const a = [10, 20, 30];
const b = a;

b.push(40);
console.log("a after b.push:", a);

const c = [...a];
c.push(50);
console.log("a after c.push:", a);
console.log("c:", c);

// b = a references the same array in memory, while c = [...a] creates a new array and copies the values


// 3.2 Arrays without mutation
/** Combine two arrays into a third with spread
 Add an item to the end and to the front, each producing a new array
 Prove the original array's length never changed
 Remove an item by index using spread and slicing — original untouched
 */

const arr1 = ["html", "css"];
const arr2 = ["js", "ts"];
const arr3 = [...arr1, ...arr2];
console.log("combined:", arr3);

const withFront = ["Git", ...arr1];
const withEnd = [...arr1, "Tailwind"];
console.log("arr1 length:", arr1.length);
console.log("withFront length:", withFront.length);
console.log("withEnd length:", withEnd.length);

const items = ["a", "b", "c", "d"];
const indexToRemove = 1;
const withoutB = [...items.slice(0, indexToRemove), ...items.slice(indexToRemove + 1)];
console.log("withoutB:", withoutB);
console.log("items original:", items);


// 3.3 Objects without mutation

const student = { name: "Sara", score: 90, attendance: 85 };

const updated = { ...student, score: 95 };
console.log("original score:", student.score);
console.log("updated score:", updated.score);

const withId = { ...student, id: "STU-01" };
console.log("withId:", withId);

const { attendance, ...without } = student;
console.log("without attendance:", without);


// 3.4 Merge order

const defaults = { passMark: 60, theme: "dark" };
const custom = { passMark: 75 };

const mergedCorrect = { ...defaults, ...custom };
const mergedWrong = { ...custom, ...defaults };

console.log("custom wins:", mergedCorrect);
console.log("defaults overwrote custom (bug):", mergedWrong);

// We want { ...defaults, ...custom } because later keys overwrite earlier keys, so putting defaults last ignores custom settings.


// 3.5 The shallow copy trap

const originalUser = {
    name: "Ahmed",
    grades: { math: 95, science: 90 }
};

const shallowCopy = { ...originalUser };
shallowCopy.grades.math = 50;
console.log("original math after shallow edit (broken):", originalUser.grades.math);

// Fix by spreading the nested object too
const safeOriginal = {
    name: "Ahmed",
    grades: { math: 95, science: 90 }
};

const deepCopy = {
    ...safeOriginal,
    grades: { ...safeOriginal.grades }
};
deepCopy.grades.math = 50;
console.log("safeOriginal math after deep edit (safe):", safeOriginal.grades.math);
console.log("deepCopy math:", deepCopy.grades.math);


// 3.6 Rest in functions

function total(...numbers) {
    let sum = 0;
    for (const num of numbers) {
        sum += num;
    }
    return sum;
}
console.log("total(10, 20, 30):", total(10, 20, 30));

function logAll(label, ...list) {
    console.log(`Label: ${label}`);
    for (const item of list) {
        console.log("-", item);
    }
}
logAll("Tracks", "Web", "Mobile", "AI");

function rotate(first, ...others) {
    return [...others, first];
}
console.log("rotate(1, 2, 3, 4):", rotate(1, 2, 3, 4));

// Putting ...rest before another parameter throws SyntaxError:
// function wrongRest(...rest, last) {} // SyntaxError: Rest parameter must be last formal parameter


// 3.7 Spread into arguments

const scores = [75, 92, 68, 88];

console.log("Math.max without spread:", Math.max(scores));    // NaN
console.log("Math.max with spread:", Math.max(...scores));    // 92

// Math.max expects separate number arguments, not an array, so without spread it returns NaN and with spread it unpacks the array into individual arguments.
