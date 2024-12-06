let tasks = [];
let currentTaskIndex = 0;
let totalTimeSpent = 0;
let timerInterval;
let startTime;

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskHours = parseInt(document.getElementById('taskHours').value) || 0;
    const taskMinutes = parseInt(document.getElementById('taskMinutes').value) || 0;
    const taskSeconds = parseInt(document.getElementById('taskSeconds').value) || 0;
    const taskTimeInSeconds = taskHours * 3600 + taskMinutes * 60 + taskSeconds;

    if (taskName && taskTimeInSeconds > 0) {
        tasks.push({ name: taskName, priority: taskPriority, time: taskTimeInSeconds });
        document.getElementById('savedTasks').innerHTML += `<li>${taskName} - ${taskHours}h ${taskMinutes}m ${taskSeconds}s (${taskPriority})</li>`;

        if (tasks.length >= 2) {
            document.getElementById('studyPlanButtonSection').style.display = 'block';
        }

        // Clear inputs
        document.getElementById('taskName').value = '';
        document.getElementById('taskHours').value = '';
        document.getElementById('taskMinutes').value = '';
        document.getElementById('taskSeconds').value = '';
    }
}

function showStudyPlan() {
    // Sort tasks by priority
    tasks.sort((a, b) => {
        const priorityOrder = { urgent: 1, important: 2, unnecessary: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const studyPlanElement = document.getElementById('studyPlan');
    studyPlanElement.innerHTML = '';

    tasks.forEach((task) => {
        const taskHours = Math.floor(task.time / 3600);
        const taskMinutes = Math.floor((task.time % 3600) / 60);
        const taskSeconds = task.time % 60;
        const listItem = document.createElement('li');
        listItem.textContent = `${task.name} - ${taskHours}h ${taskMinutes}m ${taskSeconds}s (${task.priority})`;
        studyPlanElement.appendChild(listItem);
    });

    document.getElementById('studyPlanSection').style.display = 'block';
}

function startStudy() {
    document.getElementById('studyPlanSection').style.display = 'none';
    document.getElementById('timerSection').style.display = 'block';
    startNextTask();
}

function startNextTask() {
    if (currentTaskIndex < tasks.length) {
        const currentTask = tasks[currentTaskIndex];
        document.getElementById('currentTask').textContent = `Current Task: ${currentTask.name}`;
        startTimer(currentTask.time);
    } else {
        document.getElementById('timerSection').style.display = 'none';
        document.getElementById('congratulationsSection').style.display = 'block';
        document.getElementById('totalTime').textContent = `Total Time Studied: ${formatTime(totalTimeSpent)}`;
    }
}

function startTimer(duration) {
    let timeRemaining = duration;
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = timeRemaining - elapsed;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            completeTask();
        } else {
            document.getElementById('timer').textContent = formatTime(timeLeft);
        }
    }, 1000);
}

function completeTask() {
    clearInterval(timerInterval);
    const completedTaskTime = tasks[currentTaskIndex].time;
    totalTimeSpent += completedTaskTime;
    currentTaskIndex++;
    startNextTask();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function reset() {
    tasks = [];
    currentTaskIndex = 0;
    totalTimeSpent = 0;
    document.getElementById('savedTasks').innerHTML = '';
    document.getElementById('studyPlanSection').style.display = 'none';
    document.getElementById('congratulationsSection').style.display = 'none';
    document.getElementById('studyPlanButtonSection').style.display = 'none';
}
