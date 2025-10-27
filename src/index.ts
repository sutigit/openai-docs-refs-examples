import * as readline from "readline";
import { ResponsesAPI } from "./openai/ResponsesAPI.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const responses = new ResponsesAPI("You are a CLI assistant.");

async function ask() {
  rl.question("Input (or /exit): ", async (input) => {
    if (input.trim() === "/exit") {
      rl.close();
      return;
    }
    const spinner = startSpinner("Thinking");
    const stream = await responses.createStream({ input });
    stopSpinner(spinner);
    await responses.handleStream(stream.toReadableStream());
    ask();
  });
}

ask();

function startSpinner(text: string): ReturnType<typeof setInterval> {
  const frames = ["|", "/", "-", "\\"];
  let i = 0;
  return setInterval(
    () => process.stdout.write(`\r${frames[i++ % frames.length]} ${text}`),
    100
  );
}

function stopSpinner(spinner: ReturnType<typeof setInterval>) {
  clearInterval(spinner);
  process.stdout.write("\r");
}
