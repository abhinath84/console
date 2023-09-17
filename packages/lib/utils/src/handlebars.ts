// import { readFile } from "fs/promises";
// import Handlebars from "handlebars";

// import { exists } from "./filesystem.js";

// export class Handlebar {
//   #instance: typeof Handlebars;

//   constructor() {
//     this.#instance = Handlebars.create();
//   }

//   async compile(file: string, context: any, helpers?: ) {
//     if (exists(file)) {
//       const hbs = Handlebars.create();
//       hbs.registerHelper('toLower', function(str) {
//         return str.toLowerCase();
//       });

//       const text = await readFile(file, "utf8");
//       const template = hbs.compile(text);
//       const content = template(context);

//       return (content);
//     }

//     throw (new Error(`compile:: '${file}' file doesn't exists`));
//   }
// }
