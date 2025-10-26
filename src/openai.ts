import OpenAI from "openai";
import dotenv from "dotenv";
import type { Stream } from "openai/streaming";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export class ResponsesAPI {
  instructions: string;
  constructor(instructions: string = "") {
    this.instructions = instructions;
  }

  async createResponse({
    input,
  }: {
    input: string;
  }): Promise<OpenAI.Responses.Response> {
    const response = await client.responses.create({
      model: "gpt-5",
      instructions: this.instructions,
      input,
      stream: false,
    });
    return response;
  }

  async createStream({
    input,
  }: {
    input: string;
  }): Promise<Stream<OpenAI.Responses.ResponseStreamEvent>> {
    const response = await client.responses.create({
      model: "gpt-5",
      instructions: this.instructions,
      input,
      stream: true,
    });
    return response;
  }

  async handleStream(rs: ReadableStream) {
    const reader = rs.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let nl;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;

        const evt = JSON.parse(line);
        if (evt.type === "response.output_text.delta")
          process.stdout.write(evt.delta);
        if (evt.type === "response.completed") process.stdout.write("\n");
      }
    }
  }
}
