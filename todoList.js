let tasks = [];

async function addTask() {
  const taskname = await getAnswerFromPrompt("Enter task name: ");
  tasks = tasks.filter(item => item !== undefined);
  console.log(`Added task: ${taskname}`);
  tasks[tasks.length] = { taskname, Checked: false };
  main();
}

function listTasks() {
  for (let i = 0; i < tasks.length; i++) {
    console.log(i);
    console.log(tasks[i]);
  }
  main();
}

function markTaskComplete() {
  main();
}

async function deleteTask() {
  console.log(tasks);
  const selectedTask = await getAnswerFromPrompt("Select task # to delete: ");
  console.clear();
  delete tasks[selectedTask];
  console.log(tasks);
  main();
}

function userInput(input) {
  console.clear();
  switch (parseInt(input)) {
    case 1:
      addTask();
      break;
    case 2:
      listTasks();
      break;
    case 3:
      markTaskComplete();
      break;
    case 4:
      deleteTask();
      break;
    default:
      break;
  }
}

function getAnswerFromPrompt(question) {
  return new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

async function main() {
  const answer = await getAnswerFromPrompt("1) Add Task\n2) List Task\n4) Delete Task\nChoose Option: ");
  userInput(answer);
}

main();
