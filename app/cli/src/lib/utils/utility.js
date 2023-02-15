"use strict";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { accessSync, constants } from "fs";
// import pkg from "../../../package.json" assert {type: "json"};
const require = createRequire(import.meta.url);
const pkg = require("../../../package.json");
function accessible(dir, mode) {
    let state = false;
    if (dir.length > 0) {
        // state = true;
        try {
            accessSync(dir, mode);
            state = true;
        }
        catch (err) {
            state = false;
        }
    }
    return state;
}
const FilesystemStream = {
    writable(sharedPath) {
        return accessible(sharedPath, constants.W_OK);
    },
    readable(sharedPath) {
        return accessible(sharedPath, constants.R_OK);
    },
    validate(dir) {
        let state = false;
        if (dir.length > 0) {
            // eslint-disable-next-line no-useless-escape
            const pass = dir.match(/^(?:[\w]\:|\\)(\\[a-z|A-Z_\-\s0-9\.]+)+$/gm);
            if (pass)
                state = true;
        }
        return state;
    },
};
const Utils = {
    /**
     * Capitalize the First letter of the input string.
     *
     * @param {string} origin The string to capitalize
     * @returns string  Capitalized string
     */
    capitalizeFirstLetter([first, ...rest]) {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        return first.toLocaleUpperCase(locale) + rest.join("");
        // return first.toUpperCase() + rest.join("");
    },
    /**
     * Find all the occurrences of {@link search} string and replace them with {@link replace} string.
     *
     * @param {string} origin The string on which replaced sub-string
     * @param {string} search The search string
     * @param {string} replace The replace string
     * @returns {string} Replaced {@link origin} string
     */
    replaceAll(origin, search, replace) {
        return origin.split(search).join(replace);
    },
    /**
     * Replica of __filename variable. It'll be used when building
     * nodejs app using ES6 module style, as __filename is not define in
     * case of ES6 module style.
     *
     * @param {string} url provide `import.meta.url` as url.
     *
     * @returns {string} current file name with full-path.
     */
    filename(url) {
        return fileURLToPath(url);
    },
    /**
     * Replica of __dirname variable. It'll be used when building
     * nodejs app using ES6 module style, as __dirname is not define in
     * case of ES6 module style.
     *
     * @param {string} url provide `import.meta.url` as url.
     *
     * @returns {string} current directory path.
     */
    dirname(url) {
        const name = path.dirname(this.filename(url));
        return name;
    },
    packageJson() {
        return pkg;
    },
    getEnv(name) {
        if (name && name.length > 0) {
            return process.env[name];
        }
        return undefined;
    },
    cmdUsageHelpMsg(name) {
        if (name) {
            return `Please check Usage for '${name}' command using below:
$ ${pkg.name} help ${name}`;
        }
        return "";
    },
    // TODO: delete this method before publish
    formatToHMS(milliseconds) {
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
            hr: hours, min: minutes, sec: seconds, msec
        };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    display(message, ...optionalParams) {
        // eslint-disable-next-line no-console
        console.log(message, ...optionalParams);
    },
    require,
    FilesystemStream,
};
export { Utils };
//# sourceMappingURL=utility.js.map