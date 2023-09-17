import path from "path";
import { access, constants } from "fs/promises";
import inquirer, { QuestionCollection } from "inquirer";
// import isValidSPDX from "spdx-expression-validate";
// import isUrlHttp from "is-url-http";

import { Commands } from "../core/defs.js";
import { UsageError } from "../core/errors.js";
import { Utils } from "../utils/utility.js";
import { Generator } from "../assist/generator.js";

const isValidSPDX = Utils.require("spdx-expression-validate");

function validateProjectName(name: string): boolean {
  const invalidChars = ["\\", "/", ":", "*", "?", "\"", "<", ">", "|", " "];
  let valid = false;

  // check uppercase
  if (!name.match(/[A-Z]/)) {
    valid = true;

    // check space
    // check special character
    for (let i = 0; i < invalidChars.length; i += 1) {
      if (name.includes(invalidChars[i])) {
        valid = false;
        break;
      }
    }
  }

  return (valid);
}

function validateVersion(version: string): boolean {
  const pattern = /^[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,3}$/;
  return (pattern.test(version));
}

function validateHttpUrl(url: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" // protocol
      + "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" // domain name
      + "((\\d{1,3}\\.){3}\\d{1,3}))" // OR ip (v4) address
      + "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" // port and path
      + "(\\?[;&a-z\\d%_.~+=-]*)?" // query string
      + "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i",
  );

  return (pattern.test(url));
  // return (isUrlHttp(url));
}

function validateLicense(name: string): boolean {
  return (isValidSPDX(name));
}

function validateOption(input: Commands.Generate.Input): string[] {
  const msgs: string[] = [];

  // validate project name
  if (!validateProjectName(input.package.name)) {
    msgs.push(`Invalid project name: '${input.package.name}'.`);
  }

  // validate version
  if (!validateVersion(input.package.version)) {
    msgs.push(`Invalid version: ${input.package.version}`);
  }

  // validate command
  if (!validateProjectName(input.package.command)) {
    msgs.push(`Invalid command name: '${input.package.command}'.`);
  }

  // check git repository url
  if (input.package.repository.url !== "" && !validateHttpUrl(input.package.repository.url)) {
    msgs.push(`Invalid git repository url: ${input.package.repository.url}`);
  }

  // check bug url
  if (input.package.bugs.url !== "" && !validateHttpUrl(input.package.bugs.url)) {
    msgs.push(`Invalid bug url: ${input.package.repository.url}`);
  }

  // check license name
  if (!validateLicense(input.package.license)) {
    msgs.push(`${input.package.license}; License should be a valid SPDX license expression.`);
  }

  return msgs;
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

function ask(project: string) {
  // {
  //   type: "input",
  //   name: "package_name",
  //   message: "package name: ",
  //   validate(value: Answers) {
  //     // check for empty string
  //     if (value.length > 0) {
  //       return true;
  //     }

  //     // TODO: how to verify proper hostname
  //     return "Please enter package name";
  //   },
  //   default() {
  //     return (project);
  //   }
  // },

  Utils.display("");

  const questions: QuestionCollection<InputQuestion> = [
    {
      type: "input",
      name: "package_version",
      message: "version: ",
      validate(value: string) {
        // check for empty string
        if (validateVersion(value)) {
          return true;
        }

        return "Please enter version in {v.m.p} format";
      },
      default() {
        return ("1.0.0");
      },
    },
    {
      type: "input",
      name: "package_description",
      message: "description",
      default() {
        return "";
      },
    },
    {
      type: "input",
      name: "package_command",
      message: "command: ",
      validate(value: string) {
        // check for empty string
        if (validateProjectName(value)) {
          return true;
        }

        // TODO: how to verify proper hostname
        return "Please enter command name";
      },
      default() {
        return (project);
      },
    },
    {
      type: "input",
      name: "package_repo_url",
      message: "git repository",
      validate(value: string) {
        if (value === "") {
          return true;
        }

        if (validateHttpUrl(value)) {
          return true;
        }

        // TODO: how to verify proper hostname
        return "Please enter valid url";
      },
      default() {
        return "";
      },
    },
    {
      type: "input",
      name: "package_bugs_url",
      message: "bugs report url",
      validate(value: string) {
        if (value === "") {
          return true;
        }

        if (validateHttpUrl(value)) {
          return true;
        }

        // TODO: how to verify proper hostname
        return "Please enter valid url";
      },
      default() {
        return "";
      },
    },
    {
      type: "input",
      name: "package_author",
      message: "author",
      default() {
        return "";
      },
    },
    {
      type: "input",
      name: "package_license",
      message: "license: ",
      validate(value: string) {
        // check for empty string
        if (validateLicense(value)) {
          return true;
        }

        // TODO: how to verify proper hostname
        return "License should be a valid SPDX license expression.";
      },
      default() {
        return "ISC";
      },
    },
  ];

  return inquirer.prompt(questions);
}

function shouldRemoveDestination(destination: string) {
  // eslint-disable-next-line no-bitwise
  return (access(destination, constants.R_OK | constants.W_OK)
    .then(() => {
      // ask for removal
      Utils.display("");
      const questions: QuestionCollection<{ ok: boolean }> = [
        {
          type: "confirm",
          name: "ok",
          message: `"${destination}" is exists.\nProcess will remove this directory, are you ok?`,
          default: true,
        },
      ];

      return (inquirer.prompt(questions)
        .then((answer) => Promise.resolve(answer.ok))
        .catch((err) => Promise.reject(err))
      );
    })
    .catch(() => (Promise.resolve(true)))
  );
}

function verify(input: Commands.Generate.Input) {
  Utils.display("");
  Utils.display(JSON.stringify(input, null, 2));
  Utils.display("");

  const questions: QuestionCollection<{ ok: boolean }> = [
    {
      type: "confirm",
      name: "ok",
      message: "Is this Ok?",
      default: true,
    },
  ];

  return inquirer.prompt(questions);
}

const defaultInput: Commands.Generate.Input = {
  path: process.cwd(),
  package: {
    name: "",
    version: "1.0.0",
    description: "",
    command: "",
    repository: {
      type: "git",
      url: "",
    },
    bugs: {
      url: "",
    },
    author: "",
    license: "ISC",
  },
};

const api = async (input: Commands.Generate.Input): Promise<boolean> => {
  const errors = validateOption(input);
  if (errors.length > 0) {
    throw new UsageError(`${errors.join("\n")}`);
  }

  const generator = new Generator();
  await generator.generate(input);

  return (Promise.resolve(true));
};

const cli = async (project: string, options: { yes: boolean, path: string }): Promise<boolean> => {
  const input: Commands.Generate.Input = defaultInput;

  // specify project path
  if (options.path) {
    input.path = options.path;
  }

  try {
    // ask permission to delete existing project folder.
    const dest = path.join(input.path, project);
    const should = await shouldRemoveDestination(dest);
    if (should) {
      if (options.yes) {
        input.package.name = project;
        input.package.command = project;
      } else {
        // ask for the user input
        const answers = await ask(project);

        // fill input by user's answers
        // input.package.name = answers.package_name;
        input.package.name = project;
        input.package.version = answers.package_version;
        input.package.description = answers.package_description;
        input.package.command = answers.package_command;
        input.package.repository.url = answers.package_repo_url;
        input.package.bugs.url = answers.package_bugs_url;
        input.package.author = answers.package_author;
        input.package.license = answers.package_license;
      }

      // verify user input
      const answer = await verify(input);
      if (!answer.ok) {
        Utils.display("Aborted !!!");

        return (Promise.resolve(false));
      }

      // call api to generate project
      Utils.display("");
      Utils.display("Started ...");
      const response = await api(input);
      Utils.display("Completed ...");

      return (response);
    }

    Utils.display("Aborted!");
    return (Promise.resolve(false));
  } catch (err) {
    return (Promise.reject(err));
  }
};

export { api, cli };
