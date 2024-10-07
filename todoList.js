let tasks = [];

// function colorText(text, colorCode) {
//   return `\x1b[${colorCode}m${text}\x1b[0m`;
// }

const colorText = {
  red(text) { return `\x1b[31m${text}\x1b[0m`; },
  green(text) { return `\x1b[32m${text}\x1b[0m`; },
  yellow(text) { return `\x1b[33m${text}\x1b[0m`; },
  blue(text) { return `\x1b[34m${text}\x1b[0m`; },
  purple(text) { return `\x1b[35m${text}\x1b[0m`; },
  cyan(text) { return `\x1b[36m${text}\x1b[0m`; },
  white(text) { return `\x1b[37m${text}\x1b[0m`; },
}

function createTask(taskName) {
  return { taskName, Checked: false };
}

async function addTask() {
  const taskName = await getAnswerFromPrompt("Enter task name: ");
  tasks = tasks.filter(item => item !== undefined);
  // tasks[tasks.length] = { taskName, Checked: false };
  tasks[tasks.length] = createTask(taskName);
  console.clear();
  console.log(`Added task: ${taskName}\n`);
  main();
}

function listTasks(callMain = true) {
  tasks = tasks.filter(item => item !== undefined);
  for (let i = 0; i < tasks.length; i++) {
    // console.log(tasks[i]);
    // console.log(`[${colorText(i, 34)}] { Task: ${colorText(tasks[i].taskName, 32)}, Checked: ${colorText(tasks[i].Checked, 33)} }`);
    console.log(`[${colorText.blue(i)}] { Task: ${colorText.green(tasks[i].taskName)}, Checked: ${colorText.yellow(tasks[i].Checked)} }`);
  }
  console.log();

  if (callMain) {
    main();
  }
}

function markTaskComplete() {
  main();
}

async function deleteTask() {
  listTasks(false);
  const selectedTask = await getAnswerFromPrompt("Select task # to delete: ");
  console.clear();
  delete tasks[selectedTask];
  listTasks(false);
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
  const answer = await getAnswerFromPrompt("1) Add Task\n2) List Task\n4) Delete Task\n\nChoose Option: ");
  userInput(answer);
}

console.clear();
main();
