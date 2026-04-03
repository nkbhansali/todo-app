const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");

let todos = [];

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    applyTheme(saved);
}

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
});

function renderTodos() {
    todoList.innerHTML = "";

    if (todos.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty";
        emptyMessage.textContent = "No todos yet. Add one above.";
        todoList.appendChild(emptyMessage);
        return;
    }

    todos.forEach((todo, index) => {
        const listItem = document.createElement("li");
        listItem.className = "todo-item";

        const completeCheckbox = document.createElement("input");
        completeCheckbox.className = "todo-check";
        completeCheckbox.type = "checkbox";
        completeCheckbox.checked = todo.completed;
        completeCheckbox.setAttribute("aria-label", `Mark ${todo.text} as completed`);
        completeCheckbox.addEventListener("change", () => {
            todo.completed = completeCheckbox.checked;
            renderTodos();
        });

        const textSpan = document.createElement("span");
        textSpan.className = "todo-text";
        textSpan.textContent = todo.text;
        if (todo.completed) {
            textSpan.classList.add("completed");
        }

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            listItem.classList.add("removing");
            listItem.addEventListener("animationend", () => {
                todos.splice(index, 1);
                renderTodos();
            }, { once: true });
        });

        listItem.append(completeCheckbox, textSpan, deleteButton);
        todoList.appendChild(listItem);
    });
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = todoInput.value.trim();
    if (!text) {
        return;
    }

    todos.push({ text, completed: false });
    todoInput.value = "";
    todoInput.focus();
    renderTodos();
});

initTheme();
renderTodos();
