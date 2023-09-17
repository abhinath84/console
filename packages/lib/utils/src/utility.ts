import { v4 } from "uuid";

export function uuid() {
  return (v4());
}

/**
   * Capitalize the First letter of the input string.
   *
   * @param {string} origin The string to capitalize
   * @returns string  Capitalized string
   */
export function capitalizeFirstLetter([first, ...rest]: string): string {
  const { locale } = Intl.DateTimeFormat().resolvedOptions();
  return first.toLocaleUpperCase(locale) + rest.join("");

  // return first.toUpperCase() + rest.join("");
}

export function getEnv(name: string): string | undefined {
  if (name && name.length > 0) {
    return process.env[name];
  }
  return undefined;
}
