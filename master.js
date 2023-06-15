// BOM Challenge
let input = document.querySelector("input");
let add = document.querySelector(".add");
let tasksArr = [];
let tasksContainer = document.querySelector(".tasks");
let allTasks = document.querySelector(".all-tasks span"),
  completedTasks = document.querySelector(".completed span");

if (window.localStorage.getItem("tasks")) {
  importStorage();
}

if (window.localStorage.getItem("completed-tasks")) {
  completedTasks.innerHTML = window.localStorage.getItem("completed-tasks");
}

window.onload = function () {
  input.focus();
};
// import from local Storage
function importStorage() {
  let importArr = JSON.parse(window.localStorage.getItem("tasks"));
  for (let i = 0; i < importArr.length; i++) {
    addElements(importArr[i].title, importArr[i].id, importArr[i].classes);
  }
}

// add on click
add.addEventListener("click", function () {
  if (input.value.toString().trim() !== "") {
    if (checkTask(input.value, tasksArr)) {
      input.value = "";
      input.focus();
      Swal.fire({
        icon: "error",
        text: "This Task Is Already Exist...",
      });
    } else {
      addElements(input.value);
      input.value = "";
      input.focus();
    }
  } else {
    input.value = "";
    input.focus();
    Swal.fire({
      icon: "error",
      text: "This Field shouldn't be Empty!",
    });
  }
});

function checkTask(value, arr) {
  for (i in arr) {
    if (value === arr[i].title) {
      return true;
    } else continue;
  }
}
// Remove on click
tasksContainer.addEventListener("click", function (el) {
  if (el.target.className === "del") {
    if (el.target.parentElement.classList.contains("done")) {
      completedTasks.innerHTML = parseInt(completedTasks.innerHTML) - 1;
    }
    deleteElements(el.target.parentElement);
  }
  if (
    el.target.parentElement.classList.contains("task") &&
    !el.target.classList.contains("del")
  ) {
    el.target.parentElement.classList.toggle("done");
    completedTasks.innerHTML = Array.from(
      document.querySelectorAll(".tasks .task")
    ).filter((el) => el.classList.contains("done")).length;
    addClassDone(el.target.parentElement);
  }
  window.localStorage.setItem(
    "completed-tasks",
    parseInt(completedTasks.innerHTML)
  );
});
// Function to Add Elements
function addElements(value, id = Date.parse(new Date()), classes = ["task"]) {
  let task = document.createElement("div");
  let textSpan = document.createElement("span");
  let text = document.createTextNode(value);
  for (i in classes) {
    task.classList.add(classes[i]);
  }
  textSpan.appendChild(text);
  task.appendChild(textSpan);
  task.id = id;
  task.title = value;

  let del = document.createElement("span");
  del.textContent = "Delete";
  del.className = "del";
  task.appendChild(del);

  tasksContainer.appendChild(task);
  addElementsToStorage(task);
  allTasks.innerHTML = parseInt(allTasks.innerHTML) + 1;
}
// Function To Remove Elements
function deleteElements(value) {
  removeElementsFromStorage(value);
  value.remove();
  allTasks.innerHTML = parseInt(allTasks.innerHTML) - 1;
}

// Function To Add To Local Storage
function addElementsToStorage(element) {
  let obj = {
    id: element.id,
    title: element.title,
    classes: element.classList,
  };
  tasksArr.push(obj);
  window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

// Function To Remove From Local Storage
function removeElementsFromStorage(element) {
  tasksArr = tasksArr.filter((task) => task.id != element.id);
  window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

// add class done and remove it from local storage
function addClassDone(element) {
  for (i in tasksArr) {
    if (tasksArr[i].title === element.getAttribute("title")) {
      element.classList.contains("done")
        ? (tasksArr[i].classes[1] = "done")
        : (tasksArr[i].classes[1] = null);
    } else continue;
  }
  window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

// Delete All tasks
let deleteAll = document.getElementById("delete-all");
deleteAll.addEventListener("click", function () {
  tasksContainer.innerHTML = "";
  window.localStorage.removeItem("tasks");
  completedTasks.innerHTML = 0;
  allTasks.innerHTML = 0;
  window.localStorage.setItem("completed-tasks", 0);
});

// Complete All Tasks
let completeAll = document.getElementById("complete-all");
completeAll.addEventListener("click", function () {
  document.querySelectorAll(".tasks .task").forEach((el) => {
    if (!el.classList.contains("done")) {
      el.classList.add("done");
      completedTasks.innerHTML = parseInt(completedTasks.innerHTML) + 1;
    }
    addClassDone(el);
    window.localStorage.setItem(
      "completed-tasks",
      parseInt(completedTasks.innerHTML)
    );
  });
});
