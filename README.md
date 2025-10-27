# Forever sandbox of OpenAI features: docs, refs and examples

A personal playground and reference repo for exploring **OpenAI’s API features** through minimal, working TypeScript examples.

## Overview

This project serves as both **documentation** and **sandbox** for testing different OpenAI features.  
It runs as a **simple terminal CLI**, where each API feature is encapsulated in its own class.

Current focus: the **Responses API**, with support for both single-response and streaming modes.  
Future additions: the **Conversations API** and other feature examples.

---

## Structure

```
src/
├── index.ts # CLI entry point and user interaction loop
└── openai.ts # Feature classes (e.g., ResponsesAPI)
```

### `index.ts`

Implements a terminal-based chat loop.

- Accepts user input
- Calls the chosen API class
- Displays (streamed) output

Type `/exit` to quit.

### `ResponsesAPI` class

Handles:

- **Single-response requests** (`createResponse`)
- **Streaming responses** (`createStream`)
- **Stream event handling** (`handleStream`)
- **Stream cancelling** (`cancelStream`)

Maintains `previous_response_id` for continuous context.

```ts
const responses = new ResponsesAPI("You are a CLI assistant.");
const stream = await responses.createStream({ input: "Hello" });
await responses.handleStream(stream.toReadableStream());
```

## Scripts

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Build and run the CLI in watch mode |
| `npm run build` | Compile TypeScript using `tsup`     |
| `npm start`     | Run the compiled build              |

## Setup

1. Install dependencies

```
npm i
```

2. Create `.env` file with your OpenAi API key

```
OPENAI_KEY=your_api_key_here
```

3. Run the CLI

```
npm run dev
```

## Future work

Add ConversationAPI for OpenAI’s conversation endpoints

Extend CLI for multi-feature selection

Add more structured examples for embeddings, files, and tools

License

ISC © sutigit
