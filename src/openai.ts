import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export class Responses {
  instructions: string;
  constructor(instructions: string = "") {
    this.instructions = instructions;
  }

  async completion({ input }: { input: string }): Promise<string> {
    const response = await client.responses.create({
      model: "gpt-5",
      instructions: this.instructions,
      input,
      stream: false,
    });
    return response.output_text;
  }
}
