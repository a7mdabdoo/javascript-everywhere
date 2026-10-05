// Day 05 — Task 7.2: project/lib/grade-lib.js
// Pure grading functions as ES Module named exports — Zero console.log, Zero mutations.

export const PASS_MARK = 60;

export const isValidScore = (score) =>
  typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;

export function letterGrade(score) {
  if (!isValidScore(score)) return "?";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export const isPassing = ({ score = 0, passMark = PASS_MARK } = {}) =>
  isValidScore(score) && score >= passMark;

export const isAtRisk = ({ score = 0, attendance = 0 } = {}) =>
  !isValidScore(score) || score < PASS_MARK || (attendance ?? 0) < 70;

export function average(numbers = []) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
}

export function minMaxStudent(students = []) {
  if (students.length === 0) return [null, null];
  let low = students[0];
  let high = students[0];
  for (const student of students) {
    if (student.score < low.score) low = student;
    if (student.score > high.score) high = student;
  }
  return [low, high];
}

export function countByGrade(students = []) {
  const counts = {};
  for (const { score } of students) {
    const grade = letterGrade(score);
    counts[grade] = (counts[grade] ?? 0) + 1;
  }
  return counts;
}

export function formatRow({ name = "???", score = 0, attendance = null } = {}) {
  const paddedName = `${name}`.padEnd(12);
  const paddedScore = `${score}`.padStart(3);
  const grade = letterGrade(score);
  const safeAtt = attendance !== null && attendance !== undefined ? `${attendance}%`.padStart(4) : "   —";
  const status = isPassing({ score }) ? "PASS" : "FAIL";
  const riskFlag = isAtRisk({ score, attendance: attendance ?? 0 }) ? "AT-RISK" : "OK";
  return `${paddedName} ${paddedScore}   ${grade}   ${safeAtt}   ${status.padEnd(5)} ${riskFlag}`;
}

export const withBonus = ({ score = 0, ...rest } = {}, bonus = 5) => ({
  ...rest,
  score: Math.min(100, score + bonus)
});

export const withoutField = (student = {}, field) => {
  const { [field]: omitted, ...rest } = student;
  return rest;
};
