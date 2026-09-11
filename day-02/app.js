const scoreInput = document.getElementById("score");
const checkBtn = document.getElementById("check");
const clearBtn = document.getElementById("clear");
const result = document.getElementById("result");
const historyList = document.getElementById("history");

const history = [];

checkBtn.addEventListener("click", () => {
    const value = scoreInput.value.trim();

    if (value === "") {
        result.textContent = "Please enter a number between 0 and 100";
        return;
    }

    const score = Number(value);

    if (Number.isNaN(score) || score < 0 || score > 100) {
        result.textContent = "Please enter a number between 0 and 100";
        return;
    }

    let grade = "";
    if (score >= 90) {
        grade = "A";
    } else if (score >= 80) {
        grade = "B";
    } else if (score >= 70) {
        grade = "C";
    } else if (score >= 60) {
        grade = "D";
    } else {
        grade = "F";
    }

    result.textContent = `Score: ${score} -> Grade: ${grade}`;

    history.push({ score: score, grade: grade });

    historyList.innerHTML = "";
    for (const item of history) {
        const li = document.createElement("li");
        li.textContent = `Score: ${item.score} -> Grade: ${item.grade}`;
        historyList.appendChild(li);
    }

    console.log("History:", history);

    scoreInput.value = "";
});

clearBtn.addEventListener("click", () => {
    history.length = 0;
    historyList.innerHTML = "";
    result.textContent = "";
    scoreInput.value = "";
    console.log("History cleared:", history);
});
