import fs from "fs";
import path from "path";
import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
import { esm } from "@typesys/node";
import { Is, AnyFunction } from "@typesys/validation";

// import project related modules.
// eslint-disable-next-line import/no-cycle
import { parseProgram } from "./commands.js";
import { Utils } from "../utils/utility.js";
import { errorHandler } from "./errors.js";

const __dirname = Utils.dirname(import.meta.url);
const cmdDirs = path.join(__dirname, "../cmd");
const pkg = Utils.packageJson();

interface Engine {
  isLoaded: boolean;
  readonly version: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const api: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
const cli: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

// It makes sense to ensure that engine was bootstrapped properly,
// especially for programmatic use.
// To keep track of the async bootstrapping `status`, we set `engine.loaded` to `false`.
export const engine: Engine = {
  isLoaded: false,
  version: Utils.packageJson().version,
};

function showFiglet() {
  const name = Object.keys(pkg.bin)[0] || pkg.name;
  const figletText = figlet.textSync(`   ${name.toUpperCase()}`, { horizontalLayout: "full" });
  Utils.display(chalk.cyan(`${figletText}v${engine.version}`));
  Utils.display("\n");
}

function register(
  parent: Record<string, AnyFunction>,
  child: Record<string, AnyFunction>|AnyFunction,
  cmd: string,
): void {
  if (Is.function(child)) {
    parent[cmd] = child; // eslint-disable-line no-param-reassign
  } else if (Is.object(child)) {
    Object.keys(child).forEach((key) => {
      if (Is.function(child[key])) {
        parent[key] = child[key]; // eslint-disable-line no-param-reassign
      }
    });
  }
}

function loadCmds(files: string[]): Promise<boolean> {
  if (files && files.length > 0) {
    const jsFiles = files.filter((file) => file.match(/(.*)\.js$/));

    // load modules
    const promises = jsFiles.map((jsFile) => esm.load(path.resolve(cmdDirs, jsFile)).then((module) => ({
      cmd: jsFile.match(/(.*)\.js$/)![1], // eslint-disable-line @typescript-eslint/no-non-null-assertion
      mod: module,
    })));

    return Promise.all(promises).then((responses) => {
      responses.forEach((response) => {
        if (response.mod.cli) {
          register(cli, response.mod.cli, response.cmd);
        }

        if (response.mod.api) {
          register(api, response.mod.api, response.cmd);
        }
      });

      return Promise.resolve(true);
    });
  }
  return Promise.reject(new TypeError("Unable to load commands."));
}

function loadCallback(): Promise<Engine> {
  return new Promise((resolve, reject) => {
    fs.readdir(cmdDirs, (err, files) => {
      if (err) {
        reject(err);
      } else {
        loadCmds(files)
          .then((loaded) => {
            engine.isLoaded = loaded;

            if (loaded) return resolve(engine);
            return reject(new TypeError("Fail to load command modules."));
          })
          .catch(reject);
      }
    });
  });
}

function parseCallback(): Command {
  showFiglet();

  return parseProgram();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function actionCallback(cmd: string, ...args: any[]): void {
  // check
  if (cli[cmd]) {
    cli[cmd].apply(null, [...args]).catch(errorHandler);
  } else {
    throw new TypeError(`${cmd} is not present in 'engine' module.`);
  }
}

// Assigning functions to engine object.
engine.load = loadCallback;
engine.parse = parseCallback;
engine.action = actionCallback;

Object.defineProperty(engine, "commands", {
  get: () => {
    if (engine.isLoaded === false) {
      throw new Error("run engine.load before");
    }

    return api;
  },
});

Object.defineProperty(engine, "cli", {
  get: () => {
    if (engine.isLoaded === false) {
      throw new Error("run engine.load before");
    }

    return cli;
  },
});
