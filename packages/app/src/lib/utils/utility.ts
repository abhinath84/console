import { createRequire } from "module";

// import pkg from "../../../package.json" assert {type: "json"};

const require = createRequire(import.meta.url);
const pkg = require("../../../package.json");

const Utils = {
  /**
   * Find all the occurrences of {@link search} string and replace them with {@link replace} string.
   *
   * @param {string} origin The string on which replaced sub-string
   * @param {string} search The search string
   * @param {string} replace The replace string
   * @returns {string} Replaced {@link origin} string
   */
  replaceAll(origin: string, search: string, replace: string): string {
    return origin.split(search).join(replace);
  },
  packageJson() {
    return pkg;
  },
  cmdUsageHelpMsg(name: string): string {
    if (name) {
      return `Please check Usage for '${name}' command using below:
$ ${pkg.name} help ${name}`;
    }
    return "";
  },
  // TODO: delete this method before publish
  formatToHMS(milliseconds: number): { hr: number; min: number; sec: number; msec: number } {
    let seconds = Math.floor(milliseconds / 1000);
    const msec = milliseconds % 1000;
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds %= 60;
    // 👇️ if seconds are greater than 30, round minutes up (optional)
    minutes = seconds >= 30 ? minutes + 1 : minutes;

    minutes %= 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours %= 24;

    return {
      hr: hours, min: minutes, sec: seconds, msec,
    };
  }
};

export { Utils };
