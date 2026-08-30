var list = [];
var idNum = 0;


var inp = document.getElementById("taskInput");
var btn = document.getElementById("addBtn");
var darkBtn = document.getElementById("darkModeBtn");
var box1 = document.getElementById("col-todo");
var box2 = document.getElementById("col-inprogress");
var box3 = document.getElementById("col-done");
var num1 = document.getElementById("count-todo");
var num2 = document.getElementById("count-inprogress");
var num3 = document.getElementById("count-done");

darkBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        darkBtn.textContent = "Light Mode";
    } else {
        darkBtn.textContent = "Dark Mode";
    }
});

function show() {
    var html1 = "", html2 = "", html3 = "";
    var c1 = 0, c2 = 0, c3 = 0;

    for (var i = 0; i < list.length; i++) {
        var item = list[i];

        var card = '<div class="task-card" data-id="' + item.id + '">';
        
        card += '<button class="del-btn">❌</button> '; 
        card += '<span class="task-text">' + item.text + '</span>';
        
        card += '<div class="arrows">';

        if (item.status == "inprogress" || item.status == "done") {
            card += '<button class="l-btn">&larr;</button>';
        }

        if (item.status == "todo" || item.status == "inprogress") {
            card += '<button class="r-btn">&rarr;</button>';
        }

        card += '</div></div>';

        if (item.status == "todo") { html1 += card; c1++; }
        else if (item.status == "inprogress") { html2 += card; c2++; }
        else if (item.status == "done") { html3 += card; c3++; }
    }

    box1.innerHTML = html1; box2.innerHTML = html2; box3.innerHTML = html3;
    num1.textContent = c1; num2.textContent = c2; num3.textContent = c3;

    
    // delete buttons
    var delBtns = document.querySelectorAll(".del-btn");
    for (var d = 0; d < delBtns.length; d++) {
        delBtns[d].addEventListener("click", function (e) {
            var myId = e.target.parentElement.getAttribute("data-id");
            for (var j = 0; j < list.length; j++) {
                if (list[j].id == myId) {
                    list.splice(j, 1);
                    break;
                }
            }
            show(); 
        });
    }

    // right arrow buttons
    var rBtn = document.querySelectorAll(".r-btn");
    for (var r = 0; r < rBtn.length; r++) {
        rBtn[r].addEventListener("click", function (e) {
            var myId = e.target.parentElement.parentElement.getAttribute("data-id");
            for (var j = 0; j < list.length; j++) {
                if (list[j].id == myId) {
                    if (list[j].status == "todo") list[j].status = "inprogress";
                    else if (list[j].status == "inprogress") list[j].status = "done";
                    break;
                }
            }
            show();
        });
    }

    // left arrow buttons
    var lBtn = document.querySelectorAll(".l-btn");
    for (var l = 0; l < lBtn.length; l++) {
        lBtn[l].addEventListener("click", function (e) {
            var myId = e.target.parentElement.parentElement.getAttribute("data-id");
            for (var j = 0; j < list.length; j++) {
                if (list[j].id == myId) {
                    if (list[j].status == "done") list[j].status = "inprogress";
                    else if (list[j].status == "inprogress") list[j].status = "todo";
                    break;
                }
            }
            show();
        });
    }
}

btn.addEventListener("click", function () {
    if (inp.value == "") return;
    list.push({ id: idNum, text: inp.value, status: "todo" });
    idNum++;
    inp.value = "";
    show();
});

inp.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        btn.click();
    }
});