let tasks = [];

const colorText = {
  red(text) { return `\x1b[31m${text}\x1b[0m`; },
  green(text) { return `\x1b[32m${text}\x1b[0m`; },
  yellow(text) { return `\x1b[33m${text}\x1b[0m`; },
  blue(text) { return `\x1b[34m${text}\x1b[0m`; },
  purple(text) { return `\x1b[35m${text}\x1b[0m`; },
  cyan(text) { return `\x1b[36m${text}\x1b[0m`; },
  white(text) { return `\x1b[37m${text}\x1b[0m`; },
}

async function awaitInputMatch(key = "") {
  switch (key) {
    case "":
      console.log(`\nPress ${colorText.red("Enter")} To Exit`);
      break;
    default:
      console.log(`\nType '${colorText.red(key)}' To Exit`);
      break;
  }

  let isPressedEnter;
  do {
    isPressedEnter = await getAnswerFromPrompt("");
  } while (isPressedEnter != key) {

  }
}

function createTask(taskName) {
  return { taskName, isComplete: false };
}

async function addTask() {
  const taskName = await getAnswerFromPrompt("Enter task name: ");
  tasks = tasks.filter(item => item !== undefined);
  tasks[tasks.length] = createTask(taskName);
  console.clear();
  console.log(`Added task: ${taskName}\n`);
  main();
}

async function listTasks(callMain = true) {
  tasks = tasks.filter(item => item !== undefined);
  for (let i = 0; i < tasks.length; i++) {
    console.log(`[${colorText.blue(i)}] { Task: ${colorText.green(tasks[i].taskName)}, Complete: ${colorText.yellow(tasks[i].isComplete)} }`);
  }

  if (callMain) {
    await awaitInputMatch();
    console.clear();
    main();
  }
}

async function markTaskComplete() {
  listTasks(false);
  const selectedTask = await getAnswerFromPrompt("\nSelect task # to complete: ");

  tasks[selectedTask].isComplete = true;
  console.clear();
  listTasks(false);

  await awaitInputMatch();
  console.clear();
  main();
}

async function deleteTask() {
  listTasks(false);
  const selectedTask = await getAnswerFromPrompt("\nSelect task # to delete: ");

  delete tasks[selectedTask];
  console.clear();
  listTasks(false);

  await awaitInputMatch();
  console.clear();
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
  const answer = await getAnswerFromPrompt(`${colorText.blue("1) Add Task\n2) List Tasks\n3) Complete Task\n4) Delete Task")}\n\nChoose Option: `);
  userInput(answer);
}

console.clear();
main();
