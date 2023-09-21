import path from "path";
import { statSync } from "fs";
import * as fsp from "fs/promises";
import chalk from "chalk";
import {
  FileInfo,
  esm,
  exists,
  copy,
  files,
  writeLine,
  overwriteLine,
  clearLine,
  display,
  spawnAsync,
  Spinner,
  Frames,
  Colors
} from "@typesys/node";
import { TObject, Assert } from "@typesys/validation";

import { UsageError } from "../core/errors.js";
import * as Handlebars from "../utils/handlebars.js";

const __dirname = esm.dirname(import.meta.url);

export type GenerateInput = {
  path: string;
  config: {
    npm: boolean;
    git: boolean;
  };
  package: {
    name: string;
    version: string;
    description: string;
    command: string;
    repository: {
      type: string;
      url: string;
    };
    bugs: {
      url: string;
    }
    author: string;
    license: string;
  };
};

export type CommandArgument = {
  name: string;
  alias?: string;
  description: string;
  arguments: {
    name: string;
    description?: string;
    defaultValue?: string | boolean | string[];
  }[],
  options: {
    flags: string;
    description?: string;
    defaultValue?: string | boolean | string[];
  }[],
  action: string;
  cmd: {
    new: boolean;
    file?: string;
  }
};

export type CommandInput = {
  project: string;
  commands: CommandArgument[]
};

export class Generator {
  #template: string;

  #templateConfig: TObject | undefined;

  #generateInput: GenerateInput | undefined;

  constructor() {
    this.#template = path.resolve(__dirname, "../../../templates");
    this.#templateConfig = undefined;
    this.#generateInput = undefined;
  }

  async generate(input: GenerateInput): Promise<void> {
    this.#generateInput = input;

    this.#templateConfig = await this.#config();

    // remove destination directory if exists
    await this.#remove();

    // copy items from ./templates/copy/* to 'input.path + input.name'.
    await this.#copy();

    // hbs folder handle
    await this.#hbs();

    // do npm install
    await this.#npm();

    // git related stuff
    await this.#gitInit();
  }

  // async command(input: CommandInput): Promise<void> {
  //   // validate existing project.
  //   //  - folder structure (minimal & required)
  //   //  - file structure (minimal & required)

  //   // parse core/commands.ts
  //   // append new command into this file
  //   const newCommands = this.getNewCommands(input.commands);

  //   // add [cli, api] methods in 'cmd/' existing file or new file.

  //   // add file in 'assist' folder.

  //   return (Promise.resolve());
  // }

  async #config() {
    const dest = path.join(this.#template, "config.js");
    if (exists(dest)) {
      return (esm.load(dest));
    }
    return (undefined);
  }

  async #remove(): Promise<void> {
    Assert.defined(this.#generateInput, "Generator::#remove : Invalid input handler");

    try {
      const dest = path.join(this.#generateInput.path, this.#generateInput.package.name);
      if (exists(dest)) {
        const spinner = new Spinner(
          Frames.arc,
          Colors.red,
          `${chalk.red("REMOVING")} existing destination directory`
        );
        spinner.start();

        const options = { recursive: true, force: true };
        await fsp.rm(dest, options);

        spinner.stop();
        overwriteLine(`${chalk.red("REMOVE")} existing destination directory`);
      }

      return (Promise.resolve());
    } catch (err) {
      clearLine();
      throw (new UsageError((<Error>err).message));
    }
  }

  async #copy(): Promise<void> {
    Assert.defined(this.#generateInput, "Generator::#copy : Invalid input handler");

    const src = path.join(this.#template, "copy");
    const dest = path.join(this.#generateInput.path, this.#generateInput.package.name);

    // await fse.access(path.dirname(dest), fse.constants.R_OK);
    // await fse.copy(src, dest);

    const fileCopyCB = (source: string, destination: string, error: Error | null): void => {
      if (error === null) this.#writeCreateMsg(destination);
    };
    await copy(src, dest, fileCopyCB);

    return (Promise.resolve());
  }

  async #hbs(): Promise<void> {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");

    const src = path.join(this.#template, "hbs");
    // const dest = path.join(this.#generateInput.path, this.#generateInput.name);

    // // collect all files under 'hbs' directory in an array format.
    const fileList = await files(src, { recursive: true });

    // create destination file out of them.
    const promises = fileList.map((file) => this.#compile(file));
    await Promise.all(promises);

    return (Promise.resolve());
  }

  async #npm(): Promise<void> {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");

    const dest = path.join(this.#generateInput.path, this.#generateInput.package.name);
    const packageFile = path.join(dest, "package.json");

    Assert.ok(exists(packageFile), "package.json file doesn't exists");

    if (this.#generateInput.config.npm) return (this.#npmInstall());
    return (this.#npmWrite());
  }

  async #gitInit(): Promise<void> {
    Assert.defined(this.#generateInput, "Generator::#gitInit::Invalid input");

    if (this.#generateInput.config.git) {
      const spinner = new Spinner(Frames.arc, Colors.cyan, "Initializing git...");
      spinner.start();

      try {
        const dest = path.join(this.#generateInput.path, this.#generateInput.package.name);
        await spawnAsync("git", ["init"], { cwd: dest });

        // overwrite(`Initializing git...`);(`Adding file contents to the index in git...`);
        await spawnAsync("git", ["add", "--all"], { cwd: dest });

        // overwrite(`Committing changes to the repository in git...`);
        const { stderr } = await spawnAsync("git", ["commit", "-am", "Initial Commit"], { cwd: dest });
        spinner.stop();
        if (stderr.length > 0) display(stderr);
        overwriteLine(`${chalk.cyan("√")} Successfully initialized git.`);
      } catch (err) {
        spinner.stop();
        clearLine();
        display(err);
        overwriteLine(`${chalk.red("X")} Git initialization Failed.`);

        return (Promise.resolve());
      }
    }

    return (Promise.resolve());
  }

  async #compile(file: FileInfo) {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");
    Assert.ok(Generator.#validateHbsExtension(file.name), "Generator::Invalid Handlebars file");

    // compile with current inputs
    const src = path.join(file.path, file.name);
    const content = await Handlebars.compile(src, this.#generateInput);

    // write compiled content on destination file
    const pos = file.path.indexOf("hbs");
    const restPath = file.path.substring(pos + 3);
    const destDir = path.join(this.#generateInput.path, restPath, this.#generateInput.package.name);
    const destFile = file.name.substring(0, (file.name.lastIndexOf(".")));
    const dest = path.join(destDir, destFile);

    await fsp.writeFile(dest, content);
    this.#writeCreateMsg(dest);

    return (Promise.resolve());
  }

  static #validateHbsExtension(fileName: string): boolean {
    const split = fileName.split(".");
    if ((split.length > 2) && (split[split.length - 1].toLocaleLowerCase() === "hbs")) {
      return (true);
    }

    return (false);
  }

  #writeCreateMsg(destination: string) {
    const destFileStat = statSync(destination);
    const finalDest = destination.substring(this.#generateInput!.path.length);

    writeLine(`${chalk.green("CREATE")} ${finalDest} (${destFileStat.size} bytes)`);
  }

  async #npmInstall() {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");
    Assert.defined(this.#templateConfig, "Generator::Invalid template config handler");

    const spinner = new Spinner(Frames.arc, Colors.cyan, "Installing Packages(npm)...");
    spinner.start();

    try {
      if (this.#templateConfig.install) {
        await this.#npmInstallDependencies();
        await this.#npmInstallDevDependencies();

        spinner.stop();
        overwriteLine(`${chalk.cyan("√")} Packages Installed Successfully.`);

        return (Promise.resolve());
      }

      // Install npm packages which are already mentioned in package.json,
      // if config.js doesn't contain any install package information
      const dest = path.join(this.#generateInput.path, this.#generateInput.package.name);
      await spawnAsync("npm.cmd", ["install", "--legacy-peer-deps"], { cwd: dest });

      spinner.stop();
      overwriteLine(`${chalk.cyan("√")} Packages Installed Successfully.`);

      return (Promise.resolve());
    } catch (err) {
      spinner.stop();
      clearLine();
      console.log(err);
      overwriteLine(`${chalk.red("X")} Packages Installation Failed.`);

      return (Promise.resolve());
    }
  }

  async #npmInstallDependencies() {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");
    Assert.defined(this.#templateConfig, "Generator::Invalid template config handler");

    if (this.#templateConfig.install.dependencies) {
      const dest = path.join(this.#generateInput.path, this.#generateInput.package.name);
      return (spawnAsync(
        "npm.cmd",
        [
          "install",
          "--legacy-peer-deps",
          ...this.#templateConfig.install.dependencies
        ],
        { cwd: dest }
      ));
    }

    return (Promise.resolve({ stdout: "", stderr: "" }));
  }

  async #npmInstallDevDependencies() {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");
    Assert.defined(this.#templateConfig, "Generator::Invalid template config handler");

    if (this.#templateConfig.install.devDependencies) {
      const dest = path.join(this.#generateInput.path, this.#generateInput.package.name);
      return (spawnAsync(
        "npm.cmd",
        [
          "install",
          "--legacy-peer-deps",
          "--save-dev",
          ...this.#templateConfig.install.devDependencies
        ],
        { cwd: dest }
      ));
    }

    return (Promise.resolve({ stdout: "", stderr: "" }));
  }

  async #npmWrite() {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");
    Assert.defined(this.#templateConfig, "Generator::Invalid template config handler");

    const spinner = new Spinner(Frames.arc, Colors.cyan, "Installing Packages(npm)...");
    spinner.start();

    try {
      if (this.#templateConfig.install) {
        const dependencies = await this.npmDependencies();
        const devDependencies = await this.npmDevDependencies();

        // read/write package.js file
        const dest = path.join(this.#generateInput.path, this.#generateInput.package.name);
        const packageFile = path.join(dest, "package.json");
        const json = await esm.load(packageFile);

        json.dependencies = dependencies;
        json.devDependencies = devDependencies;

        await fsp.writeFile(packageFile, JSON.stringify(json, null, 2));
      }

      spinner.stop();
      overwriteLine(`${chalk.cyan("√")} Packages Installed Successfully.`);
      return (Promise.resolve());
    } catch (err) {
      spinner.stop();
      clearLine();
      console.log(err);
      overwriteLine(`${chalk.red("X")} Packages Installation Failed.`);

      return (Promise.resolve());
    }
  }

  async npmDependencies() {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");
    Assert.defined(this.#templateConfig, "Generator::Invalid template config handler");

    if (this.#templateConfig.install.dependencies) {
      const promises = this.#templateConfig.install.dependencies.map((pkg: string) => (Generator.#npmVersion(pkg)));

      let obj = {};
      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        obj = Object.assign(obj, response);
      });

      return (obj);
    }

    return (Promise.resolve({}));
  }

  async npmDevDependencies() {
    Assert.defined(this.#generateInput, "Generator::Invalid input handler");
    Assert.defined(this.#templateConfig, "Generator::Invalid template config handler");

    if (this.#templateConfig.install.devDependencies) {
      const promises = this.#templateConfig.install.devDependencies.map((pkg: string) => (Generator.#npmVersion(pkg)));

      let obj = {};
      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        obj = Object.assign(obj, response);
      });

      return (obj);
    }

    return (Promise.resolve({}));
  }

  static async #npmVersion(pkg: string): Promise<{[key: string]: string}> {
    const split = pkg.split("@");
    if ((split.length === 2) && (split[0].length > 0) && (split[1].length > 0)) {
      const obj: {[key: string]: string} = {};
      obj[split[0]] = `^${split[1]}`;

      return (obj);
    }

    const { stdout } = await spawnAsync("npm.cmd", ["view", pkg, "version"]);
    const stdoutStr = stdout.toString();
    const version = stdoutStr.substring(0, stdoutStr.indexOf("\n"));

    const obj: {[key: string]: string} = {};
    obj[pkg] = `^${version}`;

    return (obj);
  }

  // private getNewCommands(commands: CommandArgument[]): string {
  //   const newCommands = "";

  //   commands.forEach((element) => {
  //     // use hbs to create this string.
  //   });

  //   return ("");
  // }
}
