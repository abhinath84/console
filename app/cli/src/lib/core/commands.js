"use strict";
// import standard & node_modules
import { Command } from "commander";
// import project modules
import { engine } from "./engine.js";
import { Utils } from "../utils/utility.js";
const pkg = Utils.packageJson();
// add commands.
const program = new Command();
program
    .name(pkg.name)
    .version(pkg.version)
    .description(pkg.description);
// Generate cli application project
program
    .command("generate")
    .description("Generate cli application project")
    .argument("<project-name>", "Project name")
    .option("-y, --yes", "Generate project with default options")
    .option("-p, --path <destination-path>", "Path where to generate cli project")
    .action((project, options) => engine.action("generate", project, options));
program
    .command("command")
    .description("Add new command with minimal structure")
    .option("-p, --project", "Existing cli project path")
    .option("-n, --mane", "New command name")
    .action((options) => engine.action("command", options));
export function parseProgram() {
    return (program.parse(process.argv));
}
//# sourceMappingURL=commands.js.map