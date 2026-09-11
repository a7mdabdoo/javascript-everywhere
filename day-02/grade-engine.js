/* task 3.1
 Write an if / else if / else chain that turns a score into a letter:
90–100 → A
80–89 → B
70–79 → C
60–69 → D
below 60 → F
 Test it with 95, 85, 75, 65, 45 — all five must print correctly
 Guard against invalid input: a score above 100 or below 0 prints Invalid score instead
 */

const testScores = [95, 85, 75, 65, 45];

for (const score of testScores) {
    if (score > 100 || score < 0) {
        console.log(`${score}: Invalid score`);
    } else if (score >= 90) {
        console.log(`${score}: A`);
    } else if (score >= 80) {
        console.log(`${score}: B`);
    } else if (score >= 70) {
        console.log(`${score}: C`);
    } else if (score >= 60) {
        console.log(`${score}: D`);
    } else {
        console.log(`${score}: F`);
    }
}


/* task 3.2
Write a single-level ternary that returns "pass" or "fail" at a pass mark of 60
 In a comment, explain why you would not write the five-band version as a nested ternary
 */
const score2 = 85;
const result = score2 >= 60 ? "pass" : "fail";
console.log(result);

// We avoid writing the 5-band version as a nested ternary because it hurts readability and is difficult to debug and maintain.


/* task 3.3
 Write a switch that takes a letter grade ("A" … "F") and prints a message for each
 Include a default case
 Then deliberately delete one break, run it, screenshot the wrong output, and put it back
 */
const letterGrade = "B";

switch (letterGrade) {
    case "A":
        console.log("Excellent!");
        break;
    case "B":
        console.log("Good job!");
        break;
    case "C":
        console.log("Not bad!");
        break;
    case "D":
        console.log("You can do better!");
        break;
    case "F":
        console.log("You need to study more!");
        break;
    default:
        console.log("Invalid grade");
}



/* task 3.4
 Write a check that prints "Certificate awarded" only when the score is >= 70 and attendance is >= 80%
 Write a check that prints "Review needed" when the score is < 60 or attendance is < 50%
 Test each with at least two different sets of values
✅ Deliverable: grade-engine.js + screenshot (include the fall-through screenshot in your notes).
*/
// Test Set 1
let score3 = 75;
let attendance = 85;

if (score3 >= 70 && attendance >= 80) {
    console.log("Certificate awarded");
}
if (score3 < 60 || attendance < 50) {
    console.log("Review needed");
}

// Test Set 2
score3 = 55;
attendance = 40;

if (score3 >= 70 && attendance >= 80) {
    console.log("Certificate awarded");
}
if (score3 < 60 || attendance < 50) {
    console.log("Review needed");
}