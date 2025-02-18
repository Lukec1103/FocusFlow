let tasksByMonth = {
  "January": [],
  "February": [],
  "March": [],
  "April": [],
  "May": [],
  "June": [],
  "July": [],
  "August": [],
  "September": [],
  "October": [],
  "November": [],
  "December": []
};

let monthAlertShown = {
  "January": false,
  "February": false,
  "March": false,
  "April": false,
  "May": false,
  "June": false,
  "July": false,
  "August": false,
  "September": false,
  "October": false,
  "November": false,
  "December": false
};

let yearList = [];

let routines = [];

function saveTasksData() {
  localStorage.setItem("tasksByMonth", JSON.stringify(tasksByMonth));
}

function loadTasksData() {
  const storedTasks = localStorage.getItem("tasksByMonth");
  if (storedTasks) {
    tasksByMonth = JSON.parse(storedTasks);
  }
}

function saveYearList() {
  localStorage.setItem("yearList", JSON.stringify(yearList));
}

function loadYearList() {
  const storedYearList = localStorage.getItem("yearList");
  if (storedYearList) {
    yearList = JSON.parse(storedYearList);
  } else {
    yearList = [2024, 2025]; 
  }
  renderYearButtons();
}

function renderYearButtons() {
  let yearButtons = document.getElementById("year-buttons");
  yearButtons.innerHTML = "";
  yearList.forEach(year => {
    let button = document.createElement("button");
    button.innerText = year;
    button.onclick = () => selectYear(year);
    yearButtons.appendChild(button);
  });
}

function saveRoutines() {
  localStorage.setItem("routines", JSON.stringify(routines));
}

function loadRoutines() {
  const storedRoutines = localStorage.getItem("routines");
  if (storedRoutines) {
    routines = JSON.parse(storedRoutines);
  } else {
    routines = [];
  }
  renderRoutines();
}

function renderRoutines() {
  let routineList = document.getElementById("routine-list");
  routineList.innerHTML = "";
  routines.forEach((routine, index) => {
    let routineRow = document.createElement("div");
    routineRow.classList.add("routine-row");

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X";
    deleteBtn.classList.add("delete-routine-btn");
    deleteBtn.onclick = () => {
      routines.splice(index, 1);
      saveRoutines();
      renderRoutines();
    };

    let timeInput = document.createElement("input");
    timeInput.type = "text";
    timeInput.placeholder = "00:00-00:00";
    timeInput.classList.add("routine-time");
    timeInput.value = routine.time || "";
    timeInput.addEventListener("input", (e) => {
      routines[index].time = e.target.value;
      saveRoutines();
    });

    let routineInput = document.createElement("input");
    routineInput.type = "text";
    routineInput.placeholder = "Routine";
    routineInput.classList.add("routine-text");
    routineInput.value = routine.text || "";
    routineInput.addEventListener("input", (e) => {
      routines[index].text = e.target.value;
      saveRoutines();
    });

    routineRow.appendChild(deleteBtn);
    routineRow.appendChild(timeInput);
    routineRow.appendChild(routineInput);
    routineList.appendChild(routineRow);
  });
}

const toggles = document.querySelectorAll('input[type="checkbox"][id^="toggle-mode"]');
toggles.forEach(toggle => {
  toggle.addEventListener('change', function () {
    if (this.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    const state = this.checked;
    toggles.forEach(t => t.checked = state);
  });
});

function goToYearSelection() {
  document.getElementById("landing-page").classList.add("hidden");
  document.getElementById("year-selection").classList.remove("hidden");
}

function goToMonthPage() {
  document.getElementById("year-selection").classList.add("hidden");
  document.getElementById("month-page").classList.remove("hidden");
}

function selectYear(year) {
  document.getElementById("year-selection").classList.add("hidden");
  document.getElementById("month-page").classList.remove("hidden");
  document.getElementById("year-title").innerText = "Tasks for " + year;
}

let currentMonth = "";

function selectMonth(month) {
  currentMonth = month;
  document.getElementById("month-page").classList.add("hidden");
  document.getElementById("todo-page").classList.remove("hidden");
  document.getElementById("month-title").innerText = month + "'s Tasks";
  renderTasks();
  checkAllTasksCompleted();
}

function goBack(pageId) {
  document.querySelectorAll(".container").forEach(el => el.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}

document.querySelectorAll('.month-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    selectMonth(btn.getAttribute('data-month'));
  });
});

function renderTasks() {
  let taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  tasksByMonth[currentMonth].forEach((task, index) => {
    let li = document.createElement("li");

    
    let deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.innerText = "x";
    deleteTaskBtn.classList.add("delete-task-btn");
    deleteTaskBtn.onclick = () => {
      tasksByMonth[currentMonth].splice(index, 1);
      saveTasksData();
      renderTasks();
      checkAllTasksCompleted();
    };
    li.appendChild(deleteTaskBtn);

    
    let taskContent = document.createElement("div");
    taskContent.classList.add("task-content");

    let span = document.createElement("span");
    span.classList.add("task-text");
    span.innerText = task.text;
    if (task.completed) {
      span.classList.add("completed");
    }
    taskContent.appendChild(span);

    let actionsDiv = document.createElement("div");
    actionsDiv.classList.add("task-actions");

    let checkButton = document.createElement("button");
    checkButton.innerText = "✔";
    checkButton.classList.add("check-btn");
    checkButton.onclick = () => {
      tasksByMonth[currentMonth][index].completed = !tasksByMonth[currentMonth][index].completed;
      saveTasksData();
      renderTasks();
      checkAllTasksCompleted();
    };

    let editButton = document.createElement("button");
    editButton.innerText = "✎";
    editButton.classList.add("edit-btn");
    editButton.onclick = () => {
      let newText = prompt("Edit Task:", tasksByMonth[currentMonth][index].text);
      if (newText !== null) {
        tasksByMonth[currentMonth][index].text = newText;
        saveTasksData();
        renderTasks();
      }
    };

    actionsDiv.appendChild(checkButton);
    actionsDiv.appendChild(editButton);
    taskContent.appendChild(actionsDiv);

    li.appendChild(taskContent);
    taskList.appendChild(li);
  });
}

function addTask() {
  let taskInput = document.getElementById("task-input");
  let taskText = taskInput.value.trim();
  if (taskText === "") return;

  tasksByMonth[currentMonth].push({ text: taskText, completed: false });
  taskInput.value = "";
  saveTasksData();
  renderTasks();
  checkAllTasksCompleted();
}

document.getElementById("task-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function checkAllTasksCompleted() {
  const tasks = tasksByMonth[currentMonth];
  if (tasks.length === 0) {
    monthAlertShown[currentMonth] = false;
    return;
  }
  let allCompleted = tasks.every(task => task.completed);

  let monthButtons = document.querySelectorAll('.month-btn');
  monthButtons.forEach(btn => {
    if (btn.getAttribute('data-month') === currentMonth) {
      if (allCompleted) {
        btn.classList.add("done");
      } else {
        btn.classList.remove("done");
        monthAlertShown[currentMonth] = false;
      }
    }
  });

  if (allCompleted && !monthAlertShown[currentMonth]) {
    if (currentMonth.toLowerCase() === "december") {
      alert("Well done, on to the next year!");
    } else {
      alert("Well done, on to the next month!");
    }
    monthAlertShown[currentMonth] = true;
  }
}

function addRoutineRow() {
  routines.push({ time: "", text: "" });
  saveRoutines();
  renderRoutines();
}

function renderRoutines() {
  let routineList = document.getElementById("routine-list");
  routineList.innerHTML = "";
  routines.forEach((routine, index) => {
    let routineRow = document.createElement("div");
    routineRow.classList.add("routine-row");

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X";
    deleteBtn.classList.add("delete-routine-btn");
    deleteBtn.onclick = () => {
      routines.splice(index, 1);
      saveRoutines();
      renderRoutines();
    };

    let timeInput = document.createElement("input");
    timeInput.type = "text";
    timeInput.placeholder = "00:00-00:00";
    timeInput.classList.add("routine-time");
    timeInput.value = routine.time || "";
    timeInput.addEventListener("input", (e) => {
      routines[index].time = e.target.value;
      saveRoutines();
    });

    let routineInput = document.createElement("input");
    routineInput.type = "text";
    routineInput.placeholder = "Routine";
    routineInput.classList.add("routine-text");
    routineInput.value = routine.text || "";
    routineInput.addEventListener("input", (e) => {
      routines[index].text = e.target.value;
      saveRoutines();
    });

    routineRow.appendChild(deleteBtn);
    routineRow.appendChild(timeInput);
    routineRow.appendChild(routineInput);
    routineList.appendChild(routineRow);
  });
}

function showYearInput() {
  document.getElementById("add-year-btn").classList.add("hidden");
  let yearInput = document.getElementById("year-input");
  yearInput.classList.remove("hidden");
  yearInput.focus();
}

function addYear() {
  let yearInput = document.getElementById("year-input");
  let yearStr = yearInput.value.trim();

  if (yearStr === "" || isNaN(yearStr)) {
    alert("Please enter a valid year.");
    return;
  }

  let year = parseInt(yearStr, 10);

  if (year < 2024) {
    alert("Year must be 2024 or later.");
    return;
  }

  if (yearList.includes(year)) {
    alert("This year has already been added.");
    return;
  }

  yearList.push(year);
  saveYearList();
  renderYearButtons();

  yearInput.value = "";
  yearInput.classList.add("hidden");
  document.getElementById("add-year-btn").classList.remove("hidden");
}

document.getElementById("year-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addYear();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadYearList();
  loadTasksData();
  loadRoutines();
});
