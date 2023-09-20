// import path from "path";
import { existsSync } from "fs";
import * as fsp from "fs/promises";
import Handlebars from "handlebars";

export async function compile(file: string, input: any) {
  if (existsSync(file)) {
    const hbs = Handlebars.create();
    const text = await fsp.readFile(file, "utf8");

    const template = hbs.compile(text);
    const content = template(input);

    return (content);
  }

  throw (new Error(`compile:: '${file}' file doesn't exists`));
}
