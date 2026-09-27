// Day 04 — Task 8: app.js
// Section 1: Pure Logic | Section 2: DOM Handling

// ==========================================
// 1. PURE LOGIC (No DOM)
// ==========================================

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

function describe({ name = "Unknown", score = 0, city = "Unknown" } = {}) {
  const grade = letterGrade(score);
  const status = score >= 60 ? "PASS" : "FAIL";
  return `${name} (${city}) - Score: ${score} [${grade}] (${status})`;
}

function getAverage(list = []) {
  if (list.length === 0) return 0;
  let sum = 0;
  for (const { score } of list) {
    sum += score;
  }
  return sum / list.length;
}

// Synchronous busy-wait loop to demonstrate blocking the main thread
function blockFor(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // busy wait
  }
}

function debounce(fn, ms = 250) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), ms);
  };
}

// ==========================================
// 2. DOM HANDLING & ASYNC SIMULATION
// ==========================================

let students = [
  { id: 1, name: "Ahmed", score: 92, city: "Qena" },
  { id: 2, name: "Mohamed", score: 95, city: "Cairo" },
  { id: 3, name: "Abdo", score: 68 }
];

let prevStudents = null;
let searchText = "";

const nameInput = document.getElementById("nameInput");
const scoreInput = document.getElementById("scoreInput");
const cityInput = document.getElementById("cityInput");
const addBtn = document.getElementById("addBtn");
const undoBtn = document.getElementById("undoBtn");
const clearBtn = document.getElementById("clearBtn");
const loadServerBtn = document.getElementById("loadServerBtn");
const forceErrorBtn = document.getElementById("forceErrorBtn");
const freezeBtn = document.getElementById("freezeBtn");
const chunkedBtn = document.getElementById("chunkedBtn");
const searchInput = document.getElementById("searchInput");
const messageEl = document.getElementById("message");
const serverStatusEl = document.getElementById("server-status");
const summaryEl = document.getElementById("summary");
const listEl = document.getElementById("studentList");

function saveUndoState() {
  prevStudents = [...students];
  undoBtn.disabled = false;
}

function render() {
  listEl.innerHTML = "";

  const filtered = students.filter(({ name, city = "Unknown" }) => {
    const q = searchText.toLowerCase();
    return name.toLowerCase().includes(q) || city.toLowerCase().includes(q);
  });

  for (const student of filtered) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = describe(student);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Remove";
    delBtn.addEventListener("click", () => handleRemove(student.id));

    li.appendChild(span);
    li.appendChild(delBtn);
    listEl.appendChild(li);
  }

  const avg = getAverage(students).toFixed(1);
  summaryEl.textContent = `Count: ${students.length} | Average: ${avg}`;
}

function handleAdd() {
  const nameVal = nameInput.value.trim();
  const scoreVal = scoreInput.value.trim();
  const cityVal = cityInput.value.trim();

  if (!nameVal) {
    messageEl.className = "error";
    messageEl.textContent = "Please enter a student name.";
    return;
  }
  if (scoreVal === "") {
    messageEl.className = "error";
    messageEl.textContent = "Please enter a score.";
    return;
  }

  const numScore = Number(scoreVal);
  if (!isValidScore(numScore)) {
    messageEl.className = "error";
    messageEl.textContent = "Score must be a number between 0 and 100.";
    return;
  }

  // Optional city adds no key at all when left blank
  const newStudent = {
    id: Date.now(),
    name: nameVal,
    score: numScore,
    ...(cityVal ? { city: cityVal } : {})
  };

  saveUndoState();
  // Replace array using spread (no .push)
  students = [...students, newStudent];

  nameInput.value = "";
  scoreInput.value = "";
  cityInput.value = "";
  messageEl.className = "ok";
  messageEl.textContent = `Added ${newStudent.name}`;
  render();
}

function handleRemove(id) {
  saveUndoState();
  students = students.filter((s) => s.id !== id);
  render();
}

function handleUndo() {
  if (!prevStudents) return;
  students = [...prevStudents];
  prevStudents = null;
  undoBtn.disabled = true;
  messageEl.className = "";
  messageEl.textContent = "Undid last change.";
  render();
}

function handleClear() {
  saveUndoState();
  students = [];
  messageEl.className = "";
  messageEl.textContent = "Cleared list.";
  render();
}

// Fake server call with 1.2s delay and 1-in-4 failure rate (or forced error)
function fetchStudents(callback, forceFail = false) {
  setTimeout(() => {
    const failed = forceFail || Math.random() < 0.25;
    if (failed) {
      return callback(new Error("Server error: failed to load students. Try again."));
    }

    const loaded = [
      { id: Date.now() + 1, name: "Saeed", score: 91, city: "Alexandria" },
      { id: Date.now() + 2, name: "Ayman", score: 84, city: "Giza" },
      { id: Date.now() + 3, name: "Abdelkarim", score: 76 }
    ];
    callback(null, loaded);
  }, 1200);
}

function handleLoadFromServer(forceFail = false) {
  loadServerBtn.disabled = true;
  forceErrorBtn.disabled = true;
  serverStatusEl.className = "";
  serverStatusEl.textContent = "Loading...";

  fetchStudents((err, loadedStudents) => {
    loadServerBtn.disabled = false;
    forceErrorBtn.disabled = false;

    if (err) {
      serverStatusEl.className = "error";
      serverStatusEl.textContent = err.message;
      console.log("Server load failed:", err.message);
      return;
    }

    saveUndoState();
    // Merge with spread
    students = [...students, ...loadedStudents];
    serverStatusEl.className = "ok";
    serverStatusEl.textContent = `Loaded ${loadedStudents.length} students from server.`;
    console.log("Loaded students from server:", loadedStudents);
    render();
  }, forceFail);

  console.log("Request sent to server — page continues running without freezing!");
}

function handleFreeze() {
  serverStatusEl.className = "error";
  serverStatusEl.textContent = "Freezing for 3 seconds... try typing in the input box!";
  setTimeout(() => {
    blockFor(3000);
    serverStatusEl.className = "ok";
    serverStatusEl.textContent = "Finished 3s blocking freeze.";
  }, 20);
}

function handleChunked() {
  let step = 0;
  const totalSteps = 30;
  chunkedBtn.disabled = true;

  function nextStep() {
    step++;
    blockFor(20);
    const percent = Math.round((step / totalSteps) * 100);
    serverStatusEl.className = "";
    serverStatusEl.textContent = `Chunked progress: ${percent}% (you can still type!)`;

    if (step < totalSteps) {
      setTimeout(nextStep, 80);
    } else {
      chunkedBtn.disabled = false;
      serverStatusEl.className = "ok";
      serverStatusEl.textContent = "Finished 3s chunked work without freezing!";
    }
  }

  nextStep();
}

// Wire named handlers with addEventListener
addBtn.addEventListener("click", handleAdd);
undoBtn.addEventListener("click", handleUndo);
clearBtn.addEventListener("click", handleClear);
loadServerBtn.addEventListener("click", () => handleLoadFromServer(false));
forceErrorBtn.addEventListener("click", () => handleLoadFromServer(true));
freezeBtn.addEventListener("click", handleFreeze);
chunkedBtn.addEventListener("click", handleChunked);
searchInput.addEventListener(
  "input",
  debounce((e) => {
    searchText = e.target.value;
    render();
  }, 250)
);

render();
