import { display } from "@typesys/node";
import { UsageError } from "../core/errors.js";

export type GreetInput = {
  name: string;
  note: string;
};

function validateOption(input: GreetInput): string[] {
  const msgs: string[] = [];

  // validate your name
  if (input.name.length === 0) {
    msgs.push("Please provide a name to greet.");
  }

  return msgs;
}

const api = async (input: GreetInput): Promise<string> => {
  const errors = validateOption(input);
  if (errors.length > 0) {
    throw new UsageError(`${errors.join("\n")}`);
  }

  let greeting = `Hello ${input.name},\nThanks to choose console :)`;
  if (input.note) {
    greeting += `\n\n${input.note}`;
  }

  return (Promise.resolve(greeting));
};

const cli = async (name: string, options: { note: string }): Promise<void> => {
  const input: GreetInput = {
    name,
    note: options.note
  };

  // call api
  const greeting = await api(input);
  display("");
  display(greeting);
  display("");

  return (Promise.resolve());
};

export { api, cli };
