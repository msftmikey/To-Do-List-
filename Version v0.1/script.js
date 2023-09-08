document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");

    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const taskInput = document.getElementById("task");
        const dueDateInput = document.getElementById("due-date");

        const taskName = taskInput.value;
        const dueDate = dueDateInput.value;

        if (taskName.trim() === "") {
            alert("Task name cannot be empty!");
            return;
        }

        const taskItem = document.createElement("li");
        taskItem.innerHTML = `<span>${taskName} --- Due: ${dueDate} </span>    
        <button class="delete-button">Delete</button>`;

        taskList.appendChild(taskItem);
        taskInput.value = "";
        dueDateInput.value = "";
    });

    taskList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-button")) {
            const taskItem = event.target.closest("li");
            taskItem.remove();
        }
    });
});

