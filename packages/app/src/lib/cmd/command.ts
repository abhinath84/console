import path from "path";
import { access, constants } from "fs/promises";
import inquirer, { QuestionCollection } from "inquirer";

// import { parse } from "@babel/parser";
// import generate from "@babel/generator";

// import { Commands } from "../core/defs.js";
import { UsageError } from "../core/errors.js";
import { Utils } from "../utils/utility.js";
import { CommandInput, Generator } from "../assist/generator.js";

function validateName(name: string): boolean {
  let valid = false;

  // check uppercase
  if (!name.match(/[A-Z]/)) {
    valid = true;

    // check space
    // check special character
    const invalidChars = ["\\", "/", ":", "*", "?", "\"", "<", ">", "|", " "];
    for (let i = 0; i < invalidChars.length; i += 1) {
      if (name.includes(invalidChars[i])) {
        valid = false;
        break;
      }
    }
  }

  return (valid);
}

function validateProjectPath(path: string): boolean {
  const status = false;
  // project path exists or not
  // project has write permission or not

  return (status);
}

function validateInput(input: CommandInput): string[] {
  const msgs: string[] = [];

  // validate project name
  if (!validateName(input.project)) {
    msgs.push(`Invalid command name: '${input.project}'.`);
  }

  // validate project name
  if (!validateProjectPath(input.project)) {
    msgs.push(`Issue with project path: '${input.project}'. Either path doesn't have write permission or not exist.`);
  }

  return msgs;
}

function validateCommandJson(json: string): string[] {
  // is empty string?
  // is file exists?
  // validate command json object
  // project?
  // commands?

  return ([]);
}

type InputQuestion = {
  // package_name: string;
  package_version: string;
  package_description: string;
  package_command: string;
  package_repo_url: string;
  package_bugs_url: string;
  package_author: string;
  package_license: string;
};

// function ask() {
//   Utils.display("");

//   const questions: QuestionCollection<InputQuestion> = [
//     {
//       type: "input",
//       name: "project",
//       message: "Existing project path: ",
//       validate(value: string) {
//         // // check for empty string
//         // if (validateProject(value)) {
//         //   return true;
//         // }

//         return "Please enter project path";
//       }
//     },
//     {
//       type: "input",
//       name: "command_name",
//       message: "Command name: ",
//       validate(value: string) {
//         // // check for empty string
//         // if (validateCommandName(value)) {
//         //   return true;
//         // }

//         return "Please enter valid command name";
//       }
//     },
//     {
//       type: "input",
//       name: "command_alias",
//       message: "command: ",
//       validate(value: string) {
//         // // check for empty string
//         // if (validateAlias(value)) {
//         //   return true;
//         // }

//         // TODO: how to verify proper hostname
//         return "Please enter valid command alias";
//       },
//       default() {
//         return ("");
//       }
//     },
//     {
//       type: "input",
//       name: "package_repo_url",
//       message: "git repository",
//       validate(value: string) {
//         if (value === "") {
//           return true;
//         }

//         if (validateHttpUrl(value)) {
//           return true;
//         }

//         // TODO: how to verify proper hostname
//         return "Please enter valid url";
//       },
//       default() {
//         return "";
//       },
//     },
//     {
//       type: "input",
//       name: "package_bugs_url",
//       message: "bugs report url",
//       validate(value: string) {
//         if (value === "") {
//           return true;
//         }

//         if (validateHttpUrl(value)) {
//           return true;
//         }

//         // TODO: how to verify proper hostname
//         return "Please enter valid url";
//       },
//       default() {
//         return "";
//       },
//     },
//     {
//       type: "input",
//       name: "package_author",
//       message: "author",
//       default() {
//         return "";
//       },
//     },
//     {
//       type: "input",
//       name: "package_license",
//       message: "license: ",
//       validate(value: string) {
//         // check for empty string
//         if (validateLicense(value)) {
//           return true;
//         }

//         // TODO: how to verify proper hostname
//         return "License should be a valid SPDX license expression.";
//       },
//       default() {
//         return "ISC";
//       },
//     }
//   ];

//   return inquirer.prompt(questions);
// }

// const defaultInput: Commands.Generate.Input = {
//   path: process.cwd(),
//   package: {
//     name: "",
//     version: "1.0.0",
//     description: "",
//     command: "",
//     repository: {
//       type: "git",
//       url: ""
//     },
//     bugs: {
//       url: ""
//     },
//     author: "",
//     license: "ISC"
//   }
// };

const api = async (input: CommandInput): Promise<boolean> => {
  const errors = validateInput(input);
  if (errors.length > 0) {
    throw new UsageError(`${errors.join("\n")}`);
  }

  const generator = new Generator();
  await generator.command(input);

  return (Promise.resolve(true));
};

const cli = async (json: string): Promise<boolean> => {
  // check --json is valid or not
  const errors = validateCommandJson(json);
  if (errors.length > 0) {
    throw new UsageError(`${errors.join("\n")}`);
  }

  // const input: CommandInput = {
  //   name: "",
  //   json: ""
  // };

  // await api(input);

  return (Promise.resolve(true));
};

export { api, cli };
