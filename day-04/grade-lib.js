// Day 04 — Task 7.1: grade-lib.js (Pure Functions Only — Zero console.log, Zero '+' string concatenation)

const isValidScore = (score) =>
  typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;

function letterGrade(score) {
  if (!isValidScore(score)) return "?";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const isPassing = ({ score = 0, passMark = 60 } = {}) =>
  isValidScore(score) && score >= passMark;

const isAtRisk = ({ score = 0, attendance = 0 } = {}) =>
  !isValidScore(score) || score < 60 || (attendance ?? 0) < 70;

function average(numbers = []) {
  if (numbers.length === 0) return 0;
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum / numbers.length;
}

function minMaxStudent(students = []) {
  if (students.length === 0) return [null, null];
  let low = students[0];
  let high = students[0];
  for (const student of students) {
    if (student.score < low.score) low = student;
    if (student.score > high.score) high = student;
  }
  return [low, high];
}

function countByGrade(students = []) {
  const counts = {};
  for (const { score } of students) {
    const grade = letterGrade(score);
    counts[grade] = (counts[grade] ?? 0) + 1;
  }
  return counts;
}

function formatRow({ name = "???", score = 0, attendance = 0 } = {}) {
  const paddedName = `${name}`.padEnd(10);
  const paddedScore = `${score}`.padStart(3);
  const grade = letterGrade(score);
  const safeAtt = `${attendance ?? 0}%`.padStart(4);
  const status = isPassing({ score }) ? "PASS" : "FAIL";
  const riskFlag = isAtRisk({ score, attendance: attendance ?? 0 }) ? "AT-RISK" : "OK";
  return `${paddedName} ${paddedScore}   ${grade}   ${safeAtt}   ${status.padEnd(5)} ${riskFlag}`;
}

const withBonus = ({ score = 0, ...rest } = {}, bonus = 5) => ({
  ...rest,
  score: Math.min(100, score + bonus)
});

const withoutField = (student = {}, field) => {
  const { [field]: omitted, ...rest } = student;
  return rest;
};

if (typeof module !== "undefined") {
  module.exports = {
    isValidScore,
    letterGrade,
    isPassing,
    isAtRisk,
    average,
    minMaxStudent,
    countByGrade,
    formatRow,
    withBonus,
    withoutField
  };
}
