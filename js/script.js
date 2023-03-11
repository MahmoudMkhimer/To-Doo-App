const notStartedInput = document.querySelector(".not-started-input"),
  notStartedBtn = document.getElementById("not-started-btn"),
  notStartedLayout = document.querySelector(".not-started"),
  inProgressInput = document.querySelector(".in-progress-input"),
  inProgressBtn = document.getElementById("in-progress-btn"),
  inProgressLayout = document.querySelector(".in-progress"),
  completedInput = document.querySelector(".completed-input"),
  completedBtn = document.getElementById("completed-btn"),
  completedLayout = document.querySelector(".completed");

let notStartedList = [],
  inProgressList = [],
  completedList = [];

const createTask = function (text) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.draggable = true;
  //   const temp = taskBody;
  //   temp.textContent = text;
  task.innerHTML = `<p class="task-name">${text}</p>
      <div class="control">
        <button class="edit"data-op = "edit"><ion-icon data-op = "edit" name="create"></ion-icon>
        <button data-op = "delete" class="delete">
          <ion-icon data-op = "delete" name="trash"></ion-icon>
        </button>
      </div>`;
  return task;
};

// add not started task
notStartedBtn.addEventListener("click", function (e) {
  const text = notStartedInput.value;
  if (text !== "") {
    const task = createTask(text);
    notStartedBtn.closest(".tasks-container").append(task);
    update();
    dragOperation();
  }
  notStartedInput.value = "";
});

// add in progress task
inProgressBtn.addEventListener("click", function (e) {
  const text = inProgressInput.value;
  if (text !== "") {
    const task = createTask(text);
    inProgressBtn.closest(".tasks-container").append(task);
    dragOperation();
    update();
  }
  inProgressInput.value = "";
});

// add completed task

completedBtn.addEventListener("click", function (e) {
  const text = completedInput.value;
  if (text !== "") {
    const task = createTask(text);
    completedBtn.closest(".tasks-container").append(task);
    dragOperation();
    update();
  }
  completedInput.value = "";
});
const removeTask = function () {};

const editTask = function (task) {
  let prevText = task.querySelector("p").textContent;

  task.innerHTML = `
  <input type="text" class="edit-input"/>
  <button class="btn save-btn" id="save-btn">Save</button>
  `;
  let currentInput = task.querySelector("input");
  currentInput.value = prevText;
  task.querySelector("button").addEventListener("click", function (e) {
    if (currentInput.value == "") {
      task.remove();
      update();
    } else {
      prevText = currentInput.value;
      task.innerHTML = `<p class="task-name">${prevText}</p>
        <div class="control">
          <button class="edit"data-op = "edit"><ion-icon data-op = "edit" name="create"></ion-icon>
          <button data-op = "delete" class="delete">
            <ion-icon data-op = "delete" name="trash"></ion-icon>
          </button>
        </div>`;
      update();
    }
  });
};

// delete not started task
notStartedLayout.addEventListener("click", function (e) {
  if (e.target.dataset.op === "delete") {
    const task = e.target.closest(".task");
    task.remove();
    update();
  } else if (e.target.dataset.op === "edit") {
    const task = e.target.closest(".task");
    editTask(task);
  }
});

// delete in progress task
inProgressLayout.addEventListener("click", function (e) {
  if (e.target.dataset.op === "delete") {
    const task = e.target.closest(".task");
    task.remove();
    update();
  } else if (e.target.dataset.op === "edit") {
    const task = e.target.closest(".task");
    editTask(task);
  }
});
// delete completed task
completedLayout.addEventListener("click", function (e) {
  if (e.target.dataset.op === "delete") {
    const task = e.target.closest(".task");
    task.remove();
    update();
  } else if (e.target.dataset.op === "edit") {
    const task = e.target.closest(".task");
    editTask(task);
  }
});

// dragging

let activeTask = null;
function dragOperation() {
  document.querySelectorAll(".task").forEach((task) => {
    task.addEventListener("dragstart", function () {
      activeTask = task;
      task.classList.add("active");
    });
    task.addEventListener("dragend", function () {
      task.classList.remove("active");
      activeTask = null;
    });
    document.querySelectorAll(".tasks-container").forEach((container) => {
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (e.target.closest(".task") != null) {
          e.target.closest(".task").classList.add("active-dragging");
        }
      });
      container.addEventListener("dragleave", (e) => {
        if (e.target.closest(".task") != null) {
          e.target.closest(".task").classList.remove("active-dragging");
        }
      });
      container.addEventListener("drop", (e) => {
        if (activeTask != null) {
          // console.log(e.target.closest(".task"));
          if (e.target.closest(".task") != null) {
            e.target
              .closest(".task")
              .insertAdjacentElement("beforebegin", activeTask);
            e.target.closest(".task").classList.remove("active-dragging");
          } else container.append(activeTask);
          update();
        }
      });
    });
  });
}

const update = function () {
  notStartedList = [...document.querySelectorAll(".not-started .task p")];
  notStartedList = notStartedList.map((e) => e.textContent);
  inProgressList = [...document.querySelectorAll(".in-progress .task p")];
  inProgressList = inProgressList.map((e) => e.textContent);
  completedList = [...document.querySelectorAll(".completed .task p")];
  completedList = completedList.map((e) => e.textContent);
  localStorage.setItem("not-start", JSON.stringify(notStartedList));
  localStorage.setItem("in-progress", JSON.stringify(inProgressList));
  localStorage.setItem("completed", JSON.stringify(completedList));
  // console.log(notStartedList, inProgressList, completedList);
};
// Local Storage
function init() {
  const notStarted = JSON.parse(localStorage.getItem("not-start"));
  if (notStarted !== null) {
    // console.log(notStarted);
    notStarted.forEach((task) => {
      notStartedLayout.appendChild(createTask(task));
    });
  }
  const inProgress = JSON.parse(localStorage.getItem("in-progress"));
  if (inProgress !== null) {
    inProgress.forEach((task) => {
      inProgressLayout.appendChild(createTask(task));
    });
  }
  const completed = JSON.parse(localStorage.getItem("completed"));
  if (completed !== null) {
    completed.forEach((task) => {
      completedLayout.appendChild(createTask(task));
    });
  }
}
init();
dragOperation();
