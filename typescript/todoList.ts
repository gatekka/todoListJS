const debugMode: boolean = true;
let fileName: string = "tasks.json";
let tasks: Task[] = [];

interface Task {
  taskName: string;
  indexPosition: number;
  isComplete: boolean;
}

const colorText = {
  red(text: string): string {
    return `\x1b[31m${text}\x1b[0m`;
  },
  green(text: string): string {
    return `\x1b[32m${text}\x1b[0m`;
  },
  yellow(text: string): string {
    return `\x1b[33m${text}\x1b[0m`;
  },
  blue(text: string): string {
    return `\x1b[34m${text}\x1b[0m`;
  },
  purple(text: string): string {
    return `\x1b[35m${text}\x1b[0m`;
  },
  cyan(text: string): string {
    return `\x1b[36m${text}\x1b[0m`;
  },
  white(text: string): string {
    return `\x1b[37m${text}\x1b[0m`;
  },
};

function requiredArg(): never {
  throw new Error("Argument required.");
}

async function awaitInputMatch(key: string = ""): Promise<void> {
  switch (key) {
    case "":
      console.log(`\nPress ${colorText.red("Enter")} To Exit`);
      break;
    default:
      console.log(`\nType '${colorText.red(key)}' To Exit`);
      break;
  }
  let isPressedEnter: string;
  do {
    isPressedEnter = await getAnswerFromPrompt("");
  } while (isPressedEnter !== key);
  {
  }
}

async function readFileToString(fileName: string): Promise<string | undefined> {
  const fs = require("fs").promises;
  try {
    let fileContents: string = await fs.readFile(fileName);
    return fileContents;
  } catch (error) {
    switch (error.code) {
      case "ENOENT":
        console.log(
          colorText.cyan(`Not loading tasks as '${fileName}' was not found.\n`),
        );
        break;
      default:
        debugMode ? console.log(error) : null;
        break;
    }
  }
}

async function writeStringToFile(
  content: string = requiredArg(),
  fileName: string = requiredArg(),
): Promise<void> {
  const fs = require("fs").promises;
  try {
    await fs.writeFile(fileName, content);
  } catch (error) {
    debugMode ? console.log(error) : null;
  }
}

async function loadTasksFromFile(): Promise<void> {
  const fileContents = await readFileToString(fileName);
  try {
    if (fileContents !== undefined) {
      tasks = JSON.parse(fileContents);
    }
  } catch (error) {
    debugMode ? console.log(error) : null;
  }
}

function saveTasksToFile(): void {
  tasks = tasks.filter((item) => item !== undefined);
  const tasksToString = JSON.stringify(tasks);
  writeStringToFile(tasksToString, fileName);
}

function checkIfTaskExists(selectedTask: string): boolean {
  if (parseInt(selectedTask) < 1 || parseInt(selectedTask) > tasks.length) {
    console.clear();
    console.log(`${colorText.purple("Task doesn't exist.")}\n`);
    return true;
  } else {
    return false;
  }
}

function checkEmptyTasks(prompt: string): boolean {
  if (tasks.length === 0) {
    console.log(colorText.yellow(prompt));
    main();
    return true;
  }
  return false;
}

function checkEmptyInput(input: string): boolean {
  if (input === "") {
    console.clear();
    main();
    return true;
  }
  return false;
}

function updateIndexPositions(): void {
  tasks.forEach((task, index) => {
    task.indexPosition = index + 1;
  });
}

function createTask(taskName: string): Task {
  return { indexPosition: tasks.length + 1, taskName, isComplete: false };
}

async function addTask(): Promise<void> {
  tasks = tasks.filter((item) => item !== undefined);
  const taskName = await getAnswerFromPrompt("Enter task name: ");

  if (checkEmptyInput(taskName)) return;

  tasks[tasks.length] = createTask(taskName);
  saveTasksToFile();
  console.clear();
  console.log(`Added task: ${taskName}\n`);
  main();
}

async function listTasks(callMain: boolean = true): Promise<void> {
  tasks = tasks.filter((item) => item !== undefined);
  for (let i = 0; i < tasks.length; i++) {
    console.log(
      `[${colorText.blue(tasks[i].indexPosition.toString())}] { Task: ${colorText.green(tasks[i].taskName)}, Complete: ${tasks[i].isComplete ? colorText.green("true") : colorText.yellow("false")} }`,
    );
  }

  if (callMain) {
    await awaitInputMatch();
    console.clear();
    main();
  }
}

async function toggleTaskCompleteStatus(): Promise<void> {
  listTasks(false);
  const selectedTask = await getAnswerFromPrompt(
    "\nSelect task # to complete: ",
  );

  if (checkEmptyInput(selectedTask)) return;
  if (checkIfTaskExists(selectedTask)) {
    toggleTaskCompleteStatus();
    return;
  }

  tasks[parseInt(selectedTask) - 1].isComplete =
    !tasks[parseInt(selectedTask) - 1].isComplete;

  saveTasksToFile();
  console.clear();
  listTasks(false);

  await awaitInputMatch();
  console.clear();
  main();
}

async function deleteTask(): Promise<void> {
  listTasks(false);
  const selectedTask = await getAnswerFromPrompt("\nSelect task # to delete: ");

  if (checkEmptyInput(selectedTask)) return;
  if (checkIfTaskExists(selectedTask)) {
    deleteTask();
    return;
  }

  tasks.splice(parseInt(selectedTask) - 1, 1);
  updateIndexPositions();
  saveTasksToFile();
  console.clear();
  listTasks(false);

  await awaitInputMatch();
  console.clear();
  main();
}

function userInput(input: string): void {
  console.clear();
  switch (input.toLowerCase()) {
    case "1":
      addTask();
      break;
    case "2":
      if (checkEmptyTasks("No tasks to list.\n")) return;
      listTasks();
      break;
    case "3":
      if (checkEmptyTasks("No tasks to complete.\n")) return;
      toggleTaskCompleteStatus();
      break;
    case "4":
      if (checkEmptyTasks("No tasks to delete.\n")) return;
      deleteTask();
      break;
    case "exit":
      process.exit(0);
      break;
    default:
      main();
      break;
  }
}

function getAnswerFromPrompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(question, (answer: string) => {
      readline.close();
      resolve(answer);
    });
  });
}

async function main(): Promise<void> {
  await loadTasksFromFile();
  const answer = await getAnswerFromPrompt(
    `${colorText.blue("1) Add Task\n2) List Tasks\n3) Complete Task\n4) Delete Task\n\n")}${colorText.blue("Type ")}${colorText.red("Exit ")}${colorText.blue("to exit.")} \n\nChoose Option: `,
  );
  userInput(answer);
}

console.clear();
main();
