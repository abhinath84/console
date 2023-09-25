<div align="center">
  <h1>CONSOLE</h1>
</div>

[![CI/CD pipeline](https://github.com/abhinath84/console/actions/workflows/ci.yml/badge.svg)](https://github.com/abhinath84/console/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@typesys/console.svg?style=flat)](https://www.npmjs.org/package/@typesys/console)
[![npm dependents](https://badgen.net/npm/dependents/@typesys/console)](https://www.npmjs.com/package/@typesys/console?activeTab=dependents)
[![Downloads](https://badgen.net/npm/dt/@typesys/console)](https://www.npmjs.com/package/@typesys/console)

Application to generate workspace to implement Command Line Interface (CLI) application.

- [Installation](#installation)
- [Quick Start](#quick-start)
  - [CLI](#cli)
  - [API](#api)
- [Commands](#commands)

## Installation

```sh
npm install -g @typesys/console
npm install @typesys/console
```

**Warning:** This package is native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and no longer provides a CommonJS export. If your project uses CommonJS, you will have to _convert to ESM_ or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function. Please don't open issues for questions regarding CommonJS / ESM.

## Quick Start

### CLI

- Create new workspace in current working directory:

```sh
console new <cli-app-name>
console n <cli-app-name>
```

- Create new workspace in current working directory:

```sh
console new <cli-app-name> --path <destination-directory>
console n <cli-app-name> -p <destination-directory>
```

### API

_console_ comes with an easy to use composable API which help you to generate cli workspace from your javascript/typescript.

```ts
import { engine } from "@typesys/console";

engine.load().then(() => {
  // create new workspace
  const input = {
    name: "cli-ws",
    path: "C:/console/",
    config: {
      npm: true,
      git: true
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

<!-- ## References -->
