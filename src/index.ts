import * as readline from "readline";
import { ResponsesAPI } from "./openai/ResponsesAPI.js";
import z from "zod";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
readline.emitKeypressEvents(process.stdin, rl);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

const streaming = new ResponsesAPI("You are a CLI assistant.");
const structured = new ResponsesAPI("Extract semantics from given input");

let useStructured = false;
const options = ["text", "structured output"];
let selected = 0;

function renderMenu() {
  process.stdout.write("\x1Bc"); // clear
  console.log("Select mode:\n");
  options.forEach((opt, i) => {
    console.log(`${i === selected ? ">" : " "} ${opt}`);
  });
}

function chooseMode() {
  renderMenu();
  const onKey = (_: unknown, key: any) => {
    if (!key) return;
    if (key.name === "up")
      selected = (selected - 1 + options.length) % options.length;
    else if (key.name === "down") selected = (selected + 1) % options.length;
    else if (key.name === "return") {
      process.stdin.removeListener("keypress", onKey);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      useStructured = selected === 1;
      process.stdout.write("\x1Bc");
      console.log(`Mode: ${options[selected]}\n`);
      ask();
      return; // prevent extra render after selecting
    } else if (key.name === "c" && key.ctrl) {
      process.exit(0);
    }
    renderMenu();
  };
  process.stdin.on("keypress", onKey);
}

async function ask() {
  rl.question("Input (or /exit): ", async (input) => {
    if (input.trim() === "/exit") {
      rl.close();
      return;
    }
    const spinner = startSpinner("Thinking");
    if (useStructured) {
      stopSpinner(spinner);
      const structure = z.object({
        mood: z.string(),
        tone: z.string(),
      });
      const structout = await structured.createStructuredOutput({
        input,
        structure,
      });
      await structured.handleStream(structout.toReadableStream());
    } else {
      const stream = await streaming.createStream({ input });
      stopSpinner(spinner);
      await streaming.handleStream(stream.toReadableStream());
    }
    ask();
  });
}

chooseMode();

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
