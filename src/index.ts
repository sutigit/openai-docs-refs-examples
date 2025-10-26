import * as readline from "readline";
import { Responses } from "./openai.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const response = new Responses("You are a CLI assistant.");

rl.question("Input: ", async (input) => {
  const spinner = startSpinner("Thinking");
  const res = await response.completion({ input });
  stopSpinner(spinner);
  console.log("\nOutput:", res);
  rl.close();
});

function startSpinner(text: string): ReturnType<typeof setInterval> {
  const frames = ["|", "/", "-", "\\"];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r${frames[i++ % frames.length]} ${text}`);
  }, 100);
}

function stopSpinner(spinner: ReturnType<typeof setInterval>) {
  clearInterval(spinner);
  process.stdout.write("\r");
}
