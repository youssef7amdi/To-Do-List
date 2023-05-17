// BOM Challenge
let input = document.querySelector("input");
let add = document.querySelector(".add");
let tasksArr = [];
let tasksContainer = document.querySelector(".tasks");
let importArr = [];
let allTasks = document.querySelector(".all-tasks span"),
  completedTasks = document.querySelector(".completed span");

if (window.localStorage.getItem("tasks")) {
  importStorage();
  for (let i = 0; i < importArr[0].length; i++) {
    addElements(
      importArr[0][i].title,
      importArr[0][i].id,
      importArr[0][i].classes
    );
  }
}

if (window.localStorage.getItem("completed-tasks")) {
  completedTasks.innerHTML = window.localStorage.getItem("completed-tasks");
}

window.onload = function () {
  input.focus();
};
// import from local Storage
function importStorage() {
  importArr = [];
  importArr.push(JSON.parse(window.localStorage.getItem("tasks")));
}

importStorage();
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
    if (el.target.parentElement.classList.contains("done")) {
      el.target.parentElement.classList.remove("done");
      completedTasks.innerHTML = parseInt(completedTasks.innerHTML) - 1;
    } else {
      el.target.parentElement.classList.add("done");
      completedTasks.innerHTML = parseInt(completedTasks.innerHTML) + 1;
    }
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
  importStorage();
  for (i in importArr[0]) {
    if (importArr[0][i].title === element.getAttribute("title")) {
      element.classList.contains("done")
        ? (importArr[0][i].classes[1] = "done")
        : (importArr[0][i].classes[1] = null);
    } else continue;
  }
  window.localStorage.setItem("tasks", JSON.stringify(importArr[0]));
}

// Delete All tasks
let deleteAll = document.getElementById("delete-all");
deleteAll.addEventListener("click", function () {
  document.querySelectorAll(".tasks .task").forEach((el) => {
    if (el.classList.contains("done")) {
      completedTasks.innerHTML = parseInt(completedTasks.innerHTML) - 1;
    }
    deleteElements(el);
    window.localStorage.setItem(
      "completed-tasks",
      parseInt(completedTasks.innerHTML)
    );
  });
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
