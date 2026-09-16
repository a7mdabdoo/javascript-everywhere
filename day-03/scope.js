/* task 3.1
 Declare a global variable, a function-scoped one, and a block-scoped one
 Print all three from the innermost scope — all three must work
 Try to print the innermost one from the outside, screenshot the error, then comment the line out
 */
const globalVal = "I am global";

function testScope() {
    const funcVal = "I am function";

    if (true) {
        const blockVal = "I am block";
        console.log("Innermost:", globalVal, "|", funcVal, "|", blockVal);
    }

    // console.log(blockVal); // ReferenceError: blockVal is not defined
}
testScope();


/* task 3.2
 Inside an if block, declare one let and one var
 Print both from outside the block
 Comment one sentence on which escaped and why that's a problem
 */
if (true) {
    let letVal = "trapped inside let";
    var varVal = "escaped with var";
}

console.log("Outside block var:", varVal);
// console.log(letVal); // ReferenceError: letVal is not defined

// var escaped the block because var is not block-scoped, which can cause bugs and overwrite variables by accident


/* task 3.3
 Create a global status, then a function with its own local status
 Print from inside and from outside, proving the global is untouched
 Add a comment stating which one "wins" inside the function and why
 */
const status = "global status";

function checkStatus() {
    const status = "local status";
    console.log("Inside function:", status);
}

checkStatus();
console.log("Outside function:", status);

// Inside the function, the local status wins because JavaScript looks in the current scope first


/* task 3.4
 Call a function declaration before it's defined — it works
 Print a var before its line — record the value (not an error)
 Print a let before its line — screenshot the error, then comment it out
 Call an arrow function before its line — screenshot the error, then comment it out
 In comments, state which of the four are safe and which are bugs waiting to happen
 */

// 1. Function declaration
console.log(sayHello()); // works
function sayHello() {
    return "Hello from declared function";
}

// 2. var
console.log("var before definition:", myVar); // undefined
var myVar = 42;

// 3. let
// console.log(myLet); // ReferenceError (TDZ)
let myLet = 100;

// 4. Arrow function
// myArrow(); // ReferenceError (TDZ)
const myArrow = () => console.log("arrow called");

// Function declarations are safe to call early because they hoist completely.
// var hoists as undefined which causes silent bugs.
// let and arrow functions throw errors before initialization (TDZ) which helps catch bugs early.


/* task 3.5
 Write a for loop with var i that pushes () => i into an array three times, then calls all three
 Do the same with let i
 Print both sets of results and explain the difference in one comment
 */

// With var
const funcs1 = [];
for (var i = 0; i < 3; i++) {
    funcs1.push(() => i);
}
console.log("var loop:", funcs1[0](), funcs1[1](), funcs1[2]());

// With let
const funcs2 = [];
for (let j = 0; j < 3; j++) {
    funcs2.push(() => j);
}
console.log("let loop:", funcs2[0](), funcs2[1](), funcs2[2]());

// var shares one variable for all iterations so they all see the final value (3).
// let creates a new variable in each iteration so each function remembers its own number (0, 1, 2).
