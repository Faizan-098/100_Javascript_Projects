// TARGET ELEMENETS
const form = document.querySelector("#form");
const timer = document.querySelector("#timer");
const highContainer = document.querySelector("#high-container");
const mediumContainer = document.querySelector("#medium-container");
const lowContainer = document.querySelector("#low-container");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");
const totalCount = document.querySelector("#totalCount");
const progressCount = document.querySelector("#progressCount");
const chartCanvas = document.querySelector("#taskChart");
const completionCircle = document.querySelector("#completionCircle");
const completionPercent = document.querySelector("#completionPercent");

// HELPER VARABLES
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskChart;
onLoad();

// FUNCTION TO ONLOAD
function onLoad() {
  renderTasks();
  countStatus(pendingCount, completedCount, progressCount, totalCount);
  renderChart();
  updateCompletionCircle();
}

// FUNCTION TO UPDATE THE TIMER
function updateTimer() {
  return new Date().toLocaleTimeString("en-US");
}

setInterval(() => (timer.textContent = updateTimer()), 1000);

// CREATE A TASK
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const desc = document.querySelector("#desc").value;
  const priority = document.querySelector("#priority").value;

  if (!title || !desc || !priority) {
    return alert("Please fill all the fields");
  }

  // CREATE TASK OBJECT
  const task = {
    id: Date.now(),
    title,
    desc,
    priority,
    createdAt: new Date(),
    status: "pending",
  };

  // PUSH TO TASKS ARRAY
  tasks.unshift(task);

  //SAVE TO LOCAL STORAGE
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // CLEAR THE FORM
  form.reset();

  // RENDER THE TASKS IN UI
  renderTasks();

  // DISPLAY STATUS COUNT
  countStatus(pendingCount, completedCount, progressCount, totalCount);

  // RENDER CHART
  renderChart();

  // UPDATE RATIO CIRCLE
  updateCompletionCircle();
});

// FUNCTION TO RENDER TASKS ON UI
function renderTasks() {
  highContainer.innerHTML = "";
  mediumContainer.innerHTML = "";
  lowContainer.innerHTML = "";

  for (const task of tasks) {
    const taskEl = document.createElement("div");
    taskEl.classList.add(
      "card",
      "bg-white/70",
      "border",
      "hover:shadow-md",
      "transition",
      "mt-3",
      "backdrop-blur",
    );

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "p-4");

    const title = document.createElement("h3");
    title.classList.add("font-semibold");
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.classList.add("text-sm", "text-slate-500");
    desc.textContent = task.desc;

    const footer = document.createElement("div");
    footer.classList.add("flex", "justify-between", "items-center", "mt-3");

    const statusSelect = document.createElement("select");
    statusSelect.classList.add(
      "select",
      "select-xs",
      "w-[100px]",
      "h-[30px]",
      "select-bordered",
    );

    // ADD EVENT ON SELECT ELEMENT
    statusSelect.addEventListener("change", (e) =>
      updateStatus(e.target.value, task.id),
    );
    const pendingOption = document.createElement("option");
    pendingOption.textContent = "Pending";

    const inProgressOption = document.createElement("option");
    inProgressOption.textContent = "In Progress";

    const completedOption = document.createElement("option");
    completedOption.textContent = "Completed";

    // UPDATE STATUS
    if (task.status === "pending") {
      pendingOption.selected = true;
    } else if (task.status === "in progress") {
      inProgressOption.selected = true;
    } else {
      completedOption.selected = true;
    }

    statusSelect.append(pendingOption, inProgressOption, completedOption);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(
      "btn",
      "btn-sm",
      "text-white",
      "border-none",
      "bg-gradient-to-br",
      "from-rose-500",
      "via-red-400",
      "to-rose-500",
      "shadow-sm",
    );
    deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i> Delete`;

    //ADD EVENT ON DELETE ELEMENT
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    cardBody.append(title, desc, footer);
    footer.append(statusSelect, deleteBtn);
    taskEl.append(cardBody);

    // APPEND TO RESPECTIVE CONTAINERS
    if (task.priority === "High") highContainer.appendChild(taskEl);
    else if (task.priority === "Medium") mediumContainer.appendChild(taskEl);
    else lowContainer.appendChild(taskEl);
  }

  // DISPLAY EMPTY MESSAGE IF NO TASKS
  if (highContainer.innerHTML === "")
    displayEmptyMessage(highContainer, "High");
  if (mediumContainer.innerHTML === "")
    displayEmptyMessage(mediumContainer, "Medium");
  if (lowContainer.innerHTML === "") displayEmptyMessage(lowContainer, "Low");
}

// FUNCTION TO DISPLAY EMPTY MESSAGE
function displayEmptyMessage(container, priority, taskStatus = "tasks") {
  container.innerHTML = "";
  const emptyMessage = document.createElement("div");
  emptyMessage.classList.add("text-center", "py-10", "text-slate-400");

  const iconWrapper = document.createElement("div");
  iconWrapper.classList.add(
    "w-[70px]",
    "h-[70px]",
    "mx-auto",
    "flex",
    "items-center",
    "justify-center",
    "bg-slate-100",
    "rounded-full",
    "mb-3",
  );
  const icon = document.createElement("i");
  icon.classList.add("ri-inbox-line", "text-2xl");
  iconWrapper.appendChild(icon);

  const message = document.createElement("p");
  message.classList.add("text-md");
  message.textContent = `No ${taskStatus} in ${priority} Priority`;

  emptyMessage.append(iconWrapper, message);
  container.appendChild(emptyMessage);
}

// FUNCTION TO UPDATE STATUS
function updateStatus(status, id) {
  tasks = tasks.filter((task) => {
    if (task.id === id) {
      return (task.status = status.toLowerCase());
    }
    return task;
  });

  // SAVE IN LOCAL STORAGE
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // RENDER TASKS ON UI
  renderTasks();

  // DISPLAY STATUS COUNT
  countStatus(pendingCount, completedCount, progressCount, totalCount);

  // RENDER CHART
  renderChart();

  // UPDATE RATIO CIRCLE
  updateCompletionCircle();
}

// FUNCTION TO CALCULATE COUNT
function countStatus(penElem, comElem, proElem, totElem) {
  const status = tasks.reduce(
    (acc, task) => {
      acc[task.status] = acc[task.status] + 1;
      acc.total++;
      return acc;
    },
    { pending: 0, completed: 0, "in progress": 0, total: 0 },
  );

  penElem.textContent = status.pending;
  comElem.textContent = status.completed;
  proElem.textContent = status["in progress"];
  totElem.textContent = status.total;
}

// FUNCTION TO FILTER TASK UNDER PRIORITY
function filterTask(priority, status) {
  let filtered = tasks.filter(
    (task) =>
      (task.status === status && task.priority === priority) ||
      (status === "all" && task.priority === priority),
  );

  // CHECK TASKS LENGTH AND DISPLAY EMPTY MESSAGE
  if (filtered.length === 0) {
    if (priority === "High")
      return displayEmptyMessage(
        highContainer,
        priority,
        status === "all" ? "tasks" : `${status} tasks`,
      );
    if (priority === "Medium")
      return displayEmptyMessage(
        mediumContainer,
        priority,
        status === "all" ? "tasks" : `${status} tasks`,
      );
    if (priority === "Low")
      return displayEmptyMessage(
        lowContainer,
        priority,
        status === "all" ? "tasks" : `${status} tasks`,
      );
  }

  // DISPLAY TASKS BASED ON PRIORITY
  if (priority === "High") return displayFilteredTasks(highContainer, filtered);
  if (priority === "Medium")
    return displayFilteredTasks(mediumContainer, filtered);
  if (priority === "Low") return displayFilteredTasks(lowContainer, filtered);
}

// FUNCTION TO DISPLAY FILTERED TASKS
function displayFilteredTasks(container, tasks) {
  container.innerHTML = "";

  for (const task of tasks) {
    const taskEl = document.createElement("div");
    taskEl.classList.add(
      "card",
      "bg-white/70",
      "border",
      "hover:shadow-md",
      "transition",
      "mt-3",
      "backdrop-blur",
    );

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "p-4");

    const title = document.createElement("h3");
    title.classList.add("font-semibold");
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.classList.add("text-sm", "text-slate-500");
    desc.textContent = task.desc;

    const footer = document.createElement("div");
    footer.classList.add("flex", "justify-between", "items-center", "mt-3");

    const statusSelect = document.createElement("select");
    statusSelect.classList.add(
      "select",
      "select-xs",
      "w-[100px]",
      "h-[30px]",
      "select-bordered",
    );

    // ADD EVENT ON SELECT
    statusSelect.addEventListener("change", (e) =>
      updateStatus(e.target.value, task.id),
    );
    const pendingOption = document.createElement("option");
    pendingOption.textContent = "Pending";

    const inProgressOption = document.createElement("option");
    inProgressOption.textContent = "In Progress";

    const completedOption = document.createElement("option");
    completedOption.textContent = "Completed";

    // UPDATE STATUS
    if (task.status === "pending") {
      pendingOption.selected = true;
    } else if (task.status === "in progress") {
      inProgressOption.selected = true;
    } else {
      completedOption.selected = true;
    }

    statusSelect.append(pendingOption, inProgressOption, completedOption);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(
      "btn",
      "btn-sm",
      "text-white",
      "border-none",
      "bg-gradient-to-br",
      "from-rose-500",
      "via-red-400",
      "to-rose-500",
      "shadow-sm",
    );
    deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i> Delete`;

    cardBody.append(title, desc, footer);
    footer.append(statusSelect, deleteBtn);
    taskEl.append(cardBody);

    // APPEND TO RESPECTIVE CONTAINERS
    container.append(taskEl);
  }
}

// FUNCTION TO DELETE SINGLE TASK
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  // SAVE IN LOCAL STORAGE
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // RENDER TASKS ON UI
  renderTasks();

  // UPDATE COUNT STATUS
  countStatus(pendingCount, completedCount, progressCount, totalCount);

  // RENDER CHART
  renderChart();

  // UPDATE RATIO CIRCLE
  updateCompletionCircle();
}

// FUNCTON TO DELETE ALL TASKS TOGETHER
function deleteAllTasks() {
  tasks = [];

  // SAVE IN LOCAL STORAGE
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // RENDER TASKS ON UI
  renderTasks();

  // UPDATE COUNT STATUS
  countStatus(pendingCount, completedCount, progressCount, totalCount);

  // RENDER CHART
  renderChart();

  // UPDATE RATIO CIRCLE
  updateCompletionCircle();
}

// CHART
function renderChart() {
  const pending = tasks.filter((t) => t.status === "pending").length || 0;
  const progress = tasks.filter((t) => t.status === "in progress").length || 0;
  const completed = tasks.filter((t) => t.status === "completed").length || 0;

  const dataValues = [pending, progress, completed];

  const ctx = document.querySelector("#taskChart").getContext("2d");

  if (taskChart) taskChart.destroy();

  // gradients
  const pendingGradient = ctx.createLinearGradient(0, 0, 0, 200);
  pendingGradient.addColorStop(0, "#facc15");
  pendingGradient.addColorStop(1, "#f59e0b");

  const progressGradient = ctx.createLinearGradient(0, 0, 0, 200);
  progressGradient.addColorStop(0, "#3b82f6");
  progressGradient.addColorStop(1, "#6366f1");

  const completedGradient = ctx.createLinearGradient(0, 0, 0, 200);
  completedGradient.addColorStop(0, "#22c55e");
  completedGradient.addColorStop(1, "#16a34a");

  taskChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: ["Pending", "In Progress", "Completed"],
      datasets: [
        {
          label: "Tasks",
          data: dataValues,
          backgroundColor: [
            pendingGradient,
            progressGradient,
            completedGradient,
          ],
          borderRadius: 8,
          barThickness: 40,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
          grid: {
            color: "rgba(0,0,0,0.05)",
          },
        },

        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// UPDATE RATIO CIRCLE
function updateCompletionCircle() {
  const total = tasks.length;

  const completed = tasks.filter((task) => task.status === "completed").length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  completionCircle.style.setProperty("--value", percent);

  completionPercent.textContent = percent + "%";
}
