# Forever sandbox of OpenAI features: docs, refs and examples

A personal playground and reference repo for exploring **OpenAI’s API features** through minimal, working TypeScript examples.

## Overview

This project serves as both **documentation** and **sandbox** for testing different OpenAI features.  
It runs as a **simple terminal CLI**, where each API feature is encapsulated in its own class.

Current focus: the **Responses API**, supporting **text streaming** and **JSON-structured streaming** output modes.  
Future additions: the **Conversations API** and other feature examples.

---

## Structure

```
src/
├── index.ts              # CLI entry point and interactive loop
└── openai/
    └── ResponsesAPI.ts   # Wrapper for OpenAI Responses API
```

### `index.ts`

Terminal-based CLI with **mode selection** using arrow keys:

```
Select mode:

> text
  structured output
```

Press **Enter** to confirm.

#### Modes

- **text** — streams plain text responses
- **structured output** — streams JSON responses matching a `zod` schema

After selecting a mode, the CLI enters a continuous chat loop.

Type `/exit` to quit.

### `ResponsesAPI` class

Wrapper for OpenAI’s **Responses API**.

- `createResponse` — single response
- `createStream` — streaming text response
- `createStructuredOutput` — streaming structured JSON output
- `handleStream` — consumes and prints streaming events

Maintains `previous_response_id` to preserve conversational context.

Example (text mode):

```ts
const responses = new ResponsesAPI("You are a CLI assistant.");
const stream = await responses.createStream({ input: "Hello" });
await responses.handleStream(stream.toReadableStream());
```

Example (structured output mode):

```ts
import z from "zod";

const structured = new ResponsesAPI("Extract semantics from input");
const schema = z.object({
  mood: z.string(),
  tone: z.string(),
});

const stream = await structured.createStructuredOutput({
  input: "That was amazing!",
  structure: schema,
});
await structured.handleStream(stream.toReadableStream());
```

---

## Scripts

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Build and run the CLI in watch mode |
| `npm run build` | Compile TypeScript using `tsup`     |
| `npm start`     | Run the compiled build              |

---

## Setup

1. Install dependencies

   ```bash
   npm i
   ```

2. Create `.env` file with your OpenAI API key

   ```bash
   OPENAI_KEY=your_api_key_here
   ```

3. Run the CLI

   ```bash
   npm run dev
   ```

---

## Future work

- Add ConversationAPI for OpenAI’s conversation endpoints
- Extend CLI for multi-feature selection
- Add examples for embeddings, files, and tools

---

**License**  
ISC © sutigit
