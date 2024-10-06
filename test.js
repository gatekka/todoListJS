function addTask() {
  // const task = {
  // }
}

function listTasks() {

}

function markTaskComplete() {

}

function deleteTask() {

}

function userInput(input) {
  switch (parseInt(input)) {
    case 1:
      addTask();
      console.log("Adding Task");
      break;
    case 2:
      listTasks();
      console.log("Listing Tasks");
      break;
    case 3:
      break;
    case 4:
      break;
    default:
      break;
  }
}

function askAndReceive(question) {
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
  const userOutput = await askAndReceive("Banana or Hotdog?\nChoice: ");
  console.log(`Received the output: ${userOutput}`);

  const userOutput2 = await askAndReceive("1) Add Task\n2) List Task\nChoose Option: ");
  console.log(`Received the output: ${userOutput2}`);
}

main();
