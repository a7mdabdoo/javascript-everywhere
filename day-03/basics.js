/* task 2.1
 Write celsiusToF as a function declaration
 Write the identical logic as a function expression
 Write it a third time as an arrow function with implicit return
 Call all three with 25 and prove they print the same thing
 */

// 1. Function Declaration
function celsiusToF1(c) {
    return (c * 9 / 5) + 32;
}

// 2. Function Expression
const celsiusToF2 = function (c) {
    return (c * 9 / 5) + 32;
};

// 3. Arrow Function
const celsiusToF3 = (c) => (c * 9 / 5) + 32;

console.log("celsiusToF1(25):", celsiusToF1(25));
console.log("celsiusToF2(25):", celsiusToF2(25));
console.log("celsiusToF3(25):", celsiusToF3(25));


/* task 2.2
 Write addLog(a, b) that only console.logs the sum
 Write addReturn(a, b) that returns it
 Try to use each in const doubled = ... * 2 and print the result
 Comment one sentence explaining why one gives NaN
 */
function addLog(a, b) {
    console.log("sum:", a + b);
}

function addReturn(a, b) {
    return a + b;
}

const doubled1 = addLog(3, 4) * 2;
console.log("doubled1:", doubled1); // NaN

const doubled2 = addReturn(3, 4) * 2;
console.log("doubled2:", doubled2); // 14

// addLog gives NaN because it does not return anything (returns undefined), and undefined * 2 is NaN


/* task 2.3
 Write greet(name = "guest", greeting = "Hello") returning a template literal
 Call it four ways: no arguments, one argument, both, and with undefined as the first argument
 Call it with null as the name — comment what happened and why the default did not fire
 */
function greet(name = "guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
}

console.log(greet());
console.log(greet("Ahmed"));
console.log(greet("Sara", "Hi"));
console.log(greet(undefined, "Welcome"));

console.log(greet(null, "Good morning"));
// null is treated as an actual value, default params only kick in when the argument is undefined


/* task 2.4
 Write sumAll(...numbers) returning the total of any count of arguments
 Test with 0, 1, and 5 arguments
 Write describe(label, ...values) returning "label: v1, v2, v3"
 */
function sumAll(...numbers) {
    let sum = 0;
    for (const num of numbers) {
        sum += num;
    }
    return sum;
}

console.log("sumAll():", sumAll());
console.log("sumAll(5):", sumAll(5));
console.log("sumAll(1, 2, 3, 4, 5):", sumAll(1, 2, 3, 4, 5));

function describe(label, ...values) {
    return `${label}: ${values.join(", ")}`;
}

console.log(describe("Scores", 85, 90, 78));


/* task 2.5
 Write safeDivide(a, b) that returns "Cannot divide by zero" when b is 0, "Not a number" when either argument isn't a number, and the result otherwise
 All three checks must be guard clauses at the top — no else anywhere in the function
 Test all three paths
 */
function safeDivide(a, b) {
    if (typeof a !== "number" || typeof b !== "number" || isNaN(a) || isNaN(b)) {
        return "Not a number";
    }
    if (b === 0) {
        return "Cannot divide by zero";
    }
    return a / b;
}

console.log("safeDivide(10, 2):", safeDivide(10, 2));
console.log("safeDivide(10, 0):", safeDivide(10, 0));
console.log("safeDivide(10, 'hello'):", safeDivide(10, "hello"));
