/* task 4.1
 Print the numbers 1 to 20, but for every multiple of 3 print "Fizz" instead
 */
for (let i = 1; i <= 20; i++) {
    if (i % 3 === 0) {
        console.log("Fizz");
    } else {
        console.log(i);
    }
}


/* task 4.2
 Given an array of at least 6 track names, print each with its position (1., 2., …)
 */
const tracks = [
    "Web Foundations",
    "Full-Stack Web",
    "Mobile",
    "Desktop",
    "Chrome Extensions",
    "AI Applications"
];

let position = 1;
for (const track of tracks) {
    console.log(`${position}. ${track}`);
    position++;
}


/* task 4.3
 Given an object with at least 5 keys, print every key: value pair
 */
const student = {
    name: "Ahmed",
    track: "Web Foundations",
    city: "Qena",
    level: 2,
    isEnrolled: true
};

for (const key in student) {
    console.log(`${key}: ${student[key]}`);
}


/* task 4.4
 Start at 100 and keep halving until the value drops below 1, printing each step
 */
let value = 100;
while (value >= 1) {
    console.log(value);
    value /= 2;
}


/* task 4.5
 Write a loop whose condition is false from the start, and prove it still runs once
 */
let count = 10;
do {
    console.log("do...while runs at least once. count:", count);
} while (count < 5);


/* task 4.6
 Loop an array of scores. continue past any score below 50. break out entirely on the first score above 95. Print everything else.
 Add a comment stating exactly which scores printed and why
 */
const scores = [70, 45, 82, 30, 90, 98, 60];

for (const score of scores) {
    if (score < 50) {
        continue;
    }
    if (score > 95) {
        break;
    }
    console.log("Score:", score);
}

// Printed scores: 70, 82, 90.
// 45 and 30 were skipped because continue was triggered when score < 50.
// When 98 was reached, break terminated the loop immediately, so 60 was never reached.


/* task 4.7
 Given an array of at least 8 numbers, find the sum, the average, the highest, and the lowest
 Do it with loops only — no Math.max, Math.min, or .reduce()
 Print all four results
 */
const numbers = [12, 45, 7, 89, 23, 56, 3, 68];

let sum = 0;
let highest = numbers[0];
let lowest = numbers[0];

for (const num of numbers) {
    sum += num;

    if (num > highest) {
        highest = num;
    }
    if (num < lowest) {
        lowest = num;
    }
}

const average = sum / numbers.length;

console.log("Sum:", sum);
console.log("Average:", average);
console.log("Highest:", highest);
console.log("Lowest:", lowest);
