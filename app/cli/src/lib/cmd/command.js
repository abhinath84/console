import { UsageError } from "../core/errors.js";
import { Generator } from "../assist/generator.js";
function validateName(name) {
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
function validateProjectPath(path) {
    let status = false;
    // project path exists or not
    // project has write permission or not
    return (status);
}
function validateOption(input) {
    const msgs = [];
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
// function ask(project: string) {
//   Utils.display("");
//   const questions: QuestionCollection<InputQuestion> = [
//     {
//       type: "input",
//       name: "package_version",
//       message: "version: ",
//       validate(value: string) {
//         // check for empty string
//         if (validateVersion(value)) {
//           return true;
//         }
//         return "Please enter version in {v.m.p} format";
//       },
//       default() {
//         return ("1.0.0");
//       }
//     },
//     {
//       type: "input",
//       name: "package_description",
//       message: "description",
//       default() {
//         return "";
//       }
//     },
//     {
//       type: "input",
//       name: "package_command",
//       message: "command: ",
//       validate(value: string) {
//         // check for empty string
//         if (validateProjectName(value)) {
//           return true;
//         }
//         // TODO: how to verify proper hostname
//         return "Please enter command name";
//       },
//       default() {
//         return (project);
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
const api = async (input) => {
    const errors = validateOption(input);
    if (errors.length > 0) {
        throw new UsageError(`${errors.join("\n")}`);
    }
    const generator = new Generator();
    await generator.command(input);
    return (Promise.resolve(true));
};
const cli = async (options) => {
    // check --json is valid or not
    if (!options.json) {
        // start inquirer
    }
    // const input: Commands.Command.Input = {
    //   name: "",
    //   json: ""
    // };
    // await api(input);
    return (Promise.resolve(true));
};
export { api, cli };
//# sourceMappingURL=command.js.map