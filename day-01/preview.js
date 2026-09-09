const courseName = "JavaScript Everywhere";
let sessionNumber = 1;
sessionNumber = 2;

console.log(courseName, sessionNumber);

const name = "Ahmed";
const age = 20;
const isLearning = true;
const notSet = null;
let notAssigned;

const student = {
  name: "Ahmed",
  track: "JS/TS Foundations",
  isActive: true,
};

student.favoriteLanguage = "JavaScript";

const tracks = ["Web", "Full-Stack", "Mobile", "Desktop"];

console.log(typeof name);
console.log(typeof age);
console.log(typeof student);
console.log(typeof tracks);

console.log(student.favoriteLanguage);
console.log(tracks[0]);
console.log(tracks.length);

const score = 85;

if (score >= 90) {
  console.log("Excellent");
} else if (score >= 70) {
  console.log("Good");
} else {
  console.log("Keep going");
}

console.log(5 === 5);
console.log(5 === "5");
console.log(5 == "5");

const status = score >= 70 ? "pass" : "fail";
console.log(status);

for (let i = 0; i < tracks.length; i++) {
  console.log(`Track ${i + 1}: ${tracks[i]}`);
}

for (const track of tracks) {
  console.log(track);
}

for (const track of tracks) {
  if (track.length > 6) {
    console.log(track);
  }
}

let countdown = 3;
while (countdown > 0) {
  console.log(countdown);
  countdown--;
}
console.log("Go!");

tracks.forEach((track, index) => {
  console.log(`${index + 1}. ${track}`);
});

const students = [
  { name: "Sara", score: 92 },
  { name: "Omar", score: 68 },
  { name: "Lina", score: 79 },
];

let passed = 0;

for (const student of students) {
  const result = student.score >= 70 ? "PASS" : "FAIL";

  if (result === "PASS") {
    passed++;
  }

  console.log(`${student.name}: ${student.score} — ${result}`);
}

console.log(`\n${passed} of ${students.length} students passed.`);
