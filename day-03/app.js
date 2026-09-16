/* task 6
 The Browser Side — Grade Calculator
 Inputs for student name and score, plus Add and Clear buttons
 Pure logic at top (isValidScore, letterGrade, average)
 DOM handling below with handleAdd and render
 */

// 1. Pure Logic
function isValidScore(score) {
    if (typeof score !== "number" || isNaN(score)) return false;
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

function average(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) return 0;
    let total = 0;
    for (const num of numbers) {
        total += num;
    }
    return total / numbers.length;
}


// 2. DOM Elements
const nameInput = document.getElementById("name");
const scoreInput = document.getElementById("score");
const addBtn = document.getElementById("add");
const clearBtn = document.getElementById("clear");
const messageEl = document.getElementById("message");
const listEl = document.getElementById("list");
const summaryEl = document.getElementById("summary");

const students = [];

function handleAdd() {
    messageEl.textContent = "";

    const name = nameInput.value.trim();
    const scoreVal = scoreInput.value.trim();

    if (name === "") {
        messageEl.textContent = "Please enter student name.";
        return;
    }

    if (scoreVal === "") {
        messageEl.textContent = "Please enter a score.";
        return;
    }

    const score = Number(scoreVal);

    if (!isValidScore(score)) {
        messageEl.textContent = "Score must be a number between 0 and 100.";
        return;
    }

    // Add student to array
    students.push({
        name: name,
        score: score,
        grade: letterGrade(score)
    });

    console.log("Students array:", students);

    render();

    // Reset inputs
    nameInput.value = "";
    scoreInput.value = "";
    nameInput.focus();
}

function render() {
    listEl.innerHTML = "";

    for (let i = 0; i < students.length; i++) {
        const s = students[i];
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";

        const textSpan = document.createElement("span");
        textSpan.textContent = `${s.name} — ${s.score} (${s.grade})`;

        // Remove button using closure remembering its index i
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.style.padding = "3px 8px";
        removeBtn.style.fontSize = "12px";
        removeBtn.style.backgroundColor = "#e74c3c";
        removeBtn.style.color = "white";
        removeBtn.style.border = "none";
        removeBtn.style.borderRadius = "3px";
        removeBtn.style.cursor = "pointer";

        removeBtn.addEventListener("click", () => {
            students.splice(i, 1);
            render();
            console.log("Students array:", students);
        });

        li.appendChild(textSpan);
        li.appendChild(removeBtn);
        listEl.appendChild(li);
    }

    if (students.length === 0) {
        summaryEl.textContent = "No students added yet.";
    } else {
        const scores = students.map((s) => s.score);
        const avg = average(scores).toFixed(1);
        summaryEl.textContent = `Total Students: ${students.length} | Class Average: ${avg}`;
    }
}

function handleClear() {
    students.length = 0;
    messageEl.textContent = "";
    nameInput.value = "";
    scoreInput.value = "";
    render();
    console.log("Students array cleared:", students);
}

// Events
addBtn.addEventListener("click", handleAdd);
clearBtn.addEventListener("click", handleClear);

render();
