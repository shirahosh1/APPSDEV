const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clearCompleted");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Save
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;
  if (filter === "active") {
    filtered = tasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filtered = tasks.filter(t => t.completed);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span contenteditable="true" onblur="editTask('${task.id}', this.innerText)">
        ${task.text}
      </span>
      <div class="actions">
        <button onclick="toggleTask('${task.id}')">✔</button>
        <button onclick="deleteTask('${task.id}')">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

// Add task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

// Delete
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Toggle complete
function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// Edit
function editTask(id, newText) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, text: newText } : t
  );
  saveTasks();
}

// Filter
document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTasks();
  });
});

// Counter
function updateCounter() {
  const active = tasks.filter(t => !t.completed).length;
  counter.textContent = `${active} task(s) left`;
}

// Clear completed
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Enter key support
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

addBtn.addEventListener("click", addTask);

// Initial render
renderTasks();