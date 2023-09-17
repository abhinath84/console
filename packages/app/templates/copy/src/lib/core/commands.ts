// import standard & node_modules
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

// Sample greeting command
program
  .command("greet")
  .description("Generate cli application project")
  .argument("<name>", "Your name")
  .option("-n, --note <text>", "Additional note")
  .action((name, options) => engine.action("greet", name, options));

export function parseProgram() {
  return (program.parse(process.argv));
}
