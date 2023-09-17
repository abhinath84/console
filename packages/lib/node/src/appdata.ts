import { join } from "path";
import { platform, homedir } from "os";

function getForWindows() {
  return join(homedir(), "AppData", "Roaming");
}

function getForMac() {
  return join(homedir(), "Library", "Application Support");
}

function getForLinux() {
  return join(homedir(), ".config");
}

function getFallback() {
  if (platform().startsWith("win")) {
    // maybe its win64?
    return getForWindows();
  }
  return getForLinux();
}

export function appdata(name?: string) {
  // get appdata folder
  let appDataPath = process.env.APPDATA;
  if (appDataPath === undefined) {
    switch (platform()) {
    case "win32":
      appDataPath = getForWindows();
      break;
    case "darwin":
      appDataPath = getForMac();
      break;
    case "linux":
      appDataPath = getForLinux();
      break;
    default:
      appDataPath = getFallback();
    }
  }

  if (name === undefined) {
    return appDataPath;
  }

  const normalizedAppName = appDataPath !== homedir() ? name : `.${name}`;
  return join(appDataPath, normalizedAppName);
}
