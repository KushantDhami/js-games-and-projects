document.addEventListener("DOMContentLoaded", function () {
  const btnAdd = document.querySelector(".btnAdd");
  const input = document.querySelector(".input");
  const lists = document.querySelector(".list");
  const main = document.querySelector(".main");

  let todos = JSON.parse(sessionStorage.getItem("todos")) || [];

  function saveAndRender() {
    sessionStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }

  function renderTodos() {
    lists.innerHTML = "";
    todos.forEach((task, index) => {
      let li = document.createElement("li");
      li.classList.add("items");
      li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="actions">
            <i class="fa-solid fa-pen-to-square icon" data-action="edit" data-index="${index}"></i>
            <i class="fas fa-arrow-up icon" data-action="up" data-index="${index}"></i>
            <i class="fas fa-arrow-down icon" data-action="down" data-index="${index}"></i>
            <i class="fas fa-trash icon" data-action="delete" data-index="${index}"></i>
        </div>
      `;
      lists.appendChild(li);
    });
  }

  function addTask() {
    let taskValue = input.value.trim();
    if (taskValue === "") {
      alert("Please enter a task");
      return;
    }

    todos.push({ id: Date.now(), text: taskValue });
    input.value = "";
    saveAndRender();
  }

  lists.addEventListener("click", (e) => {
    if (!e.target.classList.contains("icon")) return;

    const action = e.target.getAttribute("data-action");
    const index = parseInt(e.target.getAttribute("data-index"));

    if (action === "delete") {
      todos.splice(index, 1);
      saveAndRender();
    } else if (action === "up" && index > 0) {
      [todos[index], todos[index - 1]] = [todos[index - 1], todos[index]];
      saveAndRender();
    } else if (action === "down" && index < todos.length - 1) {
      [todos[index], todos[index + 1]] = [todos[index + 1], todos[index]];
      saveAndRender();
    } else if (action === "edit") {
      openEditMenu(index);
    }
  });

  function openEditMenu(index) {
    const task = todos[index];

    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    overlay.innerHTML = `
      <div class="menu">
        <div id='h1-btn'>
            <h1>Edit Task</h1>
            <button class="btnClose"><i class="fa-solid fa-xmark"></i> Close</button>
        </div>
        <textarea class="text-area" rows="5">${task.text}</textarea>
        <div class="btn-submit">
            <button class="btnEdit"><i class="fa-solid fa-floppy-disk"></i> Save</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay
      .querySelector(".btnClose")
      .addEventListener("click", () => overlay.remove());

    overlay.querySelector(".btnEdit").addEventListener("click", () => {
      const newValue = overlay.querySelector(".text-area").value.trim();
      if (newValue !== "") {
        todos[index].text = newValue;
        saveAndRender();
        overlay.remove();
      }
    });
  }

  btnAdd.addEventListener("click", addTask);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  renderTodos();
});
