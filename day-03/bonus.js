/* Bonus Tasks — Advanced Function Challenges
 1. compose(f, g)
 2. once(fn)
 3. memoize(fn)
 4. myReduce(array, callback, initial) + averageWithReduce
 5. weightedScore(student) + custom sort loop
 6. makeIdGenerator(prefix)
 7. validateStudent(student)
 */

// 1. compose(f, g)
function compose(f, g) {
    return function (x) {
        return f(g(x));
    };
}

const add10 = (x) => x + 10;
const double = (x) => x * 2;
const doubleThenAdd10 = compose(add10, double);
console.log("compose doubleThenAdd10(5):", doubleThenAdd10(5)); // (5 * 2) + 10 = 20


// 2. once(fn)
function once(fn) {
    let ran = false;
    let result;
    return function (...args) {
        if (!ran) {
            ran = true;
            result = fn(...args);
        }
        return result;
    };
}

const initialize = once(() => "Database initialized!");
console.log("once call 1:", initialize());
console.log("once call 2:", initialize()); // returns cached result without running again


// 3. memoize(fn)
function memoize(fn) {
    const cache = {};
    return function (arg) {
        if (arg in cache) {
            console.log(`[memoize] returning cached result for ${arg}`);
            return cache[arg];
        }
        const result = fn(arg);
        cache[arg] = result;
        return result;
    };
}

// Slow loop test
function slowSquare(n) {
    let count = 0;
    for (let i = 0; i < 1e7; i++) {
        count++;
    }
    return n * n;
}

const fastSquare = memoize(slowSquare);
console.log("fastSquare(5):", fastSquare(5));
console.log("fastSquare(5):", fastSquare(5)); // from cache


// 4. myReduce(array, callback, initial)
function myReduce(array, callback, initial) {
    let acc = initial !== undefined ? initial : array[0];
    let startIndex = initial !== undefined ? 0 : 1;

    for (let i = startIndex; i < array.length; i++) {
        acc = callback(acc, array[i], i);
    }
    return acc;
}

function averageWithReduce(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) return 0;
    const total = myReduce(numbers, (sum, n) => sum + n, 0);
    return total / numbers.length;
}

console.log("averageWithReduce([80, 90, 100]):", averageWithReduce([80, 90, 100]));


// 5. weightedScore(student) + sort with custom loop (no .sort())
function weightedScore(student) {
    return (student.score * 0.7) + (student.attendance * 0.3);
}

function sortByWeighted(studentsList) {
    const list = [...studentsList];
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            if (weightedScore(list[j]) > weightedScore(list[i])) {
                const temp = list[i];
                list[i] = list[j];
                list[j] = temp;
            }
        }
    }
    return list;
}

const sampleStudents = [
    { name: "Ali", score: 90, attendance: 60 },
    { name: "Sara", score: 85, attendance: 95 },
    { name: "Ahmed", score: 95, attendance: 90 }
];

console.log("Sorted by weighted score:");
for (const s of sortByWeighted(sampleStudents)) {
    console.log(`- ${s.name}: weighted score = ${weightedScore(s).toFixed(1)}`);
}


// 6. makeIdGenerator(prefix)
function makeIdGenerator(prefix) {
    let id = 1;
    return function () {
        const generated = `${prefix}${String(id).padStart(3, "0")}`;
        id++;
        return generated;
    };
}

const studentIdGen = makeIdGenerator("STU-");
console.log("Generated IDs:", studentIdGen(), studentIdGen(), studentIdGen());


// 7. validateStudent(student)
function validateStudent(student) {
    const errors = [];
    if (!student || typeof student !== "object") {
        return ["Invalid student data"];
    }
    if (!student.name || typeof student.name !== "string" || student.name.trim() === "") {
        errors.push("Student name is required");
    }
    if (typeof student.score !== "number" || isNaN(student.score) || student.score < 0 || student.score > 100) {
        errors.push("Score must be a number between 0 and 100");
    }
    if (typeof student.attendance !== "number" || isNaN(student.attendance) || student.attendance < 0 || student.attendance > 100) {
        errors.push("Attendance must be a number between 0 and 100");
    }
    return errors;
}

console.log("Validation valid:", validateStudent({ name: "Omar", score: 80, attendance: 90 }));
console.log("Validation errors:", validateStudent({ name: "", score: 150, attendance: null }));
