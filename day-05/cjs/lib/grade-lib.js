// Day 05 — Task 6.1 & 6.2: CommonJS grade-lib.js
console.log("[CJS Cache Test] Evaluating grade-lib.js (This line MUST print only ONCE)");

// Private helper (NOT exported)
function _privateSanitize(num) {
  return typeof num === "number" && !Number.isNaN(num) ? num : 0;
}

function letterGrade(score) {
  const s = _privateSanitize(score);
  if (s >= 90) return "A";
  if (s >= 80) return "B";
  if (s >= 70) return "C";
  if (s >= 60) return "D";
  return "F";
}

function average(numbers = []) {
  if (numbers.length === 0) return 0;
  const total = numbers.reduce((sum, n) => sum + _privateSanitize(n), 0);
  return total / numbers.length;
}

function formatRow({ name = "Unknown", score = 0, attendance = 0 } = {}) {
  const paddedName = `${name}`.padEnd(12);
  const paddedScore = `${score}`.padStart(3);
  const grade = letterGrade(score);
  const att = `${attendance}%`.padStart(4);
  const status = score >= 60 ? "PASS" : "FAIL";
  return `${paddedName} ${paddedScore}   ${grade}   ${att}   ${status}`;
}

module.exports = {
  letterGrade,
  average,
  formatRow
  // Notice: _privateSanitize is intentionally NOT exported!
};
