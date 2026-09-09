const students = [
  { name: "Youssef", score: 95 },
  { name: "Mariam", score: 85 },
  { name: "Khaled", score: 62 },
  { name: "Nour", score: 91 },
  { name: "Ziad", score: 74 },
];

let excellentCount = 0;
let goodCount = 0;
let needsWorkCount = 0;

for (const student of students) {
  let grade = "";

  if (student.score >= 90) {
    grade = "Excellent";
    excellentCount++;
  } else if (student.score >= 70) {
    grade = "Good";
    goodCount++;
  } else {
    grade = "Needs work";
    needsWorkCount++;
  }

  console.log(`${student.name}: ${student.score} - ${grade}`);
}

console.log("\nSummary:");
console.log(`Excellent: ${excellentCount}`);
console.log(`Good: ${goodCount}`);
console.log(`Needs work: ${needsWorkCount}`);
