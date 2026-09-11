/*      TASK 2.1
Declare one variable of each primitive type: string, number, boolean, null, undefined
 Declare one object and one array
 Print each with its typeof, formatted like: name → "Sara" → string*/

const myName = "Ahmed";   // string
let age = 18;             // number
let isStudent = true;     // boolean
let emptyValue = null;    // null
let notDefined;           // undefined

const person = {          // object
    name:"Ahmed",
    age: 18,            
    city: "Qena"
}                          

const languages = ["JavaScript", "Python", "C++" ,"Dart", ];   // array

// Print each variable with its type
console.log("myName ->", myName, "->", typeof myName);
console.log(`age  -> ${age} -> ${typeof age}`);
console.log("isStudent ->"+ isStudent + " -> " + typeof isStudent);
console.log("emptyValue ->", emptyValue, "->", typeof emptyValue);
console.log("notDefined ->", notDefined, "->", typeof notDefined);
console.log("person ->", person, "->", typeof person);
console.log("languages ->", languages, "->", typeof languages); 



/*      TASK 2.2
 Print typeof null and typeof []
 Add a comment above each explaining why the answer is misleading
 Show the correct way to detect an array
 */

 console.log("typeof null:", typeof null); 
// null is a primitive, but typeof returns "object" due to a 1995 legacy bug
 console.log("typeof []:", typeof []);
// Arrays are specialized objects, so typeof returns "object" instead of "array"



// The correct way to check for an array
console.log("Array.isArray([]):", Array.isArray([])); // true
console.log("Array.isArray({}):", Array.isArray({})); // false




/*      TASK 2.3
 Convert the string "42" to a number and prove it with typeof
 Convert the number 42 to a string and prove it
 Show what Number("hello") gives, and print typeof that result — it will surprise you
 Show the difference between parseInt("42px") and Number("42px")      
 */
let str1 = "42";
let number = Number(str1);
console.log("Converted string to number:", number, "->", typeof number);

let num = 42;
let str = String(num);
console.log("Converted number to string:", str, "->", typeof str);

let invalidNumber = Number("hello");
console.log("Number('hello'):", invalidNumber, "->", typeof invalidNumber); // NaN is of type number


let parsedInt = parseInt("42px");
let convertedNumber = Number("42px");
console.log("Number('42px'):", convertedNumber, "->", typeof convertedNumber);


/*      TASK 2.4
 Falsy Roll Call
- Loop over an array holding all 8 falsy values plus [], {}, "0", and "hello"
- For each, print the value and whether it is truthy or falsy
*/
const falsyTestArray = [false, 0, -0, 0n, "", null, undefined, NaN, [], {}, "0", "hello"];

for (const val of falsyTestArray) {
  const result = Boolean(val) ? "truthy" : "falsy";
  console.log(val, "->", result);
}

/*      TASK 2.5
 || vs ??
- Create a variable set to 0
- Print the result of || with a fallback, and ?? with the same fallback
- In a comment, state in one sentence which one you want when 0 is a valid value
*/
const userScore = 0;
console.log("userScore || 100:", userScore || 100); // 100
console.log("userScore ?? 100:", userScore ?? 100); // 0


// We use ?? when 0 is a valid value, because || treats 0 as falsy and incorrectly falls back.


