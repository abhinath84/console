// import { AssertionError } from "assert";

export function ok(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function defined<T>(value: T, message: string): asserts value is NonNullable<T> {
  // `Expected 'val' to be defined, but received ${val}`
  if ((value === undefined) || (value === null)) throw (new Error(message));
}

// export function type<T>(value: unknown, cast: string, message: string): asserts value is T {
//   if (typeof value === cast) return;
//   throw (new Error(message));
// }
