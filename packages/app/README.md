<div align="center">
  <h1>CONSOLE</h1>
</div>

[![CI/CD pipeline](https://github.com/abhinath84/console/actions/workflows/ci.yml/badge.svg)](https://github.com/abhinath84/console/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@typesys/console.svg?style=flat)](https://www.npmjs.org/package/@typesys/console)
[![npm dependents](https://badgen.net/npm/dependents/@typesys/console)](https://www.npmjs.com/package/@typesys/console?activeTab=dependents)
[![Downloads](https://badgen.net/npm/dt/@typesys/console)](https://www.npmjs.com/package/@typesys/console)

Console generate workspace to implement Command Line Interface (CLI) application. Generated workspace is using **Typescript** as programming language to build the CLI application.

> By default generated workspace based on _native ESM_ module system. Developer can change it to _CommonJS_ if required.

> Need to have understanding of _node.js_ supports for CLI as content of the generated scripts in the workspace are used api provided by node.js for CLI.

- [Installation](#installation)
- [Benefits](#benefits)
- [Usage](#usage)
  - [CLI](#cli)
  - [API](#api)
- [Commands](#commands)
- [Workspace](#workspace)
  - [Structure](#structure)
  - [Architecture/Design](#architecturedesign)
  - [Build](#build)
  - [Run](#run)
  - [Add new command](#add-new-command)

## Installation

```sh
npm install -g @typesys/console
npm install @typesys/console
```

**Warning:** This package is native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and no longer provides a CommonJS export. If your project uses CommonJS, you will have to _convert to ESM_ or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function. Please don't open issues for questions regarding CommonJS / ESM.

## Benefits

- Single package hold same feature in CLI & API form.
- Centralized error handling system.
- Easy to add/remove commands.

## Usage

### CLI

- Create new workspace in current working directory:

```sh
console new <cli-app-name>
console n <cli-app-name>
```

- Create new workspace in custom directory:

```sh
console new <cli-app-name> --path <custom-path>
console n <cli-app-name> -p <custom-path>
```

### API

_console_ comes with an easy to use composable API which help you to generate cli workspace from your javascript/typescript.

- Create new workspace in custom directory:

```ts
import { engine } from "@typesys/console";

engine.load().then(() => {
  // create new workspace
  const input = {
    path: "C:/console/",
    config: {
      npm: true,
      git: true
    },
    package: {
      name: "cli-ws",
      version: "1.0.0",
      description: "",
      command: "cli",
      repository: {
        type: "git",
        url: "",
      },
      bugs: {
        url: "",
      }
      author: "",
      license: "ISC"
    }
  };

  engine.commands.new(input).then(() => console.log("Created !!!"));
});
```

<!-- Provide typedoc generate page link here -->

## Commands

| name                                      | Description                     |
| :---------------------------------------- | :------------------------------ |
| [new](/packages/app/docs/commands/new.md) | Creates a new CLI app workspace |

## Workspace

`new ` command will create a workspace in local directory when you trigger it using CLI or API. In this section we covered information related to generated workspace.

### Structure

below is the generated workspace structure:

```
📦cli-app
┣ 📂node_modules
┣ 📂src
┃ ┣ 📂bin
┃ ┃ ┗ 📜main.ts
┃ ┗ 📂lib
┃ ┃ ┣ 📂assist
┃ ┃ ┃ ┗ 📜.gitkeep
┃ ┃ ┣ 📂cmd
┃ ┃ ┃ ┗ 📜greet.ts
┃ ┃ ┣ 📂core
┃ ┃ ┃ ┣ 📜commands.ts
┃ ┃ ┃ ┣ 📜engine.ts
┃ ┃ ┃ ┗ 📜errors.ts
┃ ┃ ┗ 📂utils
┃ ┃ ┃ ┗ 📜utility.ts
┣ 📜.eslintignore
┣ 📜.eslintrc.json
┣ 📜.gitignore
┣ 📜package-lock.json
┣ 📜package.json
┗ 📜tsconfig.json
```

| Script(s)                  | Description                                                              |
| :------------------------- | :----------------------------------------------------------------------- |
| _src/bin/main.ts_          | Application's entry script                                               |
| _src/lib/core/engine.ts_   | Core engine which orchestrated all commands & it's actions               |
| _src/lib/core/commands.ts_ | Registered all the commands                                              |
| _src/lib/core/errors.ts_   | Centralized error system, implemented custom Error classes & handle them |
| _src/lib/cmd/\*.ts_        | Registered action method for all commands                                |
| _src/lib/utils/\*.ts_      | All utility modules                                                      |
| _src/lib/assist/\*.ts_     | All helper methods, classes related to command action                    |

### Architecture/Design

### Build

To build workspace, trigger `npm run build` command.

### Run

After building the application, you can run the application by:

- Execute `node --no-warnings=ExperimentalWarning ./dist/bin/main.js <command> <options>`

OR

- Execute `npm link`
- Execute `<application-name> <command> <options>`
  > You will found `<application-name>` under `bin` field in package.json file.

### Add new command

**Prerequisite:** Please check [Architecture/Design](#architecturedesign) section before adding new command.

workspace use `commander` npm package to look after parsing the arguments into options and command-arguments, displays usage errors for problems, and implements a help system.

Below steps will add a new command `help` in the workspace, you can follow the same steps to add your new command and modify corresponding fields.

- Open `./src/lib/core/commands.ts` file in code editor.
- Register `help` command by adding a new entry in `program` object and expand it based on your requirement.

```ts
program
  .command("help")
  .alias("h")
  .description("Show information related to passing command")
  .argument("<command>", "command name")
  .option(
    "-y, --yes",
    "Open command information in default browser. [boolean][Default: false]"
  )
  .action((command, options) => engine.action("help", name, options));
```

- Create a new file with the name `help.ts` under `./src/cmd/` directory.
- Open `./src/cmd/help.ts` file in code editor.
- Implement two function with name `api` & `cli` and export them.

```ts
export type HelpInput = {
  name: string;
  browser: boolean;
};

const api = async (input: HelpInput): Promise<void> => {
  // Implement logic

  return Promise.resolve();
};

const cli = async (name: string, options: { yes: boolean }): Promise<void> => {
  const input: HelpInput = {
    name,
    browser: yes
  };

  // Implement user input verification logic
  // Other logic...

  // call api to execute command action
  await api(input);

  return Promise.resolve();
};

export { api, cli };
```

Successfully added new command `help` to the application.

<!-- ## References -->
