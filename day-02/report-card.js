/* Task 5 — Build: Student Report Card
 - Array of at least 8 student objects, each with name, score, attendance
 - const everywhere it belongs, let only for changing values
 - === and !== throughout (no == anywhere)
 - for...of loop
 - Five-band grade logic (A, B, C, D, F)
 - "At risk" status if score < 60 || attendance < 70
 - Skip invalid records with continue (includes 1 broken record on purpose)
 - Aligned formatted table with template literals and padEnd
 - Summary block with counts, average, highest/lowest by name, at risk, skipped
 */

// 5.1 Student Data (including one intentionally broken record)
const students = [
    { name: "Ahmed", score: 95, attendance: 90 },
    { name: "Sara", score: 88, attendance: 95 },
    { name: "Omar", score: 72, attendance: 80 },
    { name: "Mona", score: 64, attendance: 85 },
    { name: "Ali", score: 45, attendance: 60 },
    { name: "Youssef", score: "invalid", attendance: 50 },
    { name: "Nour", score: 91, attendance: 65 },
    { name: "Hassan", score: 58, attendance: 75 },
    { name: "Mariam", score: 82, attendance: 92 }
];

// Tracking variables for summary
let countA = 0;
let countB = 0;
let countC = 0;
let countD = 0;
let countF = 0;
let atRiskCount = 0;
let skippedCount = 0;
let totalScore = 0;
let validCount = 0;

let highestStudent = null;
let lowestStudent = null;

// 5.3 Header Row
console.log(`${"Name".padEnd(12)} | ${"Score".padEnd(8)} | ${"Attendance".padEnd(12)} | ${"Grade".padEnd(8)} | ${"Status".padEnd(10)}`);
console.log("-".repeat(60));

// 5.1 & 5.2 Process each student with for...of
for (const student of students) {
    // Skip invalid scores
    if (typeof student.score !== "number" || Number.isNaN(student.score) || student.score < 0 || student.score > 100) {
        skippedCount++;
        continue;
    }

    validCount++;
    totalScore += student.score;

    // Track highest and lowest scoring student without Math.max/min
    if (highestStudent === null || student.score > highestStudent.score) {
        highestStudent = student;
    }
    if (lowestStudent === null || student.score < lowestStudent.score) {
        lowestStudent = student;
    }

    // Five-band grade
    let grade = "";
    if (student.score >= 90) {
        grade = "A";
        countA++;
    } else if (student.score >= 80) {
        grade = "B";
        countB++;
    } else if (student.score >= 70) {
        grade = "C";
        countC++;
    } else if (student.score >= 60) {
        grade = "D";
        countD++;
    } else {
        grade = "F";
        countF++;
    }

    // Risk status
    let status = "Good";
    if (student.score < 60 || student.attendance < 70) {
        status = "At risk";
        atRiskCount++;
    }

    // Print aligned row
    console.log(`${student.name.padEnd(12)} | ${String(student.score).padEnd(8)} | ${`${student.attendance}%`.padEnd(12)} | ${grade.padEnd(8)} | ${status.padEnd(10)}`);
}

// 5.2 Summary Block
const classAverage = (totalScore / validCount).toFixed(1);

console.log(`\n${"=".repeat(60)}`);
console.log("CLASS SUMMARY");
console.log("=".repeat(60));
console.log(`Grade A: ${countA}`);
console.log(`Grade B: ${countB}`);
console.log(`Grade C: ${countC}`);
console.log(`Grade D: ${countD}`);
console.log(`Grade F: ${countF}`);
console.log(`Class Average: ${classAverage}`);
console.log(`Highest Scoring Student: ${highestStudent.name} (${highestStudent.score})`);
console.log(`Lowest Scoring Student: ${lowestStudent.name} (${lowestStudent.score})`);
console.log(`Students At Risk: ${atRiskCount}`);
console.log(`Skipped Records: ${skippedCount}`);
