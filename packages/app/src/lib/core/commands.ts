import { Command } from "commander";

// import project modules
// eslint-disable-next-line import/no-cycle
import { engine } from "./engine.js";
import { Utils } from "../utils/utility.js";

const pkg = Utils.packageJson();

// add commands.
const program = new Command();

program
  .name(Object.keys(pkg.bin)[0] || pkg.name)
  .version(pkg.version)
  .description(pkg.description);

// Generate cli application project
program
  .command("generate")
  .alias("gen")
  .description("Generate cli application project")
  .argument("<ame>", "Project name")
  .option(
    "-y, --yes",
    "Generate project with default options. [boolean][Default: true]"
  )
  .option(
    "-p, --path <directory>",
    "The directory name to create the workspace in. [string][Default: working directory]"
  )
  .action((name, options) => engine.action("generate", name, options));

program
  .command("command")
  .alias("cmd")
  .description("Add new command with minimal structure")
  .option("--json", "command.json file path")
  .action((options) => engine.action("command", options));

export function parseProgram() {
  return (program.parse(process.argv));
}
