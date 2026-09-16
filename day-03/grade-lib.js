/* task 5.1
 grade-lib.js — Pure Functions Only
 No console.log anywhere in this file. Every function takes input and returns output.
 isValidScore(score) -> true / false, rejecting non-numbers, NaN, and anything outside 0–100
 letterGrade(score) -> "A"–"F" using five bands
 isPassing(score, passMark = 60) -> boolean, with a working default
 isAtRisk(student) -> true when score < 60 or attendance < 70
 average(numbers) -> the mean, returning 0 for empty array
 highest(students) / lowest(students) -> student object, found with loop, no Math.max
 countByGrade(students) -> object { A: 2, B: 1, ... }
 formatRow(student) -> one aligned string using padEnd
 */

function isValidScore(score) {
    if (typeof score !== "number" || Number.isNaN(score)) return false;
    return score >= 0 && score <= 100;
}

function letterGrade(score) {
    if (!isValidScore(score)) return "?";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

function isPassing(score, passMark = 60) {
    if (!isValidScore(score)) return false;
    return score >= passMark;
}

function isAtRisk(student) {
    if (!isValidScore(student.score)) return true;
    return student.score < 60 || student.attendance < 70;
}

function average(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) return 0;
    let total = 0;
    for (const n of numbers) {
        total += n;
    }
    return total / numbers.length;
}

function highest(students) {
    if (!Array.isArray(students) || students.length === 0) return null;
    let best = students[0];
    for (const student of students) {
        if (student.score > best.score) {
            best = student;
        }
    }
    return best;
}

function lowest(students) {
    if (!Array.isArray(students) || students.length === 0) return null;
    let worst = students[0];
    for (const student of students) {
        if (student.score < worst.score) {
            worst = student;
        }
    }
    return worst;
}

function countByGrade(students) {
    const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const student of students) {
        const grade = letterGrade(student.score);
        if (counts[grade] !== undefined) {
            counts[grade]++;
        }
    }
    return counts;
}

function formatRow(student) {
    const name = student.name.padEnd(12);
    const score = String(student.score).padEnd(8);
    const attendance = `${student.attendance}%`.padEnd(12);
    const grade = letterGrade(student.score).padEnd(8);
    const status = isAtRisk(student) ? "At risk" : "Good";
    return `${name} | ${score} | ${attendance} | ${grade} | ${status.padEnd(10)}`;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        isValidScore,
        letterGrade,
        isPassing,
        isAtRisk,
        average,
        highest,
        lowest,
        countByGrade,
        formatRow
    };
}
