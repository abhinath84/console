import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { readFile } from "fs/promises";

const nodeRequire = createRequire(import.meta.url);

function isBrowser(): boolean {
  return ((typeof window !== "undefined")
         && (Object.prototype.toString.call(window) === "[object Window]"));
}

// ::NOTE:: enable below method when needed
// function isNode(): boolean {
//   return ((typeof global !== "undefined")
//          && (Object.prototype.toString.call(global) === "[object global]"));
// }

/**
* Replica of __filename variable. It'll be used when building
* nodejs app using ES6 module style, as __filename is not define in
* case of ES6 module style.
*
* @param {string} url provide `import.meta.url` as url.
*
* @returns {string} current file name with full-path.
*/
export function filename(url: string) {
  return (fileURLToPath(url));
}

/**
* Replica of __dirname variable. It'll be used when building
* nodejs app using ES6 module style, as __dirname is not define in
* case of ES6 module style.
*
* @param {string} url provide `import.meta.url` as url.
*
* @returns {string} current directory path.
*/
export function dirname(url: string) {
  const name = path.dirname(filename(url));
  return (name);
}

export function require(pathOrUrl: string) {
  return nodeRequire(pathOrUrl);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function load(fileName: string): Promise<any> {
  if (isBrowser()) {
    return (import(fileName));
  }
  // Node.js 12.0.0 has node_module_version=72
  // https://nodejs.org/en/download/releases/
  // const nodeVint = process.config.variables.node_module_version;

  // The dynamic import() keyword supports both CommonJS files
  // (.js, .cjs) and ESM files (.mjs), so we could simply use that unconditionally on
  // newer Node versions, regardless of the given file path.
  //
  // But:
  // - Node.js 12 emits a confusing "ExperimentalWarning" when using import(),
  //   even if just to load a non-ESM file. So we should try to avoid it on non-ESM.
  // - This Node.js feature is still considered experimental so to avoid unexpected
  //   breakage we should continue using require(). Consider flipping once stable and/or
  //   as part of QUnit 3.0.
  // - Plugins and CLI bootstrap scripts may be hooking into require.extensions to modify
  //   or transform code as it gets loaded. For compatibility with that, we should
  //   support that until at least QUnit 3.0.
  // - File extensions are not sufficient to differentiate between CJS and ESM.
  //   Use of ".mjs" is optional, as a package may configure Node to default to ESM
  //   and optionally use ".cjs" for CJS files.
  //
  // https://nodejs.org/docs/v12.7.0/api/modules.html#modules_addenda_the_mjs_extension
  // https://nodejs.org/docs/v12.7.0/api/esm.html#esm_code_import_code_expressions
  try {
    return require(fileName); // eslint-disable-line global-require, import/no-dynamic-require
  } catch (e : any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (((e.code === "ERR_REQUIRE_ESM"
              || (e instanceof SyntaxError
                && e.message === "Cannot use import statement outside a module")))
            || (e.message === "require is not defined")) {
      // Resolving 'Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]' issue.
      // const path = await import("path");
      if (path.isAbsolute(fileName)) {
        const { pathToFileURL } = await import("url");
        return import(pathToFileURL(fileName).href);
      }
      return import(fileName);
    }
    throw e;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadJson<T extends Record<string, any>>(jsonFileName: string) {
  if (jsonFileName.length > 0) {
    const content = await readFile(jsonFileName, "utf-8");
    const json = <T>(JSON.parse(content));
    return (json);
  }
  throw (new Error("loadJson::Invalid filename!"));
}
