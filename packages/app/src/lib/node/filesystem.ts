import path from "path";
import * as fs from "fs";
import fsp from "fs/promises";

// export modules define another file but related to FileSystem
// TODO: remove below line & check any failure happen or not.
export * from "./appdata.js";

export type FileInfo = {
  name: string;
  path: string;
};

function accessible(pathname: string, mode: number) {
  let state = false;

  if (pathname.length > 0) {
    // state = true;

    try {
      fs.accessSync(pathname, mode);
      state = true;
    } catch (err) {
      state = false;
    }
  }

  return state;
}

export function isExtension(filename: string, ext: string): boolean {
  let status = false;

  if ((filename.length > 0) && (ext.length > 0)) {
    const extension = path.extname(filename).toLowerCase();
    const extensionWithoutDot = extension.substring(1);

    if (extensionWithoutDot === ext.toLowerCase()) status = true;
  }

  return (status);
}

export function writable(pathname: string): boolean {
  return accessible(pathname, fs.constants.W_OK);
}

export function readable(pathname: string): boolean {
  return accessible(pathname, fs.constants.R_OK);
}

export function exists(pathname: string): boolean {
  return (fs.existsSync(pathname));
}

async function getFiles(parent: string): Promise<FileInfo[]> {
  const dirs = await fsp.readdir(parent, { withFileTypes: true });
  const fileInfos = dirs.filter((dir) => dir.isFile()).map((dir) => ({ name: dir.name, path: parent }));

  return (fileInfos);
}

async function getFilesRecursively(parent: string): Promise<FileInfo[]> {
  // eslint-disable-next-line no-shadow
  const fileInfos: FileInfo[] = [];
  const promises: Promise<FileInfo[]>[] = [];
  const dirs = await fsp.readdir(parent, { withFileTypes: true });
  dirs.forEach((dir) => {
    if (dir.isFile()) fileInfos.push({ name: dir.name, path: parent });
    else if (dir.isDirectory()) promises.push(getFilesRecursively(path.join(parent, dir.name)));
  });

  if (promises.length > 0) {
    const responses = await Promise.all(promises);
    responses.forEach((response) => {
      fileInfos.push(...response);
    });
  }

  return (fileInfos);
}

export async function copyFile(
  sourceFile: string,
  destinationFile: string,
  cb?: (source: string, dest: string, error: Error|null) => void,
): Promise<void> {
  const destination = path.dirname(destinationFile);

  // check destination folder exists or not
  return (fsp.stat(destination)
    .then((/* stats */) => (fsp.copyFile(sourceFile, destinationFile)))
    .catch((/* err */) => {
      // if not create it(recursively)
      // paste file to destination folder.
      const promise = fsp.mkdir(destination, { recursive: true });
      return (promise.then((/* response */) => (fsp.copyFile(sourceFile, destinationFile))));
    })
    .finally(() => {
      if (cb) cb(sourceFile, destinationFile, null);
    })
  );
}

function copyFileSync(sourceFile: string, destinationFile: string) {
  const destination = path.dirname(destinationFile);
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // copy files
  fs.copyFileSync(sourceFile, destinationFile);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function copyRecursively(
  source: string,
  destination: string,
  cb?: (source: string, dest: string, error: Error|null) => void,
): Promise<void> {
  // read current directory & loop over it's items
  const items = await fsp.readdir(source, { withFileTypes: true });
  const promises = items.map((item) => {
    const sourceItem = path.join(source, item.name);
    const destItem = path.join(destination, item.name);

    if (item.isFile()) {
      return (copyFile(sourceItem, destItem, cb));
    } if (item.isDirectory()) {
      return (copyRecursively(sourceItem, destItem, cb));
    }

    return (Promise.resolve());
  });

  await Promise.all(promises);
  return (Promise.resolve());
}

export function directories(pathname: string /* , options?: {recursive: boolean} */): Promise<FileInfo[]> {
  return (fsp.readdir(pathname, { withFileTypes: true })
    .then((dirs) => (dirs
      .filter((dir) => dir.isDirectory())
      .map((dir) => ({ name: dir.name, path: pathname }))
    ))
  );
}

export async function files(parent: string, options?: { recursive: boolean }): Promise<FileInfo[]> {
  if (parent.length > 0) {
    if (options && options.recursive) return (getFilesRecursively(parent));
    return (getFiles(parent));
  }
  throw (new Error("Filesystem::files():: Invalid input."));
}

export function copySync(source: string, destination: string) {
  const items = fs.readdirSync(source, { withFileTypes: true });
  items.forEach((item) => {
    const sourceItem = path.join(source, item.name);
    const destItem = path.join(destination, item.name);

    // if file then copy/paste
    if (item.isFile()) {
      copyFileSync(sourceItem, destItem);
    } if (item.isDirectory()) {
      copySync(sourceItem, destItem);
    }
  });
}

// export async function copy(source: string, destination: string): Promise<void>
export async function copy(
  source: string,
  destination: string,
  cb?: (source: string, dest: string, error: Error|null) => void,
): Promise<void> {
  if (cb) {
    // TODO: check source is file or folder, if file then call copyFile(...)
    return (copyRecursively(source, destination, cb));
  }

  const dest = path.dirname(destination);
  if (!fs.existsSync(dest)) {
    await fsp.mkdir(dest, { recursive: true });
  }
  return (copyFile(source, destination));
}

// export async function copy(source: string, destination: string) {
//   const dest = path.dirname(destination);
//   if (!fs.existsSync(dest)) {
//     await fsp.mkdir(dest, { recursive: true });
//   }

//   return (copyFile(source, destination));
// }

/**
 *
 * @param source - the directory to move/cut
 * @param destination - the directory where to move/cut
 * @returns - Fulfills with undefined upon success.
 */
export async function cut(source: string, destination: string) {
  const dest = path.dirname(destination);
  if (!fs.existsSync(dest)) {
    await fsp.mkdir(dest, { recursive: true });
  }

  return (fsp.rename(source, destination));
}
