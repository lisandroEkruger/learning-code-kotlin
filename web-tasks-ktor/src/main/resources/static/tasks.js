function displayAllTasks() {
    clearTasksTable();
    fetchAllTasks().then(displayTasks);
}

function displayTasksWithPriority() {
    clearTasksTable();
    const priority = readTaskPriority();
    fetchTasksWithPriority(priority).then(displayTasks);
}

function displayTask(name) {
    fetchTaskWithName(name).then(
        (t) =>
            (taskDisplay().innerHTML = `${t.priority} priority task ${t.name} with description "${t.description}"`)
    );
}

function deleteTask(name) {
    deleteTaskWithName(name).then(() => {
        clearTaskDisplay();
        displayAllTasks();
    });
}

function deleteTaskWithName(name) {
    return sendDELETE(`/tasks/${name}`);
}

function addNewTask() {
    const task = buildTaskFromForm();
    sendPOST("/tasks", task).then(displayAllTasks);
}

function buildTaskFromForm() {
    return {
        name: getTaskFormValue("newTaskName"),
        description: getTaskFormValue("newTaskDescription"),
        priority: getTaskFormValue("newTaskPriority"),
    };
}

function getTaskFormValue(controlName) {
    return document.addTaskForm[controlName].value;
}

function taskDisplay() {
    return document.getElementById("currentTaskDisplay");
}

function readTaskPriority() {
    return document.priorityForm.priority.value;
}

function fetchTasksWithPriority(priority) {
    return sendGET(`/tasks/byPriority/${priority}`);
}

function fetchTaskWithName(name) {
    return sendGET(`/tasks/byName/${name}`);
}

function fetchAllTasks() {
    return sendGET("/tasks");
}

function sendGET(url) {
    return fetch(url, { headers: { Accept: "application/json" } }).then(
        (response) => {
            if (response.ok) {
                return response.json();
            }
            return [];
        }
    );
}

function sendPOST(url, data) {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

function sendDELETE(url) {
    return fetch(url, {
        method: "DELETE",
    });
}

function tasksTable() {
    return document.getElementById("tasksTableBody");
}

function clearTasksTable() {
    tasksTable().innerHTML = "";
}

function clearTaskDisplay() {
    taskDisplay().innerText = "None";
}

function displayTasks(tasks) {
    const tasksTableBody = tasksTable();
    tasks.forEach((task) => {
        const newRow = taskRow(task);
        tasksTableBody.appendChild(newRow);
    });
}

function taskRow(task) {
    return tr([
        td(task.name),
        td(task.priority),
        td(viewLink(task.name)),
        td(deleteLink(task.name)),
    ]);
}

function tr(children) {
    const node = document.createElement("tr");
    children.forEach((child) => node.appendChild(child));
    return node;
}

function td(content) {
    const node = document.createElement("td");
    if (content instanceof Element) {
        node.appendChild(content);
    } else {
        node.appendChild(document.createTextNode(content));
    }
    return node;
}

function viewLink(taskName) {
    const node = document.createElement("a");
    node.setAttribute("href", `javascript:displayTask("${taskName}")`);
    node.appendChild(document.createTextNode("view"));
    return node;
}

function deleteLink(taskName) {
    const node = document.createElement("a");
    node.setAttribute("href", `javascript:deleteTask("${taskName}")`);
    node.appendChild(document.createTextNode("delete"));
    return node;
}