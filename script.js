class Process {
  constructor(id, arrivalTime, burstTime) {
    this.id = id;
    this.arrivalTime = arrivalTime;
    this.burstTime = burstTime;
    this.remainingTime = burstTime;
  }
}

class SJFPreemptiveScheduler {
  constructor() {
    this.processes = [];
  }

  addProcess(id, arrivalTime, burstTime) {
    this.processes.push(new Process(id, arrivalTime, burstTime));
  }

  run() {
    this.processes.sort((a, b) => a.burstTime - b.burstTime);

    let currentTime = 0;
    let currentProcess = null;

    const result = document.getElementById("result");

    while (this.processes.length > 0) {
      let nextProcess = null;
      for (let i = 0; i < this.processes.length; i++) {
        if (this.processes[i].arrivalTime <= currentTime) {
          if (nextProcess === null) {
            nextProcess = this.processes[i];
          } else if (this.processes[i].burstTime < nextProcess.burstTime) {
            nextProcess = this.processes[i];
          }
        }
      }

      if (nextProcess === null) {
        currentTime++;
        continue;
      }

      if (currentProcess !== null && currentProcess.remainingTime > 0) {
        this.processes.push(currentProcess);
      }

      currentProcess = nextProcess;
      this.processes.splice(this.processes.indexOf(nextProcess), 1);

      currentProcess.remainingTime--;
      currentTime++;
      if (currentProcess.remainingTime === 0) {
        const newResult = document.createElement("li");
        newResult.className = "list-group-item list-group-item-success";
        newResult.innerHTML = `Process ${currentProcess.id} finished at time <span class="badge text-bg-secondary">${currentTime}</span>`;
        result.appendChild(newResult);
        currentProcess = null;
      }
    }
  }
}

function addProcess(event) {
  event.preventDefault();

  const id = this.processId.value;
  const arrivalTime = this.arrivalTime.value;
  const burstTime = this.burstTime.value;

  scheduler.addProcess(id, arrivalTime, burstTime);

  const processList = document.getElementById("processList");
  const newProcess = document.createElement("li");
  newProcess.className = "list-group-item";
  newProcess.innerHTML = `Process ${id} (Arrival Time: ${arrivalTime}, Burst Time: ${burstTime})`;
  processList.appendChild(newProcess);

  this.reset();
}

function runScheduler() {
  scheduler.run();
  document.getElementById("runButton").setAttribute("disabled", "true");
}

function resetScheduler() {
  document.getElementById('addProcessForm').reset();
  document.getElementById("processList").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("runButton").removeAttribute("disabled");
}

document.getElementById('addProcessForm').addEventListener('submit', addProcess);
document.getElementById('runButton').addEventListener('click', runScheduler);
document.getElementById('resetButton').addEventListener('click', resetScheduler);

const scheduler = new SJFPreemptiveScheduler();