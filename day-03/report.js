/* task 5.2
 report.js — The Program
 Array of at least 10 student objects with name, score, attendance
 Include two deliberately broken records — one with a string score, one with null
 Print a header row and separator
 Loop with for...of, skipping invalid records with continue and counting them
 Print one line per valid student via formatRow
 Print a summary: counts per band, class average to one decimal, highest and lowest by name, at-risk count, skipped count
 Every function called here must be defined in grade-lib.js — report.js holds no grading logic
 */

const {
    isValidScore,
    letterGrade,
    isPassing,
    isAtRisk,
    average,
    highest,
    lowest,
    countByGrade,
    formatRow
} = require("./grade-lib");

// Array of student objects (including 2 broken records)
const students = [
    { name: "Ahmed", score: 95, attendance: 92 },
    { name: "Sara", score: 88, attendance: 95 },
    { name: "Omar", score: 72, attendance: 80 },
    { name: "Mona", score: 64, attendance: 85 },
    { name: "Ali", score: 45, attendance: 60 },
    { name: "Youssef", score: "not-a-number", attendance: 50 }, // broken record 1
    { name: "Nour", score: 91, attendance: 65 },
    { name: "Hassan", score: 58, attendance: 75 },
    { name: "Mariam", score: 82, attendance: 92 },
    { name: "Karim", score: null, attendance: 40 },             // broken record 2
    { name: "Ziad", score: 77, attendance: 88 }
];

// Header row and separator
console.log(`${"Name".padEnd(12)} | ${"Score".padEnd(8)} | ${"Attendance".padEnd(12)} | ${"Grade".padEnd(8)} | ${"Status".padEnd(10)}`);
console.log("-".repeat(60));

const validStudents = [];
const validScores = [];
let skippedCount = 0;
let atRiskCount = 0;

// Loop over students with for...of
for (const student of students) {
    if (!isValidScore(student.score)) {
        skippedCount++;
        continue;
    }

    validStudents.push(student);
    validScores.push(student.score);

    if (isAtRisk(student)) {
        atRiskCount++;
    }

    console.log(formatRow(student));
}

// Summary using grade-lib functions
const counts = countByGrade(validStudents);
const avg = average(validScores).toFixed(1);
const best = highest(validStudents);
const worst = lowest(validStudents);

console.log(`\n${"=".repeat(60)}`);
console.log("CLASS SUMMARY");
console.log("=".repeat(60));
console.log(`Grade A: ${counts.A}`);
console.log(`Grade B: ${counts.B}`);
console.log(`Grade C: ${counts.C}`);
console.log(`Grade D: ${counts.D}`);
console.log(`Grade F: ${counts.F}`);
console.log(`Class Average: ${avg}`);
console.log(`Highest Scoring Student: ${best.name} (${best.score})`);
console.log(`Lowest Scoring Student: ${worst.name} (${worst.score})`);
console.log(`Students At Risk: ${atRiskCount}`);
console.log(`Skipped Records: ${skippedCount}`);
