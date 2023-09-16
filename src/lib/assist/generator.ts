import path from "path";
import fse from "fs-extra";
import * as fsp from "fs/promises";

import { Commands } from "../core/defs.js";
import { Utils } from "../utils/utility.js";

export class Generator {
  private mTemplate: string;

  private mGenerateInput: Commands.Generate.Input | undefined;

  constructor() {
    const __dirname = Utils.dirname(import.meta.url);
    this.mTemplate = path.resolve(__dirname, "../../../templates");

    this.mGenerateInput = undefined;
  }

  async generate(input: Commands.Generate.Input): Promise<void> {
    this.mGenerateInput = input;

    Utils.display("");

    // remove destination directory if exists
    await this.rmDest();

    // copy items from ./templates/copy/* to 'input.path + input.name'.
    Utils.display("Building structure ...");
    await this.copy();

    // generate package.json
    Utils.display("Generating package.json ...");
    await this.packageJson();

    Utils.display("");

    return (Promise.resolve());
  }

  async command(input: Commands.Command.Input): Promise<void> {
    // validate existing project.
    //  - folder structure (minimal & required)
    //  - file structure (minimal & required)

    // parse core/commands.ts
    // append new command into this file
    const newCommands = this.getNewCommands(input.commands);

    // add [cli, api] methods in 'cmd/' existing file or new file.

    // add file in 'assist' folder.

    return (Promise.resolve());
  }

  private async rmDest(): Promise<void> {
    if (this.mGenerateInput) {
      const dest = path.join(this.mGenerateInput.path, this.mGenerateInput.package.name);
      if (fse.existsSync(dest)) {
        Utils.display("Removing destination directory ...");

        const options = { recursive: true, force: true };
        return (fsp.rm(dest, options));
      }

      return (Promise.resolve());
    }

    throw (new Error("Generator::rmDest : Invalid input handler"));
  }

  private async copy(): Promise<void> {
    if (this.mGenerateInput) {
      const src = path.join(this.mTemplate, "copy");
      const dest = path.join(this.mGenerateInput.path, this.mGenerateInput.package.name);

      await fse.access(path.dirname(dest), fse.constants.R_OK);
      await fse.copy(src, dest);

      return (Promise.resolve());
    }

    throw (new Error("copy::Invalid input"));
  }

  private async packageJson(): Promise<void> {
    if (this.mGenerateInput) {
      const dest = path.join(this.mGenerateInput.path, this.mGenerateInput.package.name);
      const filename = path.join(dest, "package.json");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = {
        name: this.mGenerateInput.package.name,
        version: this.mGenerateInput.package.version,
        description: this.mGenerateInput.package.description,
        type: "module",
        preferGlobal: true,
        bin: {
        },
        main: "./dist/src/bin/main.js",
        scripts: {
          start: "node --no-warnings=ExperimentalWarning ./dist/src/bin/main.js",
          prebuild: "rimraf ./dist",
          build: "npx tsc -p ./tsconfig.json",
          postbuild: "copyfiles ./package.json ./dist/",
          watch: "npx tsc -w -p ./tsconfig.json",
          lint: "npx eslint .",
          "lint:fix": "npx eslint --fix .",
          "lint:gitlab": "set ESLINT_CODE_QUALITY_REPORT=eslint-gitlab-report.json && npx eslint --format gitlab .",
          docs: "jsdoc -p -c ./jsdoc/config.json",
          test: "echo \"Error: no test specified\" && exit 1"
        },
        dependencies: {
          chalk: "^5.2.0",
          commander: "^10.0.0",
          figlet: "^1.5.2",
          inquirer: "^9.1.4",
          npmlog: "^7.0.1"
        },
        devDependencies: {
          "@types/figlet": "^1.5.5",
          "@types/inquirer": "^9.0.3",
          "@types/node": "^18.13.0",
          "@types/npmlog": "^4.1.4",
          "@typescript-eslint/eslint-plugin": "^5.51.0",
          "@typescript-eslint/parser": "^5.51.0",
          copyfiles: "^2.4.1",
          eslint: "^8.34.0",
          "eslint-config-airbnb-base": "^15.0.0",
          "eslint-formatter-gitlab": "^4.0.0",
          "eslint-plugin-import": "^2.27.5",
          tslib: "^2.5.0",
          typescript: "^4.9.5"
        },
        bugs: {
          url: this.mGenerateInput.package.bugs.url
        },
        keywords: [
          "cli",
          "node",
          "commander"
        ],
        author: this.mGenerateInput.package.author,
        license: this.mGenerateInput.package.license
      };

      data.bin[this.mGenerateInput.package.command] = "./dist/src/bin/main.js";
      if (this.mGenerateInput.package.repository.url.length > 0) {
        data.repository = {
          type: this.mGenerateInput.package.repository.type,
          url: this.mGenerateInput.package.repository.url
        };
      }

      await fse.access(dest, fse.constants.R_OK);
      await fse.outputJson(filename, data, { spaces: 2 });

      return (Promise.resolve());
    }

    throw (new Error("copy::Invalid input"));
  }

  private getNewCommands(commands: Commands.Command.Argument[]): string {
    const newCommands = "";

    commands.forEach((element) => {
      // use hbs to create this string.
    });

    return ("");
  }
}
