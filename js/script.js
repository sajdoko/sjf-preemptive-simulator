class Process {
  constructor(id, arrivalTime, burstTime) {
    this.id = id;
    this.arrivalTime = arrivalTime;
    this.burstTime = burstTime;
    this.remainingTime = burstTime;
    this.completionTime = 0;
    this.waitingTime = 0;
    this.turnaroundTime = 0;
  }
}

class SJFPreemptiveScheduler {
  constructor() {
    this.processes = [];
  }

  addProcess(id, arrivalTime, burstTime) {
    this.processes.push(new Process(id, arrivalTime, burstTime));
  }

  clearProcesses() {
    this.processes = [];
  }

  run() {
    // Sort processes by arrival time
    this.processes.sort(function (p1, p2) {
      return p1.arrivalTime - p2.arrivalTime;
    });

    // Initialize current time and completed process count
    let currentTime = 0;
    let largestTime = 0;
    let completedProcesses = 0;
    let n = this.processes.length;

    // Find the full burst time of all processes
    for (let pcs in this.processes) {
      largestTime += pcs.burstTime;
    }

    // Initialize an array to hold the order of process execution for each time unit
    let executionOrder = [];

    // Execute processes until all are completed
    while (completedProcesses < n) {
      let nextProcess = -1;
      let minRemainingTime = Number.MAX_VALUE;

      // Find the next process to execute
      for (let i = 0; i < n; i++) {
        if (
          this.processes[i].arrivalTime <= currentTime &&
          this.processes[i].remainingTime < minRemainingTime &&
          this.processes[i].remainingTime > 0
        ) {
          nextProcess = i;
          minRemainingTime = this.processes[i].remainingTime;
        }
      }

      // If no process is found to execute, increment current time
      if (nextProcess == -1) {
        currentTime++;
        continue;
      }

      executionOrder[currentTime] = nextProcess;

      // Execute the next process
      this.processes[nextProcess].remainingTime--;
      currentTime++;

      // Check if the process has completed
      if (this.processes[nextProcess].remainingTime == 0) {
        completedProcesses++;
        this.processes[nextProcess].completionTime = currentTime;
        this.processes[nextProcess].waitingTime =
          this.processes[nextProcess].completionTime -
          this.processes[nextProcess].arrivalTime -
          this.processes[nextProcess].burstTime;
        this.processes[nextProcess].turnaroundTime =
          this.processes[nextProcess].completionTime -
          this.processes[nextProcess].arrivalTime;
      }
    }

    // Calculate average waiting time and turnaround time
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    for (let i = 0; i < n; i++) {
      totalWaitingTime += this.processes[i].waitingTime;
      totalTurnaroundTime += this.processes[i].turnaroundTime;
    }
    let avgWaitingTime = totalWaitingTime / n;

    let avgTurnaroundTime = totalTurnaroundTime / n;

    const result = document.getElementById("result");

    const newResult = document.createElement("li");
    newResult.className = "list-group-item list-group-item-success";
    newResult.innerHTML = `Average waiting time: <span class="badge text-bg-secondary">${avgWaitingTime}</span>`;
    result.appendChild(newResult);

    const newResult2 = document.createElement("li");
    newResult2.className = "list-group-item list-group-item-success";
    newResult2.innerHTML = `Average turnaround time: <span class="badge text-bg-secondary">${avgTurnaroundTime}</span>`;
    result.appendChild(newResult2);

    let resultsTable = document.getElementById("resultsTable");

    console.log(executionOrder);

    for (const [key, proc] of Object.entries(this.processes)) {
      resultsTable.rows[parseInt(key) + 1].cells[3].innerHTML =
        proc.completionTime;
      resultsTable.rows[parseInt(key) + 1].cells[4].innerHTML =
        proc.turnaroundTime;
      resultsTable.rows[parseInt(key) + 1].cells[5].innerHTML =
        proc.waitingTime;
    }
    console.table(this.processes, [
      "id",
      "arrivalTime",
      "burstTime",
      "completionTime",
      "turnaroundTime",
      "waitingTime",
    ]);
  }
}

function addProcess(event) {
  event.preventDefault();

  const id = parseInt(this.processId.value);
  const arrivalTime = parseInt(this.arrivalTime.value);
  const burstTime = parseInt(this.burstTime.value);

  scheduler.addProcess(id, arrivalTime, burstTime);
  addResutlRowToTable(id, arrivalTime, burstTime);

  this.reset();
}

function addResutlRowToTable(
  id,
  arrivalTime,
  burstTime,
  completionTime = 0,
  turnaroundTime = 0,
  waitingTime = 0
) {
  let table = document
    .getElementById("resultsTable")
    .getElementsByTagName("tbody")[0];
  let row = table.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  let cell6 = row.insertCell(5);
  cell1.innerHTML = `P${id}`;
  cell2.innerHTML = arrivalTime;
  cell3.innerHTML = burstTime;
  cell4.innerHTML = completionTime;
  cell5.innerHTML = turnaroundTime;
  cell6.innerHTML = waitingTime;
}

function runScheduler() {
  scheduler.run();
  document.getElementById("runButton").setAttribute("disabled", "true");
}

function resetScheduler() {
  scheduler.clearProcesses();
  document.getElementById("addProcessForm").reset();
  document.getElementById("runButton").removeAttribute("disabled");
  document.getElementById("result").innerHTML = "";
  document
    .getElementById("resultsTable")
    .getElementsByTagName("tbody")[0].innerHTML = "";
}

document
  .getElementById("addProcessForm")
  .addEventListener("submit", addProcess);
document.getElementById("runButton").addEventListener("click", runScheduler);
document
  .getElementById("resetButton")
  .addEventListener("click", resetScheduler);

const scheduler = new SJFPreemptiveScheduler();
