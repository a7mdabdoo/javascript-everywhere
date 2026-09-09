const message = document.getElementById("message");
const changeBtn = document.getElementById("change-btn");
const logBtn = document.getElementById("log-btn");

let clickCount = 0;

changeBtn.addEventListener("click", () => {
  clickCount++;
  message.textContent = `Text updated! Click count: ${clickCount}`;
});

logBtn.addEventListener("click", () => {
  console.log("Button clicked from the browser at:", new Date().toLocaleTimeString());
});
